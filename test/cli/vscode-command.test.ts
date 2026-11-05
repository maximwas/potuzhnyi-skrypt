import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { PathKind } from '../../src/build/source-file-finder.ts';
import { VscodeCommand, type RunProcess } from '../../src/cli/vscode-command.ts';

const EXTENSION_PATH = '/пакет/extension/potuzhno-syntax.vsix';

describe('VscodeCommand', () => {
  const errors: string[] = [];
  const logs: string[] = [];
  const startedProcesses: { command: string; args: readonly string[] }[] = [];

  function createCommand(
    extensionKind: PathKind,
    processResult: number | undefined,
  ): VscodeCommand {
    errors.length = 0;
    logs.length = 0;
    startedProcesses.length = 0;

    const runProcess: RunProcess = (command, args) => {
      startedProcesses.push({ command, args });

      return processResult;
    };

    return new VscodeCommand({
      extensionPath: EXTENSION_PATH,
      kindOfPath: () => extensionKind,
      runProcess,
      logger: {
        error: (message) => errors.push(message),
        log: (message) => logs.push(message),
      },
    });
  }

  it('ставить розширення командою code і повертає 0', () => {
    const command = createCommand('file', 0);

    assert.equal(command.run([]), 0);

    assert.deepEqual(startedProcesses, [
      { command: 'code', args: ['--install-extension', EXTENSION_PATH, '--force'] },
    ]);

    assert.match(logs[0], /перезавантажте вікно/);
  });

  it('без файла розширення не запускає code й каже, як його зібрати', () => {
    const command = createCommand(undefined, 0);

    assert.equal(command.run([]), 1);
    assert.deepEqual(startedProcesses, []);
    assert.match(errors[0], /npm run build:extension/);
  });

  it('якщо code немає в PATH, підказує команду в VS Code й ручне встановлення', () => {
    const command = createCommand('file', undefined);

    assert.equal(command.run([]), 1);
    assert.match(errors[0], /Install 'code' command in PATH/);
    assert.ok(errors[0].includes(EXTENSION_PATH));
  });

  it('якщо code впала, повертає 1 і називає її код', () => {
    const command = createCommand('file', 5);

    assert.equal(command.run([]), 1);
    assert.match(errors[0], /код(ом)? 5/);
  });

  it('зайві аргументи: підказка й код 1, code не запускається', () => {
    const command = createCommand('file', 0);

    assert.equal(command.run(['щось']), 1);
    assert.deepEqual(startedProcesses, []);
    assert.match(errors[0], /potuzhno vscode/);
  });
});
