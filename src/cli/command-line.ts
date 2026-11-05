import { NameCollisionError } from '../translation/name-collision-error.ts';

export interface ScriptExecutor {
  run(scriptPath: string): Promise<void>;
}

export interface ErrorLogger {
  error(message: string): void;
}

export interface Logger extends ErrorLogger {
  log(message: string): void;
}

export interface BuildRunner {
  run(args: readonly string[]): Promise<number>;
}

interface CommandLineDependencies {
  readonly scriptRunner: ScriptExecutor;
  readonly buildCommand: BuildRunner;
  readonly logger: ErrorLogger;
}

const SUCCESS_EXIT_CODE = 0;
const FAILURE_EXIT_CODE = 1;
const BUILD_COMMAND = 'build';
const USAGE =
  'Як запустити: potuzhno файл.potuzhno\nЯк зібрати: potuzhno build [-w] [-p тека-або-файл-конфігу]';

export class CommandLine {
  private readonly scriptRunner: ScriptExecutor;
  private readonly buildCommand: BuildRunner;
  private readonly logger: ErrorLogger;

  public constructor({ scriptRunner, buildCommand, logger }: CommandLineDependencies) {
    this.scriptRunner = scriptRunner;
    this.buildCommand = buildCommand;
    this.logger = logger;
  }

  public async run(args: readonly string[]): Promise<number> {
    const [scriptPath, ...restArgs] = args;

    if (scriptPath === BUILD_COMMAND) {
      return this.buildCommand.run(restArgs);
    }

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
