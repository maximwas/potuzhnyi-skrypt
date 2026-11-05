import { relative } from 'node:path';
import { parseArgs } from 'node:util';

import type { BuildConfig, BuildConfigLoader } from '../build/build-config-loader.ts';
import { BuildError } from '../build/build-error.ts';
import type { BuildWatcher } from '../build/build-watcher.ts';
import type { ProjectBuilder } from '../build/project-builder.ts';
import { NameCollisionError } from '../translation/name-collision-error.ts';
import type { Logger } from './command-line.ts';

interface BuildCommandDependencies {
  readonly buildConfigLoader: BuildConfigLoader;
  readonly projectBuilder: ProjectBuilder;
  readonly buildWatcher: BuildWatcher;
  readonly logger: Logger;
}

const SUCCESS_EXIT_CODE = 0;
const FAILURE_EXIT_CODE = 1;
const BUILD_USAGE = 'Як зібрати: potuzhno build [-w] [-p тека-або-файл-конфігу]';

export class BuildCommand {
  private readonly buildConfigLoader: BuildConfigLoader;
  private readonly projectBuilder: ProjectBuilder;
  private readonly buildWatcher: BuildWatcher;
  private readonly logger: Logger;

  public constructor({
    buildConfigLoader,
    projectBuilder,
    buildWatcher,
    logger,
  }: BuildCommandDependencies) {
    this.buildConfigLoader = buildConfigLoader;
    this.projectBuilder = projectBuilder;
    this.buildWatcher = buildWatcher;
    this.logger = logger;
  }

  // У режимі -w повертається одразу після першої збірки: процес живе, поки працює спостерігач.
  public async run(args: readonly string[]): Promise<number> {
    const options = this.parseOptions(args);

    if (options === undefined) {
      this.logger.error(BUILD_USAGE);

      return FAILURE_EXIT_CODE;
    }

    const projectPath = options.project ?? '.';
    const config = this.loadConfig(projectPath);

    if (config === undefined) {
      return FAILURE_EXIT_CODE;
    }

    const isBuilt = await this.build(config);

    if (!options.watch) {
      return isBuilt ? SUCCESS_EXIT_CODE : FAILURE_EXIT_CODE;
    }

    await this.buildWatcher.watch(config, async () => {
      const freshConfig = this.loadConfig(projectPath);

      if (freshConfig !== undefined) {
        await this.build(freshConfig);
      }
    });

    this.logger.log('Стежу за змінами. Вийти: Ctrl+C');

    return SUCCESS_EXIT_CODE;
  }

  private parseOptions(args: readonly string[]): { watch: boolean; project?: string } | undefined {
    try {
      const { values } = parseArgs({
        args: [...args],
        options: {
          watch: { type: 'boolean', short: 'w' },
          project: { type: 'string', short: 'p' },
        },
        allowPositionals: false,
      });

      return { watch: values.watch === true, project: values.project };
    } catch {
      return undefined;
    }
  }

  // Конфіг читаємо щоразу: у watch його можна правити, не перезапускаючи процес.
  private loadConfig(projectPath: string): BuildConfig | undefined {
    try {
      return this.buildConfigLoader.load(projectPath);
    } catch (error) {
      this.reportExpectedError(error);

      return undefined;
    }
  }

  private async build(config: BuildConfig): Promise<boolean> {
    try {
      const { outputFiles } = await this.projectBuilder.build(config);
      const outDir = relative(process.cwd(), config.outDir) || '.';

      this.logger.log(`Зібрано файлів: ${outputFiles.length}, тека: ${outDir}`);

      return true;
    } catch (error) {
      this.reportExpectedError(error);

      return false;
    }
  }

  // Очікувані помилки показуємо повідомленням, решту (баги) віддаємо нагору зі стеком.
  private reportExpectedError(error: unknown): void {
    if (error instanceof BuildError || error instanceof NameCollisionError) {
      this.logger.error(error.message);

      return;
    }

    throw error;
  }
}
