import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { PLAIN_OUTPUT_ENVIRONMENT } from '../support/plain-output-environment.ts';

const BIN_PATH = fileURLToPath(new URL('../../bin/potuzhno.ts', import.meta.url));
const EXAMPLES_PATH = fileURLToPath(new URL('../../examples/', import.meta.url));

interface ExampleCase {
  readonly file: string;
  readonly output: readonly string[];
  readonly errorOutput?: readonly string[];
}

const EXAMPLE_CASES: readonly ExampleCase[] = [
  {
    file: 'привіт.potuzhno',
    output: ['Привіт, ПотужнийСкрипт! Це запуск №1.', 'Крок 1 з 3', 'Крок 2 з 3', 'Крок 3 з 3'],
  },
  {
    file: 'числа.potuzhno',
    output: [
      '1 2 Фіз 4 Баз Фіз 7 8 Фіз Баз 11 Фіз 13 14 ФізБаз',
      'Прості до 30: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29',
      '10! = 3628800',
    ],
  },
  {
    file: 'колекції.potuzhno',
    output: [
      'Група А: 88.5',
      'Група Б: 86.5',
      'Груп: 2',
      'Найкращий: Іванна (95), решта: 3',
      'А, Б',
      '1 4 9 16 25',
    ],
  },
  {
    file: 'асинхронність.potuzhno',
    output: ['Початок', 'Завантажено звіт.txt, 80 байт', 'a.txt + bb.txt', 'Кінець'],
    errorOutput: ['Помилка: Не вдалося завантажити «зламано»'],
  },
  {
    file: 'магазин/головна.potuzhno',
    output: [
      'Без ПДВ: 236.00 грн',
      'З ПДВ 20%: 283.20 грн',
      'У каталозі товарів: 3',
      'Динамічно: 120.00 грн',
    ],
    errorOutput: ['Помилка: Немає товару «Лимон»'],
  },
];

function splitLines(text: string): string[] {
  return text.trimEnd().split('\n').filter(Boolean);
}

describe('examples/', () => {
  for (const { file, output, errorOutput = [] } of EXAMPLE_CASES) {
    it(`${file} виводить очікуване й завершується з кодом 0`, () => {
      const result = spawnSync(process.execPath, [BIN_PATH, EXAMPLES_PATH + file], {
        encoding: 'utf8',
        env: PLAIN_OUTPUT_ENVIRONMENT,
      });

      assert.deepEqual(splitLines(result.stderr), errorOutput);
      assert.deepEqual(splitLines(result.stdout), output);
      assert.equal(result.status, 0);
    });
  }
});
