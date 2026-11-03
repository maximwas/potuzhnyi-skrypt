import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

import { PLAYGROUND_EXAMPLES } from '../src/features/playground/data/playground-examples.ts';
import { createPlaygroundTranslator } from '../src/features/playground/lib/playground-translator.ts';

const reservedWords: string[] = JSON.parse(
  readFileSync(
    new URL('../src/features/playground/data/reserved-words.json', import.meta.url),
    'utf8',
  ),
);

test('приклад «Бюджет» збігається з examples/бюджет.potuzhno', () => {
  const file = readFileSync(new URL('../../examples/бюджет.potuzhno', import.meta.url), 'utf8');

  assert.equal(PLAYGROUND_EXAMPLES[0]?.source, file);
});

test('кожен приклад перекладається без помилок', () => {
  const facade = createPlaygroundTranslator(reservedWords);

  for (const example of PLAYGROUND_EXAMPLES) {
    const result = facade.translate(example.source);

    assert.ok(result.ok, example.title);
    assert.ok(result.replacements.length > 0, example.title);
  }
});
