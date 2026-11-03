import type TypeScript from 'typescript';

import type { MemeDictionary } from '../../../src/dictionary/meme-dictionary.ts';
import { NameCollisionError } from '../../../src/translation/name-collision-error.ts';
import type { Replacement, Translator } from '../../../src/translation/translator.ts';

export type TypeScriptModule = typeof TypeScript;

export interface HoverInfo {
  readonly start: number;
  readonly end: number;
  readonly markdown: string;
}

interface HoverInfoServiceDependencies {
  readonly translator: Translator;
  readonly memeDictionary: MemeDictionary;
  readonly typescript: TypeScriptModule | undefined;
}

interface TranslatedFile {
  readonly source: string;
  readonly code: string;
  readonly replacements: readonly Replacement[];
  readonly version: number;
}

interface HoveredWord {
  readonly start: number;
  readonly end: number;
  readonly replacement: Replacement | undefined;
}

const VIRTUAL_FILE_NAME = '/potuzhno/current.js';
const IDENTIFIER_PART = /[\p{ID_Continue}$\u02BC]/u;

// Частини підпису TypeScript, у яких стоїть імʼя, а не службовий текст.
const NAME_PART_KINDS = new Set([
  'className',
  'localName',
  'functionName',
  'methodName',
  'propertyName',
  'parameterName',
  'aliasName',
  'enumName',
  'interfaceName',
  'moduleName',
]);

// Ключові слова оголошень повертаємо у мемні; решту (void, number, typeof у типах) лишаємо як є.
const DECLARATION_KEYWORDS = new Set([
  'const',
  'let',
  'var',
  'class',
  'function',
  'extends',
  'static',
  'async',
  'get',
  'set',
]);

// Підказки для власних імен: .potuzhno перекладається у віртуальний JS, його читає сервіс мови
// TypeScript, а імена в підписі повертаються до мемних і кириличних.
// shortcut: одне поточне джерело й один файл, імпорти між .potuzhno не розвʼязуються; посилити,
// коли зʼявляться модулі з кількох файлів.
// shortcut: латинь імені, що збігається з JS-словом (мап → map), у підписі читається як мемне слово.
export class HoverInfoService {
  private readonly translator: Translator;
  private readonly memeDictionary: MemeDictionary;
  private readonly typescript: TypeScriptModule | undefined;
  private languageService: TypeScript.LanguageService | undefined;
  private file: TranslatedFile = { source: '', code: '', replacements: [], version: 0 };

  public constructor({ translator, memeDictionary, typescript }: HoverInfoServiceDependencies) {
    this.translator = translator;
    this.memeDictionary = memeDictionary;
    this.typescript = typescript;
  }

  public hoverAt(source: string, offset: number): HoverInfo | undefined {
    if (this.translate(source) === false) {
      return undefined;
    }

    const word = this.findWord(offset);

    if (word === undefined) {
      return undefined;
    }

    const markdown = [this.describeMeme(word), this.describeSymbol(word)]
      .filter((part) => part !== '')
      .join('\n\n');

    if (markdown === '') {
      return undefined;
    }

    return { start: word.start, end: word.end, markdown };
  }

  // false, коли файл не перекладається (наприклад, колізія латинських імен): підказок немає.
  private translate(source: string): boolean {
    if (source === this.file.source) {
      return true;
    }

    try {
      const { code, replacements } = this.translator.translate(source, 'hover.potuzhno');

      this.file = { source, code, replacements, version: this.file.version + 1 };

      return true;
    } catch (error) {
      if (error instanceof NameCollisionError) {
        return false;
      }

      throw error;
    }
  }

  private findWord(offset: number): HoveredWord | undefined {
    const { source, replacements } = this.file;
    const replacement = replacements.find(({ start, end }) => start <= offset && offset < end);

    if (replacement !== undefined) {
      return { start: replacement.start, end: replacement.end, replacement };
    }

    let start = offset;
    let end = offset;

    while (start > 0 && IDENTIFIER_PART.test(source.charAt(start - 1))) {
      start -= 1;
    }

    while (end < source.length && IDENTIFIER_PART.test(source.charAt(end))) {
      end += 1;
    }

    return start === end ? undefined : { start, end, replacement: undefined };
  }

