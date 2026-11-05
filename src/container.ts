import { globSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { registerHooks, setSourceMapsSupport } from 'node:module';
import { dirname, sep } from 'node:path';

import {
  asClass,
  asFunction,
  asValue,
  createContainer,
  InjectionMode,
  type AwilixContainer,
} from 'awilix';
import type { BuildOptions } from 'esbuild';
import jsTokens from 'js-tokens';
import { transliterate } from 'kmu-translit';

import { BuildConfigLoader } from './build/build-config-loader.ts';
import { BuildWatcher, type StopWatching } from './build/build-watcher.ts';
import { ProjectBuilder } from './build/project-builder.ts';
import { SourceFileFinder, type PathKind } from './build/source-file-finder.ts';
import { BuildCommand } from './cli/build-command.ts';
import { CommandLine, type Logger } from './cli/command-line.ts';
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
  logger: Logger;
  globFiles: (
    pattern: string,
    options: { cwd: string; exclude: (name: string) => boolean },
  ) => string[];
  kindOfPath: (path: string) => PathKind;
  writeTextFile: (filePath: string, text: string) => void;
  bundleModules: (options: BuildOptions) => Promise<unknown>;
  watchDirectory: (
    directory: string,
    onChange: (changedPath: string) => void,
  ) => Promise<StopWatching>;
  memeDictionary: MemeDictionary;
  latinTransliterator: LatinTransliterator;
  identifierScanner: IdentifierScanner;
  translator: Translator;
  moduleLoader: ModuleLoader;
  scriptRunner: ScriptRunner;
  buildConfigLoader: BuildConfigLoader;
  sourceFileFinder: SourceFileFinder;
  projectBuilder: ProjectBuilder;
  buildWatcher: BuildWatcher;
  buildCommand: BuildCommand;
  commandLine: CommandLine;
}

function findKindOfPath(path: string): PathKind {
  try {
    return statSync(path).isDirectory() ? 'directory' : 'file';
  } catch {
    return undefined;
  }
}

async function watchWithChokidar(
  directory: string,
  onChange: (changedPath: string) => void,
): Promise<StopWatching> {
  const { watch } = await import('chokidar');
  const watcher = watch(directory, {
    ignoreInitial: true,
    ignored: (path) => path.split(sep).some((part) => part === 'node_modules' || part === '.git'),
  });

  watcher.on('all', (_event, changedPath) => onChange(changedPath));

  return () => watcher.close();
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
    globFiles: asValue(
      (pattern: string, options: { cwd: string; exclude: (name: string) => boolean }) =>
        globSync(pattern, options),
    ),
    kindOfPath: asValue(findKindOfPath),
    writeTextFile: asValue((filePath: string, text: string) => {
      mkdirSync(dirname(filePath), { recursive: true });
      writeFileSync(filePath, text);
    }),
    // esbuild і chokidar вантажимо ліниво: звичайний запуск скрипта їх не чіпає
    bundleModules: asValue(async (options: BuildOptions) =>
      (await import('esbuild')).build(options),
    ),
    watchDirectory: asValue(watchWithChokidar),
    memeDictionary: asClass(MemeDictionary).singleton(),
    latinTransliterator: asClass(LatinTransliterator).singleton(),
    identifierScanner: asClass(IdentifierScanner).singleton(),
    translator: asClass(Translator).singleton(),
    moduleLoader: asClass(ModuleLoader).singleton(),
    scriptRunner: asClass(ScriptRunner).singleton(),
    buildConfigLoader: asClass(BuildConfigLoader).singleton(),
    sourceFileFinder: asClass(SourceFileFinder).singleton(),
    projectBuilder: asClass(ProjectBuilder).singleton(),
    buildWatcher: asClass(BuildWatcher).singleton(),
    buildCommand: asClass(BuildCommand).singleton(),
    commandLine: asClass(CommandLine).singleton(),
  });

  return container;
}
