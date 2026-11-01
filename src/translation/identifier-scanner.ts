import type { Token } from 'js-tokens';

export type Tokenize = (source: string) => Iterable<Token>;

export interface SourceIdentifier {
  readonly name: string;
  readonly start: number;
  readonly end: number;
  readonly isPrivate: boolean;
}

interface IdentifierScannerDependencies {
  readonly tokenize: Tokenize;
}

interface PositionedToken {
  readonly token: Token;
  readonly start: number;
  readonly end: number;
}

const CURLY_APOSTROPHE = '’';
const MODIFIER_APOSTROPHE = 'ʼ';

export class IdentifierScanner {
  private readonly tokenize: Tokenize;

  public constructor({ tokenize }: IdentifierScannerDependencies) {
    this.tokenize = tokenize;
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

  private *positionTokens(source: string): Generator<PositionedToken> {
    let start = 0;

    for (const token of this.tokenize(source)) {
      const end = start + token.value.length;

      yield { token, start, end };

      start = end;
    }
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
