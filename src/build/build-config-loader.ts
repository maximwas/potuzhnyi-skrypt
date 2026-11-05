import { basename, dirname, extname, join, resolve } from 'node:path';

import { BuildError } from './build-error.ts';

const BUNDLE_EXTENSION = '.mjs';

export const CONFIG_FILE_NAME = 'потужнийконфіг.json';

interface CommonBuildConfig {
  readonly configPath: string;
  readonly projectDir: string;
  readonly outDir: string;
  readonly sourceMap: boolean;
}

// Зберігає структуру тек: кожен .potuzhno стає окремим .js у outDir.
export interface StructureBuildConfig extends CommonBuildConfig {
  readonly bundle: false;
  readonly include: readonly string[];
  readonly rootDir: string | undefined;
}

// Усе в один файл: esbuild іде від entry за імпортами.
export interface BundleBuildConfig extends CommonBuildConfig {
  readonly bundle: true;
  readonly entry: string;
  readonly outFile: string;
}

export type BuildConfig = StructureBuildConfig | BundleBuildConfig;

type RawOptions = Record<string, unknown>;

interface BuildConfigLoaderDependencies {
  readonly readTextFile: (filePath: string) => string;
}

const KNOWN_OPTIONS = ['include', 'rootDir', 'outDir', 'bundle', 'entry', 'outFile', 'sourceMap'];
const STRUCTURE_ONLY_OPTIONS = ['include', 'rootDir'];
const BUNDLE_ONLY_OPTIONS = ['entry', 'outFile'];
const DEFAULT_INCLUDE = ['.'];
const DEFAULT_OUT_DIR = 'dist';

export class BuildConfigLoader {
  private readonly readTextFile: (filePath: string) => string;

  public constructor({ readTextFile }: BuildConfigLoaderDependencies) {
    this.readTextFile = readTextFile;
  }

  // projectPath — тека з конфігом або сам файл конфігу
  public load(projectPath: string): BuildConfig {
    const configPath = this.findConfigPath(projectPath);
    const options = this.parse(configPath);
    const projectDir = dirname(configPath);

    this.rejectUnknownOptions(options, configPath);

    const common = {
      configPath,
      projectDir,
      outDir: resolve(
        projectDir,
        this.readString(options, 'outDir', configPath) ?? DEFAULT_OUT_DIR,
      ),
      sourceMap: this.readBoolean(options, 'sourceMap', configPath) ?? true,
    };

    if (this.readBoolean(options, 'bundle', configPath) === true) {
      return this.loadBundle(options, common, configPath);
    }

    return this.loadStructure(options, common, configPath);
  }

  private loadStructure(
    options: RawOptions,
    common: CommonBuildConfig,
    configPath: string,
  ): BuildConfig {
    this.rejectOptions(options, BUNDLE_ONLY_OPTIONS, '"bundle" не true', configPath);

    const rootDir = this.readString(options, 'rootDir', configPath);

    return {
      ...common,
      bundle: false,
      include: this.readStringList(options, 'include', configPath) ?? DEFAULT_INCLUDE,
      rootDir: rootDir === undefined ? undefined : resolve(common.projectDir, rootDir),
    };
  }

  private loadBundle(
    options: RawOptions,
    common: CommonBuildConfig,
    configPath: string,
  ): BuildConfig {
    this.rejectOptions(options, STRUCTURE_ONLY_OPTIONS, '"bundle": true', configPath);

    const entry = this.readString(options, 'entry', configPath);

    if (entry === undefined) {
      throw this.fail(
        configPath,
        'для "bundle": true потрібен "entry" — файл, з якого починається програма',
      );
    }

    return {
      ...common,
      bundle: true,
      entry: resolve(common.projectDir, entry),
      outFile:
        this.readString(options, 'outFile', configPath) ??
        `${basename(entry, extname(entry))}${BUNDLE_EXTENSION}`,
    };
  }

  private findConfigPath(projectPath: string): string {
    const absolutePath = resolve(projectPath);

    return extname(absolutePath) === '.json' ? absolutePath : join(absolutePath, CONFIG_FILE_NAME);
  }

  private parse(configPath: string): RawOptions {
    let text: string;

    try {
      text = this.readTextFile(configPath);
    } catch {
      throw new BuildError(
        `Не знайшов ${configPath}. Створи ${CONFIG_FILE_NAME} або вкажи шлях через -p.`,
      );
    }

    let parsed: unknown;

    try {
      parsed = JSON.parse(text);
    } catch (error) {
      throw this.fail(configPath, `це не JSON (${error instanceof Error ? error.message : error})`);
    }

    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      throw this.fail(configPath, 'очікую обʼєкт {...}');
    }

    return parsed as RawOptions;
  }

  private rejectUnknownOptions(options: RawOptions, configPath: string): void {
    const unknownOption = Object.keys(options).find((name) => !KNOWN_OPTIONS.includes(name));

    if (unknownOption !== undefined) {
      throw this.fail(
        configPath,
        `невідомий параметр «${unknownOption}». Є такі: ${KNOWN_OPTIONS.join(', ')}`,
      );
    }
  }

  private rejectOptions(
    options: RawOptions,
    names: readonly string[],
    when: string,
    configPath: string,
  ): void {
    const present = names.find((name) => name in options);

    if (present !== undefined) {
      throw this.fail(configPath, `«${present}» не працює, коли ${when}`);
    }
  }

  private readString(options: RawOptions, name: string, configPath: string): string | undefined {
    const value = options[name];

    if (value === undefined) {
      return undefined;
    }

    if (typeof value !== 'string' || value === '') {
      throw this.fail(configPath, `«${name}» має бути непорожнім рядком`);
    }

    return value;
  }

  private readBoolean(options: RawOptions, name: string, configPath: string): boolean | undefined {
    const value = options[name];

    if (value !== undefined && typeof value !== 'boolean') {
      throw this.fail(configPath, `«${name}» має бути true або false`);
    }

    return value;
  }

  private readStringList(
    options: RawOptions,
    name: string,
    configPath: string,
  ): readonly string[] | undefined {
    const value = options[name];

    if (value === undefined) {
      return undefined;
    }

    if (
      !Array.isArray(value) ||
      value.length === 0 ||
      value.some((item) => typeof item !== 'string' || item === '')
    ) {
      throw this.fail(configPath, `«${name}» має бути непорожнім списком рядків`);
    }

    return value as string[];
  }

  private fail(configPath: string, message: string): BuildError {
    return new BuildError(`${basename(configPath)}: ${message}`);
  }
}
