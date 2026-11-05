import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, beforeEach, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { asValue } from 'awilix';

import { CONFIG_FILE_NAME } from '../../src/build/build-config-loader.ts';
import { createPotuzhnoContainer } from '../../src/container.ts';
import { PLAIN_OUTPUT_ENVIRONMENT } from '../support/plain-output-environment.ts';

const BIN_PATH = fileURLToPath(new URL('../../bin/potuzhno.ts', import.meta.url));
const SHOP_PATH = fileURLToPath(new URL('../../examples/магазин', import.meta.url));

const SHOP_OUTPUT = [
  'Без ПДВ: 236.00 грн',
  'З ПДВ 20%: 283.20 грн',
  'У каталозі товарів: 3',
  'Динамічно: 120.00 грн',
];

interface BuildResult {
  readonly exitCode: number;
  readonly messages: string[];
  readonly errors: string[];
}

async function runBuild(projectDir: string, extraArgs: string[] = []): Promise<BuildResult> {
  const messages: string[] = [];
  const errors: string[] = [];
  const container = createPotuzhnoContainer();

  container.register({
    logger: asValue({
      log: (message: string) => messages.push(message),
      error: (message: string) => errors.push(message),
    }),
  });

  const exitCode = await container.cradle.commandLine.run([
    'build',
    '-p',
    projectDir,
    ...extraArgs,
  ]);

  return { exitCode, messages, errors };
}

function runNode(scriptPath: string): { stdout: string[]; stderr: string[] } {
  const { stdout, stderr } = spawnSync(process.execPath, [scriptPath], {
    encoding: 'utf8',
    env: PLAIN_OUTPUT_ENVIRONMENT,
  });

  return {
    stdout: stdout.trimEnd().split('\n').filter(Boolean),
    stderr: stderr.trimEnd().split('\n').filter(Boolean),
  };
}

function writeConfig(projectDir: string, config: object): void {
  writeFileSync(join(projectDir, CONFIG_FILE_NAME), JSON.stringify(config));
}

