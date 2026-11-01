import { readFileSync } from 'node:fs';
import { registerHooks, setSourceMapsSupport } from 'node:module';

import {
  asClass,
  asFunction,
  asValue,
  createContainer,
  InjectionMode,
  type AwilixContainer,
} from 'awilix';
import jsTokens from 'js-tokens';
import { transliterate } from 'kmu-translit';

import { CommandLine, type ErrorLogger } from './cli/command-line.ts';
import { MemeDictionary, type MemeEntry } from './dictionary/meme-dictionary.ts';
import { MEME_ENTRIES } from './dictionary/meme-entries.ts';
import { ModuleLoader } from './runtime/module-loader.ts';
import { ScriptRunner } from './runtime/script-runner.ts';
import { IdentifierScanner, type Tokenize } from './translation/identifier-scanner.ts';
import { Translator } from './translation/translator.ts';
import { LatinTransliterator, type Transliterate } from './transliteration/latin-transliterator.ts';
import { collectReservedWords } from './transliteration/reserved-words.ts';

export interface Dependencies {
  memeEntries: readonly MemeEntry[];
  tokenize: Tokenize;
  transliterate: Transliterate;
  reservedWords: ReadonlySet<string>;
  readTextFile: (filePath: string) => string;
  registerModuleHooks: typeof registerHooks;
  enableSourceMaps: () => void;
  importModule: (moduleUrl: string) => Promise<unknown>;
  logger: ErrorLogger;
  memeDictionary: MemeDictionary;
  latinTransliterator: LatinTransliterator;
  identifierScanner: IdentifierScanner;
  translator: Translator;
  moduleLoader: ModuleLoader;
  scriptRunner: ScriptRunner;
  commandLine: CommandLine;
}

export function createPotuzhnoContainer(): AwilixContainer<Dependencies> {
  const container = createContainer<Dependencies>({ injectionMode: InjectionMode.PROXY });

  container.register({
    memeEntries: asValue(MEME_ENTRIES),
    tokenize: asValue(jsTokens),
    transliterate: asValue(transliterate),
    reservedWords: asFunction(() => collectReservedWords(globalThis)).singleton(),
    readTextFile: asValue((filePath: string) => readFileSync(filePath, 'utf8')),
    registerModuleHooks: asValue(registerHooks),
    enableSourceMaps: asValue(() => setSourceMapsSupport(true)),
    importModule: asValue((moduleUrl: string) => import(moduleUrl)),
    logger: asValue(console),
    memeDictionary: asClass(MemeDictionary).singleton(),
    latinTransliterator: asClass(LatinTransliterator).singleton(),
    identifierScanner: asClass(IdentifierScanner).singleton(),
    translator: asClass(Translator).singleton(),
    moduleLoader: asClass(ModuleLoader).singleton(),
    scriptRunner: asClass(ScriptRunner).singleton(),
    commandLine: asClass(CommandLine).singleton(),
  });

  return container;
}
