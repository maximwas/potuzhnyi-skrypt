import MagicString, { type SourceMap } from 'magic-string';

import type { MemeDictionary } from '../dictionary/meme-dictionary.ts';
import type { LatinTransliterator } from '../transliteration/latin-transliterator.ts';
import type { IdentifierScanner, SourceIdentifier } from './identifier-scanner.ts';
import { NameCollisionError } from './name-collision-error.ts';

// Одна заміна в тексті: діапазон у вихідному коді, що саме було й що стало.
export interface Replacement {
  readonly start: number;
  readonly end: number;
  readonly original: string;
  readonly replacement: string;
}

export interface TranslationResult {
  readonly code: string;
  readonly sourceMap: SourceMap;
  readonly replacements: readonly Replacement[];
}

interface TranslatorDependencies {
  readonly identifierScanner: IdentifierScanner;
  readonly memeDictionary: MemeDictionary;
  readonly latinTransliterator: LatinTransliterator;
}

interface TranslationContext {
  readonly source: string;
  readonly fileName: string;
  readonly editor: MagicString;
  readonly originalNamesByLatinName: Map<string, string>;
  readonly replacements: Replacement[];
}

// Ціль словника, що не починається з літери, _ чи $, — символ оператора.
const OPERATOR_START = /^[^\p{ID_Start}$_]/u;
const WHITESPACE = /\s/;

export class Translator {
  private readonly identifierScanner: IdentifierScanner;
  private readonly memeDictionary: MemeDictionary;
  private readonly latinTransliterator: LatinTransliterator;

  public constructor({
    identifierScanner,
    memeDictionary,
    latinTransliterator,
  }: TranslatorDependencies) {
    this.identifierScanner = identifierScanner;
    this.memeDictionary = memeDictionary;
    this.latinTransliterator = latinTransliterator;
  }

  public translate(source: string, fileName: string): TranslationResult {
    const context: TranslationContext = {
      source,
      fileName,
      editor: new MagicString(source),
      originalNamesByLatinName: new Map(),
      replacements: [],
    };

    for (const identifier of this.identifierScanner.scan(source)) {
      this.translateIdentifier(identifier, context);
    }

    return {
      code: context.editor.toString(),
      sourceMap: context.editor.generateMap({
        source: fileName,
        includeContent: true,
        hires: true,
      }),
      replacements: context.replacements,
    };
  }

  private translateIdentifier(identifier: SourceIdentifier, context: TranslationContext): void {
    const jsWord = identifier.isPrivate
      ? undefined
      : this.memeDictionary.findJsWord(identifier.name);

    if (jsWord !== undefined) {
      this.overwrite(identifier, this.padOperator(identifier, jsWord, context.source), context);

      return;
    }

    if (this.latinTransliterator.containsCyrillic(identifier.name)) {
      const latinName = this.toLatinName(identifier);

      this.claimLatinName(latinName, identifier, context);
      this.overwrite(identifier, latinName, context);
    }
  }

  // Слово-оператор не повинно зліплюватися із сусіднім символом: `відпил-1` інакше став би `--1`,
  // а `поділити/б` — коментарем `//б`.
  private padOperator(identifier: SourceIdentifier, jsWord: string, source: string): string {
    if (OPERATOR_START.test(jsWord) === false) {
      return jsWord;
    }

    const before = source.slice(identifier.start - 1, identifier.start);
    const after = source.slice(identifier.end, identifier.end + 1);
    const leftPadding = before === '' || WHITESPACE.test(before) ? '' : ' ';
    const rightPadding = after === '' || WHITESPACE.test(after) ? '' : ' ';

    return `${leftPadding}${jsWord}${rightPadding}`;
  }

  private toLatinName(identifier: SourceIdentifier): string {
    if (identifier.isPrivate) {
      return `#${this.latinTransliterator.toLatin(identifier.name.slice(1))}`;
    }

    return this.latinTransliterator.toLatin(identifier.name);
  }

  // shortcut: колізії латиниці шукаємо в межах одного файлу, а не між модулями;
  // посилити, коли зʼявляться пакети з .potuzhno-файлів
  private claimLatinName(
    latinName: string,
    identifier: SourceIdentifier,
    context: TranslationContext,
  ): void {
    const ownerName = context.originalNamesByLatinName.get(latinName);

    if (ownerName !== undefined && ownerName !== identifier.name) {
      throw new NameCollisionError({
        firstName: ownerName,
        secondName: identifier.name,
        latinName,
        fileName: context.fileName,
        line: this.lineNumberAt(context.source, identifier.start),
      });
    }

    context.originalNamesByLatinName.set(latinName, identifier.name);
  }

  private overwrite(
    identifier: SourceIdentifier,
    jsName: string,
    context: TranslationContext,
  ): void {
    if (context.source.slice(identifier.start, identifier.end) !== jsName) {
      context.editor.overwrite(identifier.start, identifier.end, jsName);

      context.replacements.push({
        start: identifier.start,
        end: identifier.end,
        original: context.source.slice(identifier.start, identifier.end),
        replacement: jsName,
      });
    }
  }

  private lineNumberAt(source: string, offset: number): number {
    return source.slice(0, offset).split('\n').length;
  }
}
