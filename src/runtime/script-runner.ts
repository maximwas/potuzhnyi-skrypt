import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

import type { ModuleLoader } from './module-loader.ts';

interface ScriptRunnerDependencies {
  readonly moduleLoader: ModuleLoader;
  readonly enableSourceMaps: () => void;
  readonly importModule: (moduleUrl: string) => Promise<unknown>;
}

export class ScriptRunner {
  private readonly moduleLoader: ModuleLoader;
  private readonly enableSourceMaps: () => void;
  private readonly importModule: (moduleUrl: string) => Promise<unknown>;

  public constructor({ moduleLoader, enableSourceMaps, importModule }: ScriptRunnerDependencies) {
    this.moduleLoader = moduleLoader;
    this.enableSourceMaps = enableSourceMaps;
    this.importModule = importModule;
  }

  public async run(scriptPath: string): Promise<void> {
    this.moduleLoader.register();
    this.enableSourceMaps();

    await this.importModule(pathToFileURL(resolve(scriptPath)).href);
  }
}
