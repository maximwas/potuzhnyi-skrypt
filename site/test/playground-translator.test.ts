import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import { createPotuzhnoContainer } from '../../src/container.ts';
import { collectReservedWords } from '../../src/transliteration/reserved-words.ts';
import {
  createPlaygroundTranslator,
  PLAYGROUND_FILE_NAME,
} from '../src/features/playground/lib/playground-translator.ts';

const reservedWordsPath = new URL(
  '../src/features/playground/data/reserved-words.json',
  import.meta.url,
);

execFileSync(process.execPath, ['scripts/generate-reserved-words.ts'], { stdio: 'pipe' });

const reservedWords: string[] = JSON.parse(readFileSync(reservedWordsPath, 'utf8'));
const corpus: { name: string; source: string }[] = JSON.parse(
  readFileSync(new URL('./corpus.json', import.meta.url), 'utf8'),
);
const budget = readFileSync(new URL('../../examples/бюджет.potuzhno', import.meta.url), 'utf8');

test('згенерований список дорівнює тому, що бачить Node', () => {
  assert.deepEqual(reservedWords, [...collectReservedWords(globalThis)].sort());
  assert.equal(reservedWords.length, 188);
});

test('фасад дає той самий код, що справжній контейнер, на всьому корпусі', () => {
  const real = createPotuzhnoContainer().cradle.translator;
  const facade = createPlaygroundTranslator(reservedWords);
  const sources = [...corpus.map((item) => item.source), budget];
  let differences = 0;

  for (const source of sources) {
    let expected: string | null = null;

    try {
      expected = real.translate(source, PLAYGROUND_FILE_NAME).code;
    } catch {
      expected = null;
    }

    const actual = facade.translate(source);

    if (expected === null ? actual.ok : !actual.ok || actual.code !== expected) {
      differences += 1;
    }
  }

  assert.equal(differences, 0);
  assert.ok(sources.length >= 39);
});

test('колізія імен дає дружнє повідомлення замість винятку', () => {
  const facade = createPlaygroundTranslator(reservedWords);
  const result = facade.translate('потужно Дім = 1;\nпотужно Дiм = 2;');

  assert.equal(result.ok, false);
});

test('replacements описують заміни у вихідному коді', () => {
  const facade = createPlaygroundTranslator(reservedWords);
  const result = facade.translate('потужно х = 1;');

  assert.ok(result.ok);
  assert.equal(result.replacements[0]?.original, 'потужно');
  assert.equal(result.replacements[0]?.replacement, 'let');
});
