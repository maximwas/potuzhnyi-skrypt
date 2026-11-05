import { isAbsolute, relative, resolve } from 'node:path';

import { POTUZHNO_EXTENSION } from '../translation/potuzhno-extension.ts';
import { BuildError } from './build-error.ts';
import type { StructureBuildConfig } from './build-config-loader.ts';

export type PathKind = 'directory' | 'file' | undefined;

interface SourceFileFinderDependencies {
  readonly globFiles: (
    pattern: string,
    options: { readonly cwd: string; readonly exclude: (name: string) => boolean },
  ) => string[];
  readonly kindOfPath: (path: string) => PathKind;
}

const GLOB_CHARACTERS = /[*?[\]{}]/;

export class SourceFileFinder {
  private readonly globFiles: SourceFileFinderDependencies['globFiles'];
  private readonly kindOfPath: SourceFileFinderDependencies['kindOfPath'];

  public constructor({ globFiles, kindOfPath }: SourceFileFinderDependencies) {
    this.globFiles = globFiles;
    this.kindOfPath = kindOfPath;
  }

  // Елемент include — файл, тека (усі .potuzhno всередині) або шаблон. node_modules і outDir пропускаємо.
  public find(config: StructureBuildConfig): string[] {
    const found = new Set<string>();

    for (const entry of config.include) {
      for (const file of this.expand(config.projectDir, entry)) {
        found.add(file);
      }
    }

    const files = [...found].filter((file) => !this.isInside(file, config.outDir)).sort();

    if (files.length === 0) {
      throw new BuildError(
        `Не знайшов жодного файлу ${POTUZHNO_EXTENSION} за include: ${config.include.join(', ')}`,
      );
    }

    return files;
  }

  private expand(projectDir: string, entry: string): string[] {
    const absolutePath = resolve(projectDir, entry);
    const kind = this.kindOfPath(absolutePath);

    if (kind === 'directory') {
      return this.glob(`**/*${POTUZHNO_EXTENSION}`, absolutePath);
    }

    if (kind === 'file' && entry.endsWith(POTUZHNO_EXTENSION)) {
      return [absolutePath];
    }

    if (kind === undefined && GLOB_CHARACTERS.test(entry)) {
      return this.glob(entry, projectDir);
    }

    throw new BuildError(
      `include: «${entry}» — не файл ${POTUZHNO_EXTENSION}, не тека і не шаблон`,
    );
  }

  private glob(pattern: string, cwd: string): string[] {
    return this.globFiles(pattern, { cwd, exclude: (name) => name === 'node_modules' })
      .filter((file) => file.endsWith(POTUZHNO_EXTENSION))
      .map((file) => resolve(cwd, file));
  }

  private isInside(file: string, directory: string): boolean {
    const path = relative(directory, file);

    return path !== '' && !path.startsWith('..') && !isAbsolute(path);
  }
}
