import type { Logger } from '../cli/command-line.ts';
import { POTUZHNO_EXTENSION } from '../translation/potuzhno-extension.ts';

export type StopWatching = () => Promise<void>;

interface BuildWatcherDependencies {
  readonly watchDirectory: (
    directory: string,
    onChange: (changedPath: string) => void,
  ) => Promise<StopWatching>;
  readonly logger: Logger;
}

export interface WatchTarget {
  readonly projectDir: string;
  readonly configPath: string;
}

// Серія збережень (редактор пише файл кілька разів) дає одну збірку
const DEBOUNCE_MILLISECONDS = 100;

export class BuildWatcher {
  private readonly watchDirectory: BuildWatcherDependencies['watchDirectory'];
  private readonly logger: Logger;

  public constructor({ watchDirectory, logger }: BuildWatcherDependencies) {
    this.watchDirectory = watchDirectory;
    this.logger = logger;
  }

  // shortcut: стежимо лише за текою проєкту; файли .potuzhno поза нею (../спільне) зміни не помітять
  public async watch(target: WatchTarget, rebuild: () => Promise<void>): Promise<StopWatching> {
    let timer: NodeJS.Timeout | undefined;
    let isRunning = false;
    let isRerunRequested = false;

    const run = async (): Promise<void> => {
      if (isRunning) {
        isRerunRequested = true;

        return;
      }

      isRunning = true;

      try {
        do {
          isRerunRequested = false;
          await rebuild();
        } while (isRerunRequested);
      } catch (error) {
        this.logger.error(error instanceof Error ? (error.stack ?? error.message) : String(error));
      } finally {
        isRunning = false;
      }
    };

    const stopWatching = await this.watchDirectory(target.projectDir, (changedPath) => {
      if (changedPath.endsWith(POTUZHNO_EXTENSION) || changedPath === target.configPath) {
        clearTimeout(timer);
        timer = setTimeout(() => void run(), DEBOUNCE_MILLISECONDS);
      }
    });

    return async () => {
      clearTimeout(timer);
      await stopWatching();
    };
  }
}