describe('potuzhno build', () => {
  let workDirectory: string;
  let projectDir: string;

  before(() => {
    workDirectory = mkdtempSync(join(tmpdir(), 'potuzhno-build-'));
  });

  after(() => {
    rmSync(workDirectory, { recursive: true, force: true });
  });

  beforeEach(() => {
    projectDir = mkdtempSync(join(workDirectory, 'проєкт-'));
    cpSync(SHOP_PATH, join(projectDir, 'src'), { recursive: true });

    // npm init створює саме так: поруч із зібраним кодом має працювати й "type": "commonjs"
    writeFileSync(join(projectDir, 'package.json'), '{ "type": "commonjs" }');
  });

  it('зберігає структуру тек, міняє шляхи імпорту, і зібране працює, як вихідне', async () => {
    mkdirSync(join(projectDir, 'src', 'допоміжне'));

    writeFileSync(
      join(projectDir, 'src', 'допоміжне', 'привіт.potuzhno'),
      'вивезти схема привітати() { відкат "Привіт із підтеки"; }\n',
    );

    writeFileSync(
      join(projectDir, 'src', 'головна.potuzhno'),
      readFileSync(join(projectDir, 'src', 'головна.potuzhno'), 'utf8') +
        'завезти { привітати } з "./допоміжне/привіт.potuzhno";\nОП.звернення(привітати());\n',
    );

    writeConfig(projectDir, { include: ['src'], outDir: 'збірка' });

    const { exitCode, messages, errors } = await runBuild(projectDir);

    assert.deepEqual(errors, []);
    assert.equal(exitCode, 0);
    assert.match(messages[0], /Зібрано файлів: 6/);

    assert.deepEqual(readdirSync(join(projectDir, 'збірка')).sort(), [
      'головна.mjs',
      'головна.mjs.map',
      'гроші.mjs',
      'гроші.mjs.map',
      'допоміжне',
      'кошик.mjs',
      'кошик.mjs.map',
      'товари.mjs',
      'товари.mjs.map',
      'індекс.mjs',
      'індекс.mjs.map',
    ]);

    const entry = readFileSync(join(projectDir, 'збірка', 'головна.mjs'), 'utf8');

    assert.match(entry, /from "\.\/кошик\.mjs"/);
    assert.match(entry, /from "\.\/допоміжне\/привіт\.mjs"/);
    assert.match(entry, /\/\/# sourceMappingURL=головна\.mjs\.map$/);

    assert.deepEqual(runNode(join(projectDir, 'збірка', 'головна.mjs')), {
      stdout: [...SHOP_OUTPUT, 'Привіт із підтеки'],
      stderr: ['Помилка: Немає товару «Лимон»'],
    });
  });

  it('карта джерел веде до вихідного файлу відносним шляхом', async () => {
    writeConfig(projectDir, { include: ['src'], rootDir: 'src', outDir: 'збірка' });
    await runBuild(projectDir);

    const map = JSON.parse(readFileSync(join(projectDir, 'збірка', 'гроші.mjs.map'), 'utf8'));

    assert.deepEqual(map.sources, ['../src/гроші.potuzhno']);
    assert.match(map.sourcesContent[0], /вивезти батон ПДВ/);
  });

  it('sourceMap: false не пише карт і коментаря', async () => {
    writeConfig(projectDir, { include: ['src'], outDir: 'збірка', sourceMap: false });
    await runBuild(projectDir);

    assert.equal(existsSync(join(projectDir, 'збірка', 'гроші.mjs.map')), false);

    assert.doesNotMatch(
      readFileSync(join(projectDir, 'збірка', 'гроші.mjs'), 'utf8'),
      /sourceMappingURL/,
    );
  });

  it('bundle збирає все в один файл, який працює, як вихідна програма', async () => {
    writeConfig(projectDir, { bundle: true, entry: 'src/головна.potuzhno', outDir: 'збірка' });

    const { exitCode, errors } = await runBuild(projectDir);

    assert.deepEqual(errors, []);
    assert.equal(exitCode, 0);

    assert.deepEqual(readdirSync(join(projectDir, 'збірка')).sort(), [
      'головна.mjs',
      'головна.mjs.map',
    ]);

    assert.match(readFileSync(join(projectDir, 'збірка', 'головна.mjs'), 'utf8'), /Без ПДВ: /);

    assert.deepEqual(runNode(join(projectDir, 'збірка', 'головна.mjs')), {
      stdout: SHOP_OUTPUT,
      stderr: ['Помилка: Немає товару «Лимон»'],
    });
  });

  it('bundle: outFile задає назву файлу, а пакети лишаються імпортами', async () => {
    writeFileSync(
      join(projectDir, 'src', 'з-пакетом.potuzhno'),
      'завезти { join } з "node:path";\nОП.звернення(join("а", "б"));\n',
    );

    writeConfig(projectDir, {
      bundle: true,
      entry: 'src/з-пакетом.potuzhno',
      outFile: 'прога.mjs',
      outDir: 'збірка',
    });

    await runBuild(projectDir);

    assert.match(readFileSync(join(projectDir, 'збірка', 'прога.mjs'), 'utf8'), /from "node:path"/);
    assert.deepEqual(runNode(join(projectDir, 'збірка', 'прога.mjs')).stdout, ['а/б']);
  });

  it('помилка перекладу в bundle показується повідомленням, код виходу 1', async () => {
    writeFileSync(
      join(projectDir, 'src', 'колізія.potuzhno'),
      'потужно кут = 1;\nпотужно куть = 2;\n',
    );

    writeConfig(projectDir, { bundle: true, entry: 'src/колізія.potuzhno', outDir: 'збірка' });

    const { exitCode, errors } = await runBuild(projectDir);

    assert.equal(exitCode, 1);
    assert.match(errors[0], /однакове латинське імʼя «kut»/);
  });

  it('помилка перекладу в зборці зі структурою теж без стеку', async () => {
    writeFileSync(
      join(projectDir, 'src', 'колізія.potuzhno'),
      'потужно кут = 1;\nпотужно куть = 2;\n',
    );

    writeConfig(projectDir, { include: ['src'] });

    const { exitCode, errors } = await runBuild(projectDir);

    assert.equal(exitCode, 1);
    assert.match(errors[0], /однакове латинське імʼя «kut»/);
  });

  it('помилки конфігу й порожнього include дають код 1 і зрозуміле повідомлення', async () => {
    writeConfig(projectDir, { include: ['немає-такої-теки'] });
    assert.match((await runBuild(projectDir)).errors[0], /не файл .potuzhno, не тека і не шаблон/);

    writeConfig(projectDir, { include: ['порожня/**/*.potuzhno'] });
    assert.match((await runBuild(projectDir)).errors[0], /Не знайшов жодного файлу/);

    writeConfig(projectDir, { outdir: 'збірка' });
    assert.match((await runBuild(projectDir)).errors[0], /невідомий параметр/);

    rmSync(join(projectDir, CONFIG_FILE_NAME));
    assert.match((await runBuild(projectDir)).errors[0], /Не знайшов/);
  });

  it('не бере файли з node_modules і з outDir', async () => {
    mkdirSync(join(projectDir, 'node_modules', 'пакет'), { recursive: true });
    writeFileSync(join(projectDir, 'node_modules', 'пакет', 'чужий.potuzhno'), 'потужно х = 1;\n');
    mkdirSync(join(projectDir, 'збірка'));
    writeFileSync(join(projectDir, 'збірка', 'старий.potuzhno'), 'потужно х = 1;\n');
    writeConfig(projectDir, { outDir: 'збірка' });

    const { messages } = await runBuild(projectDir);

    assert.match(messages[0], /Зібрано файлів: 5,/);
  });

  it('невідомі аргументи дають підказку', async () => {
    const { exitCode, errors } = await runBuild(projectDir, ['--невідомо']);

    assert.equal(exitCode, 1);
    assert.match(errors[0], /Як зібрати/);
  });
});

describe('potuzhno build -w', () => {
  it('перезбирає після зміни файлу', async () => {
    const watchDirectory = mkdtempSync(join(tmpdir(), 'potuzhno-watch-'));
    const outputPath = join(watchDirectory, 'dist', 'привіт.mjs');

    writeFileSync(join(watchDirectory, 'привіт.potuzhno'), 'ОП.звернення("перша версія");\n');
    writeConfig(watchDirectory, {});

    const child = spawn(process.execPath, [BIN_PATH, 'build', '-w', '-p', watchDirectory], {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: PLAIN_OUTPUT_ENVIRONMENT,
    });
    let output = '';

    child.stdout.on('data', (chunk) => (output += chunk));
    child.stderr.on('data', (chunk) => (output += chunk));

    try {
      await waitFor(
        () => output.includes('Стежу за змінами'),
        'спостерігач не стартував: ' + output,
      );

      assert.match(readFileSync(outputPath, 'utf8'), /перша версія/);

      // Невелика пауза, щоб спостерігач встиг підписатися до першої зміни
      await new Promise((resolve) => setTimeout(resolve, 500));
      writeFileSync(join(watchDirectory, 'привіт.potuzhno'), 'ОП.звернення("друга версія");\n');

      await waitFor(
        () => readFileSync(outputPath, 'utf8').includes('друга версія'),
        'зміна не перезібралася: ' + output,
      );
    } finally {
      child.kill();
      rmSync(watchDirectory, { recursive: true, force: true });
    }
  });
});

async function waitFor(condition: () => boolean, failureMessage: string): Promise<void> {
  const deadline = Date.now() + 15_000;

  while (Date.now() < deadline) {
    if (condition()) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  assert.fail(failureMessage);
}
