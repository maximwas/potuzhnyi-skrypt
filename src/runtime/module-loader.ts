import type { LoadHookSync, registerHooks } from 'node:module';
import { fileURLToPath } from 'node:url';

import { POTUZHNO_EXTENSION } from '../translation/potuzhno-extension.ts';
import type { Translator } from '../translation/translator.ts';

interface ModuleLoaderDependencies {
  readonly translator: Translator;
  readonly readTextFile: (filePath: string) => string;
  readonly registerModuleHooks: typeof registerHooks;
}

export class ModuleLoader {
  private readonly translator: Translator;
  private readonly readTextFile: (filePath: string) => string;
  private readonly registerModuleHooks: typeof registerHooks;

  public constructor({ translator, readTextFile, registerModuleHooks }: ModuleLoaderDependencies) {
    this.translator = translator;
    this.readTextFile = readTextFile;
    this.registerModuleHooks = registerModuleHooks;
  }

  public register(): void {
    this.registerModuleHooks({ load: this.load });
  }

  private readonly load: LoadHookSync = (url, context, nextLoad) => {
    if (!url.endsWith(POTUZHNO_EXTENSION)) {
      return nextLoad(url, context);
    }

    const filePath = fileURLToPath(url);
    const { code, sourceMap } = this.translator.translate(this.readTextFile(filePath), filePath);

    return {
      format: 'module',
      shortCircuit: true,
      source: `${code}\n//# sourceMappingURL=${sourceMap.toUrl()}`,
    };
  };
}
