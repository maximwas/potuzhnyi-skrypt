import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { CommandLine, type BuildRunner, type ScriptExecutor } from '../../src/cli/command-line.ts';
import { NameCollisionError } from '../../src/translation/name-collision-error.ts';

const BIN_PATH = fileURLToPath(new URL('../../bin/potuzhno.ts', import.meta.url));
const EXAMPLE_PATH = fileURLToPath(new URL('../../examples/бюджет.potuzhno', import.meta.url));

function runCli(scriptPath: string) {
  return spawnSync(process.execPath, [BIN_PATH, scriptPath], { encoding: 'utf8' });
}

describe('CommandLine', () => {
  const loggedMessages: string[] = [];
  const logger = { error: (message: string) => loggedMessages.push(message) };

  function createCommandLine(
    scriptRunner: ScriptExecutor,
    buildCommand: BuildRunner = { run: async () => 0 },
  ): CommandLine {
    loggedMessages.length = 0;

    return new CommandLine({ scriptRunner, buildCommand, logger });
  }

  it('без аргументів друкує підказку й повертає код 1', async () => {
    const commandLine = createCommandLine({ run: async () => undefined });

    assert.equal(await commandLine.run([]), 1);
    assert.match(loggedMessages[0], /Як запустити/);
  });

  it('підказка згадує і запуск, і збірку', async () => {
    const commandLine = createCommandLine({ run: async () => undefined });

    await commandLine.run([]);

    assert.match(loggedMessages[0], /potuzhno build/);
  });

  it('команду build віддає збірці з рештою аргументів і її кодом виходу', async () => {
    const receivedArgs: (readonly string[])[] = [];
    const commandLine = createCommandLine(
      {
        run: async () => {
          throw new Error('скрипт не мав запускатися');
        },
      },
      {
        run: async (args) => {
          receivedArgs.push(args);

          return 7;
        },
      },
    );

    assert.equal(await commandLine.run(['build', '-w', '-p', 'тека']), 7);
    assert.deepEqual(receivedArgs, [['-w', '-p', 'тека']]);
  });

  it('запускає вказаний файл і повертає код 0', async () => {
    const startedScripts: string[] = [];
    const commandLine = createCommandLine({
      run: async (scriptPath) => {
        startedScripts.push(scriptPath);
      },
    });

    assert.equal(await commandLine.run(['програма.potuzhno']), 0);
    assert.deepEqual(startedScripts, ['програма.potuzhno']);
  });

  it('помилку перекладу показує повідомленням без стеку', async () => {
    const collision = new NameCollisionError({
      firstName: 'кут',
      secondName: 'куть',
      latinName: 'kut',
      fileName: 'програма.potuzhno',
      line: 2,
    });
    const commandLine = createCommandLine({
      run: async () => {
        throw collision;
      },
    });

    assert.equal(await commandLine.run(['програма.potuzhno']), 1);
    assert.deepEqual(loggedMessages, [collision.message]);
  });

  it('чужі помилки не ковтає', async () => {
    const commandLine = createCommandLine({
      run: async () => {
        throw new Error('збій');
      },
    });

    await assert.rejects(commandLine.run(['програма.potuzhno']), /збій/);
  });
});

describe('potuzhno (CLI)', () => {
  let workDirectory: string;

  before(() => {
    workDirectory = mkdtempSync(join(tmpdir(), 'potuzhno-'));
  });

  after(() => {
    rmSync(workDirectory, { recursive: true, force: true });
  });

  it('запускає приклад', () => {
    const { stdout, stderr } = runCli(EXAMPLE_PATH);

    assert.equal(stdout, 'Відкати: 10, 20, 30\nУ СІЗО: 1, вийшли під заставу\n');
    assert.equal(stderr, 'Забагато відкатів\n');
  });

  it('помилка під час виконання вказує на рядок у .potuzhno', () => {
    const scriptPath = join(workDirectory, 'зрада.potuzhno');

    writeFileSync(scriptPath, 'потужно х = 1;\n\nстраус.поле;\n');

    const { status, stderr } = runCli(scriptPath);

    assert.notEqual(status, 0);
    assert.match(stderr, /зрада\.potuzhno:3/);
  });

  it('імпорт між .potuzhno-модулями: латиниця однакова в обох файлах', () => {
    writeFileSync(
      join(workDirectory, 'схеми.potuzhno'),
      'вивезти схема розпилити(сума) { відкат сума / 10 }\n',
    );

    writeFileSync(
      join(workDirectory, 'головний.potuzhno'),
      'завезти { розпилити } з "./схеми.potuzhno";\nОП.звернення(розпилити(500));\n',
    );

    const { stdout, stderr } = runCli(join(workDirectory, 'головний.potuzhno'));

    assert.equal(stderr, '');
    assert.equal(stdout, '50\n');
  });

  it('конфлікт імен: короткий текст без стеку й код виходу 1', () => {
    const scriptPath = join(workDirectory, 'конфлікт.potuzhno');

    writeFileSync(scriptPath, 'потужно кут = 1;\nпотужно куть = 2;\n');

    const { status, stderr } = runCli(scriptPath);

    assert.equal(status, 1);
    assert.match(stderr, /«куть» і «кут» дають однакове латинське імʼя «kut»/);
    assert.doesNotMatch(stderr, /at /);
  });

  it('без аргументів друкує підказку', () => {
    const { status, stderr } = spawnSync(process.execPath, [BIN_PATH], { encoding: 'utf8' });

    assert.equal(status, 1);
    assert.match(stderr, /Як запустити/);
  });
});
