import { dirname, join, relative, sep } from 'node:path';

import type { BuildOptions } from 'esbuild';

import { NameCollisionError } from '../translation/name-collision-error.ts';
import { POTUZHNO_EXTENSION } from '../translation/potuzhno-extension.ts';
import type { Translator } from '../translation/translator.ts';
import type {
  BuildConfig,
  BundleBuildConfig,
  StructureBuildConfig,
} from './build-config-loader.ts';
import { BuildError } from './build-error.ts';
import type { SourceFileFinder } from './source-file-finder.ts';

export interface BuildReport {
  readonly outputFiles: readonly string[];
}

interface ProjectBuilderDependencies {
  readonly translator: Translator;
  readonly sourceFileFinder: SourceFileFinder;
  readonly readTextFile: (filePath: string) => string;
  readonly writeTextFile: (filePath: string, text: string) => void;
  readonly bundleModules: (options: BuildOptions) => Promise<unknown>;
}

// .mjs, а не .js: Node читає .mjs як ES-модуль незалежно від "type" у package.json проєкту,
// а npm init створює "type": "commonjs", і зібраний .js там не запускається
export const OUTPUT_EXTENSION = '.mjs';

export class ProjectBuilder {
  private readonly translator: Translator;
  private readonly sourceFileFinder: SourceFileFinder;
  private readonly readTextFile: (filePath: string) => string;
  private readonly writeTextFile: (filePath: string, text: string) => void;
  private readonly bundleModules: (options: BuildOptions) => Promise<unknown>;

  public constructor({
    translator,
    sourceFileFinder,
    readTextFile,
    writeTextFile,
    bundleModules,
  }: ProjectBuilderDependencies) {
    this.translator = translator;
    this.sourceFileFinder = sourceFileFinder;
    this.readTextFile = readTextFile;
    this.writeTextFile = writeTextFile;
    this.bundleModules = bundleModules;
  }

  public async build(config: BuildConfig): Promise<BuildReport> {
    return config.bundle ? this.buildBundle(config) : this.buildStructure(config);
  }

  // shortcut: застарілі файли в outDir (джерело перейменували чи видалили) не прибираємо, як і tsc;
  // додати очищення, коли це заважатиме
  private buildStructure(config: StructureBuildConfig): BuildReport {
    const files = this.sourceFileFinder.find(config);
    const rootDir = config.rootDir ?? this.findCommonDirectory(files);
    const outputFiles: string[] = [];

    for (const file of files) {
      const path = relative(rootDir, file);

      if (path.startsWith('..')) {
        throw new BuildError(`Файл ${file} лежить поза rootDir (${rootDir})`);
      }

      const outputPath =
        join(config.outDir, path.slice(0, -POTUZHNO_EXTENSION.length)) + OUTPUT_EXTENSION;

      this.writeTranslated(file, outputPath, config.sourceMap);
      outputFiles.push(outputPath);
    }

    return { outputFiles };
  }

  private writeTranslated(file: string, outputPath: string, withSourceMap: boolean): void {
    const { code, sourceMap } = this.translator.translate(this.readTextFile(file), file, {
      importExtension: OUTPUT_EXTENSION,
    });

    if (!withSourceMap) {
      this.writeTextFile(outputPath, code);

      return;
    }

    sourceMap.sources = [relative(dirname(outputPath), file)];

    this.writeTextFile(outputPath, `${code}\n//# sourceMappingURL=${this.mapFileName(outputPath)}`);
    this.writeTextFile(`${outputPath}.map`, sourceMap.toString());
  }

  private mapFileName(outputPath: string): string {
    return `${outputPath.split(sep).pop()}.map`;
  }

  private async buildBundle(config: BundleBuildConfig): Promise<BuildReport> {
    const outputPath = join(config.outDir, config.outFile);

    try {
      await this.bundleModules({
        entryPoints: [config.entry],
        outfile: outputPath,
        bundle: true,
        format: 'esm',
        // Без цього esbuild перетворює кирилицю в рядках на \uXXXX, і зібраний файл не прочитати
        charset: 'utf8',
        platform: 'node',
        // Пакети з node_modules лишаються імпортами: у файл потрапляє лише код проєкту
        packages: 'external',
        sourcemap: config.sourceMap,
        absWorkingDir: config.projectDir,
        logLevel: 'silent',
        plugins: [{ name: 'potuzhno', setup: (build) => this.loadPotuzhnoFiles(build) }],
      });
    } catch (error) {
      throw this.toBuildError(error);
    }

    return { outputFiles: [outputPath] };
  }

  private loadPotuzhnoFiles(
    build: Parameters<NonNullable<BuildOptions['plugins']>[number]['setup']>[0],
  ): void {
    build.onLoad({ filter: /\.potuzhno$/ }, ({ path }) => {
      try {
        const { code, sourceMap } = this.translator.translate(this.readTextFile(path), path);

        // esbuild склеює карти: бере вбудовану карту перекладу й будує підсумкову
        return { contents: `${code}\n//# sourceMappingURL=${sourceMap.toUrl()}`, loader: 'js' };
      } catch (error) {
        if (error instanceof NameCollisionError) {
          return { errors: [{ text: error.message }] };
        }

        throw error;
      }
    });
  }

  private toBuildError(error: unknown): unknown {
    const messages = (error as { errors?: readonly { text: string }[] }).errors;

    if (Array.isArray(messages)) {
      return new BuildError(messages.map((message) => message.text).join('\n'));
    }

    return error;
  }

  private findCommonDirectory(files: readonly string[]): string {
    let common = dirname(files[0]).split(sep);

    for (const file of files.slice(1)) {
      const parts = dirname(file).split(sep);
      let length = 0;

      while (length < common.length && length < parts.length && common[length] === parts[length]) {
        length += 1;
      }

      common = common.slice(0, length);
    }

    return common.join(sep) || sep;
  }
}
