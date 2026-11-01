import { NameCollisionError } from '../translation/name-collision-error.ts';

export interface ScriptExecutor {
  run(scriptPath: string): Promise<void>;
}

export interface ErrorLogger {
  error(message: string): void;
}

interface CommandLineDependencies {
  readonly scriptRunner: ScriptExecutor;
  readonly logger: ErrorLogger;
}

const SUCCESS_EXIT_CODE = 0;
const FAILURE_EXIT_CODE = 1;
const USAGE = 'Як запустити: potuzhno файл.potuzhno';

export class CommandLine {
  private readonly scriptRunner: ScriptExecutor;
  private readonly logger: ErrorLogger;

  public constructor({ scriptRunner, logger }: CommandLineDependencies) {
    this.scriptRunner = scriptRunner;
    this.logger = logger;
  }

  public async run(args: readonly string[]): Promise<number> {
    const [scriptPath] = args;

    if (scriptPath === undefined) {
      this.logger.error(USAGE);

      return FAILURE_EXIT_CODE;
    }

    try {
      await this.scriptRunner.run(scriptPath);
    } catch (error) {
      // Помилку перекладу показуємо без стеку: стек веде в код перекладача, а не в програму
      if (error instanceof NameCollisionError) {
        this.logger.error(error.message);

        return FAILURE_EXIT_CODE;
      }

      throw error;
    }

    return SUCCESS_EXIT_CODE;
  }
}
