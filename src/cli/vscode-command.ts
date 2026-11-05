import type { PathKind } from '../build/source-file-finder.ts';
import type { Logger } from './command-line.ts';

// Код виходу програми або undefined, якщо її не вдалося запустити (її немає в PATH).
export type RunProcess = (command: string, args: readonly string[]) => number | undefined;

interface VscodeCommandDependencies {
  readonly extensionPath: string;
  readonly kindOfPath: (path: string) => PathKind;
  readonly runProcess: RunProcess;
  readonly logger: Logger;
}

const SUCCESS_EXIT_CODE = 0;
const FAILURE_EXIT_CODE = 1;
const EDITOR_COMMAND = 'code';
const VSCODE_USAGE = 'Як поставити розширення для VS Code: potuzhno vscode';

export class VscodeCommand {
  private readonly extensionPath: string;
  private readonly kindOfPath: (path: string) => PathKind;
  private readonly runProcess: RunProcess;
  private readonly logger: Logger;

  public constructor({ extensionPath, kindOfPath, runProcess, logger }: VscodeCommandDependencies) {
    this.extensionPath = extensionPath;
    this.kindOfPath = kindOfPath;
    this.runProcess = runProcess;
    this.logger = logger;
  }

  public run(args: readonly string[]): number {
    if (args.length > 0) {
      this.logger.error(VSCODE_USAGE);

      return FAILURE_EXIT_CODE;
    }

    if (this.kindOfPath(this.extensionPath) !== 'file') {
      this.logger.error(
        `Немає файла розширення ${this.extensionPath}. З репозиторію його збирає npm run build:extension.`,
      );

      return FAILURE_EXIT_CODE;
    }

    const exitCode = this.runProcess(EDITOR_COMMAND, [
      '--install-extension',
      this.extensionPath,
      '--force',
    ]);

    if (exitCode === undefined) {
      this.logger.error(
        `Не знайшов команду ${EDITOR_COMMAND}. У VS Code: Cmd/Ctrl+Shift+P, «Shell Command: Install '${EDITOR_COMMAND}' command in PATH». ` +
          `Або вручну: панель розширень, меню «…», «Install from VSIX» і файл ${this.extensionPath}`,
      );

      return FAILURE_EXIT_CODE;
    }

    if (exitCode !== SUCCESS_EXIT_CODE) {
      this.logger.error(`${EDITOR_COMMAND} завершилась з кодом ${exitCode}`);

      return FAILURE_EXIT_CODE;
    }

    this.logger.log(
      'Розширення встановлено. Якщо VS Code відкритий, перезавантажте вікно: Developer: Reload Window.',
    );

    return SUCCESS_EXIT_CODE;
  }
}
