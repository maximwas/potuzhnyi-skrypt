import type { Token } from 'js-tokens';

import type { MemeDictionary } from '../dictionary/meme-dictionary.ts';

export type Tokenize = (source: string) => Iterable<Token>;

export interface SourceIdentifier {
  readonly name: string;
  readonly start: number;
  readonly end: number;
  readonly isPrivate: boolean;
}

// Шлях у рядку імпорту: діапазон без лапок.
export interface SourceImportSpecifier {
  readonly value: string;
  readonly start: number;
  readonly end: number;
}

interface IdentifierScannerDependencies {
  readonly tokenize: Tokenize;
  readonly memeDictionary: MemeDictionary;
}

interface PositionedToken {
  readonly token: Token;
  readonly start: number;
  readonly end: number;
}

const CURLY_APOSTROPHE = '’';
const MODIFIER_APOSTROPHE = 'ʼ';

// JS-слова й оператори, після яких «/» відкриває регулярний вираз, а не ділення
const WORDS_BEFORE_EXPRESSION = new Set([
  'await',
  'case',
  'delete',
  'do',
  'else',
  'in',
  'instanceof',
  'new',
  'of',
  'return',
  'throw',
  'typeof',
  'void',
  'yield',
  '+',
  '-',
  '*',
  '/',
  '%',
]);

const TRIVIA_TOKEN_TYPES = new Set([
  'WhiteSpace',
  'LineTerminatorSequence',
  'SingleLineComment',
  'MultiLineComment',
]);

export class IdentifierScanner {
  private readonly tokenize: Tokenize;
  private readonly memeDictionary: MemeDictionary;

  public constructor({ tokenize, memeDictionary }: IdentifierScannerDependencies) {
    this.tokenize = tokenize;
    this.memeDictionary = memeDictionary;
  }

  public *scan(source: string): Generator<SourceIdentifier> {
    const tokens = [...this.positionTokens(source)];

    for (let index = 0; index < tokens.length; index += 1) {
      const { token, start } = tokens[index];

      if (token.type !== 'IdentifierName' && token.type !== 'PrivateIdentifier') {
        continue;
      }

      let { end } = tokens[index];
      let name = token.value;

      while (this.continuesAfterCurlyApostrophe(tokens, index)) {
        name += MODIFIER_APOSTROPHE + tokens[index + 2].token.value;
        end = tokens[index + 2].end;
        index += 2;
      }

      yield {
        name: name.normalize('NFC'),
        start,
        end,
        isPrivate: token.type === 'PrivateIdentifier',
      };
    }
  }

  // Рядки-шляхи в `імпорт "x"`, `імпорт … з "x"`, `вивезти … з "x"` і `імпорт("x")`.
  public *scanImportSpecifiers(source: string): Generator<SourceImportSpecifier> {
    const tokens = [...this.positionTokens(source)].filter(
      ({ token }) => !TRIVIA_TOKEN_TYPES.has(token.type),
    );

    for (let index = 1; index < tokens.length; index += 1) {
      const { token, start, end } = tokens[index];

      if (token.type === 'StringLiteral' && this.followsImportKeyword(tokens, index)) {
        yield { value: token.value.slice(1, -1), start: start + 1, end: end - 1 };
      }
    }
  }

  private followsImportKeyword(tokens: readonly PositionedToken[], index: number): boolean {
    const previousWord = this.findJsWord(tokens[index - 1].token);

    if (previousWord === 'from' || previousWord === 'import') {
      return true;
    }

    const isMemberAccess = tokens[index - 3]?.token.value === '.';

    return (
      tokens[index - 1].token.value === '(' &&
      this.findJsWord(tokens[index - 2]?.token) === 'import' &&
      !isMemberAccess
    );
  }

  // Мемне слово дає свій JS-відповідник, звичайне ім'я — себе: у файлі може бути й англійський JS.
  private findJsWord(token: Token | undefined): string | undefined {
    if (token?.type !== 'IdentifierName') {
      return undefined;
    }

    return this.memeDictionary.findJsWord(token.value.normalize('NFC')) ?? token.value;
  }

  private *positionTokens(source: string): Generator<PositionedToken> {
    let restartOffset: number | undefined = 0;

    while (restartOffset !== undefined) {
      restartOffset = yield* this.positionTokensFrom(source, restartOffset);
    }
  }

  // Токенізатор вирішує «регулярний вираз чи ділення» за попереднім токеном і знає лише JS-слова:
  // після мемного `відкат` він бачить звичайне ім'я й читає «/» як ділення. Тому перед «/» після
  // слова-виразу лексер стартує заново з цього місця, а повертає позицію для наступного запуску.
  // shortcut: лише слова-вирази й оператори; `щоб (умова) /re/` не виправляємо, бо так ніхто не
  // пише, а перезапуск усередині `${…}` губить вкладеність шаблону
  private *positionTokensFrom(
    source: string,
    offset: number,
  ): Generator<PositionedToken, number | undefined> {
    let start = offset;
    let previousValue = '';
    let expressionExpected = false;

    for (const token of this.tokenize(source.slice(offset))) {
      if (expressionExpected && token.type === 'Punctuator' && token.value.startsWith('/')) {
        return start;
      }

      const end = start + token.value.length;

      yield { token, start, end };

      if (!TRIVIA_TOKEN_TYPES.has(token.type)) {
        expressionExpected = this.expectsExpressionAfter(token, previousValue);
        previousValue = token.value;
      }

      start = end;
    }

    return undefined;
  }

  private expectsExpressionAfter(token: Token, previousValue: string): boolean {
    if (token.type !== 'IdentifierName' || previousValue === '.' || previousValue === '?.') {
      return false;
    }

    const jsWord = this.memeDictionary.findJsWord(token.value.normalize('NFC'));

    return jsWord !== undefined && WORDS_BEFORE_EXPRESSION.has(jsWord);
  }

  // «ім’я» з U+2019 токенізатор бачить як «ім», «’», «я»; у JS-імені дозволений лише ʼ (U+02BC)
  // shortcut: ’ на початку імені не склеюємо, бо такі імена в словнику не трапляються
  private continuesAfterCurlyApostrophe(
    tokens: readonly PositionedToken[],
    index: number,
  ): boolean {
    return (
      tokens[index + 1]?.token.value === CURLY_APOSTROPHE &&
      tokens[index + 2]?.token.type === 'IdentifierName'
    );
  }
}