  private describeMeme({ replacement }: HoveredWord): string {
    if (
      replacement === undefined ||
      this.memeDictionary.findJsWord(replacement.original) === undefined
    ) {
      return '';
    }

    return `\`${replacement.original}\` → \`${replacement.replacement.trim()}\``;
  }

  private describeSymbol(word: HoveredWord): string {
    const info = this.getLanguageService()?.getQuickInfoAtPosition(
      VIRTUAL_FILE_NAME,
      this.toGeneratedOffset(word.start),
    );

    if (info === undefined || this.typescript === undefined) {
      return '';
    }

    const names = this.collectNames();
    const signature = (info.displayParts ?? [])
      .map((part) => this.restoreName(part, names))
      .join('');
    const documentation = this.typescript.displayPartsToString(info.documentation);

    return [`\`\`\`typescript\n${signature}\n\`\`\``, documentation]
      .filter((part) => part !== '')
      .join('\n\n');
  }

  // Зсув початку слова у вихідному тексті до позиції у перекладеному: усі заміни ліворуч міняють довжину.
  private toGeneratedOffset(offset: number): number {
    let shift = 0;

    for (const replacement of this.file.replacements) {
      if (offset < replacement.start) {
        break;
      }

      if (offset < replacement.end) {
        const padding = replacement.replacement.length - replacement.replacement.trimStart().length;

        return replacement.start + shift + padding;
      }

      shift += replacement.replacement.length - (replacement.end - replacement.start);
    }

    return offset + shift;
  }

  private collectNames(): ReadonlyMap<string, string> {
    return new Map(
      this.file.replacements.map(({ original, replacement }) => [replacement.trim(), original]),
    );
  }

  private restoreName(
    part: TypeScript.SymbolDisplayPart,
    names: ReadonlyMap<string, string>,
  ): string {
    if (NAME_PART_KINDS.has(part.kind)) {
      return names.get(part.text) ?? this.memeDictionary.findMeme(part.text) ?? part.text;
    }

    if (part.kind === 'keyword' && DECLARATION_KEYWORDS.has(part.text)) {
      return this.memeDictionary.findMeme(part.text) ?? part.text;
    }

    return part.text;
  }

  private getLanguageService(): TypeScript.LanguageService | undefined {
    if (this.typescript === undefined) {
      return undefined;
    }

    this.languageService ??= this.createLanguageService(this.typescript);

    return this.languageService;
  }

  private createLanguageService(typescript: TypeScriptModule): TypeScript.LanguageService {
    const options: TypeScript.CompilerOptions = {
      allowJs: true,
      target: typescript.ScriptTarget.ESNext,
      lib: ['lib.esnext.d.ts', 'lib.dom.d.ts'],
      types: [],
      noEmit: true,
      skipLibCheck: true,
    };
    const readFile = (fileName: string): string | undefined =>
      fileName === VIRTUAL_FILE_NAME ? this.file.code : typescript.sys.readFile(fileName);

    const host: TypeScript.LanguageServiceHost = {
      getCompilationSettings: () => options,
      getScriptFileNames: () => [VIRTUAL_FILE_NAME],
      getScriptVersion: (fileName) =>
        fileName === VIRTUAL_FILE_NAME ? String(this.file.version) : '0',
      getScriptSnapshot: (fileName) => {
        const text = readFile(fileName);

        return text === undefined ? undefined : typescript.ScriptSnapshot.fromString(text);
      },
      getCurrentDirectory: () => '/',
      getDefaultLibFileName: (compilerOptions) => typescript.getDefaultLibFilePath(compilerOptions),
      fileExists: (fileName) =>
        fileName === VIRTUAL_FILE_NAME || typescript.sys.fileExists(fileName),
      readFile,
    };

    return typescript.createLanguageService(host, typescript.createDocumentRegistry());
  }
}
