import assert from 'node:assert/strict';
import { test } from 'node:test';

import { filterEntries } from '../src/features/dictionary/lib/filter-entries.ts';
import { formatWordCount } from '../src/features/dictionary/lib/format-word-count.ts';
import type { DictionaryEntry } from '../src/features/dictionary/types.ts';

const entries: readonly DictionaryEntry[] = [
  { meme: 'розпил', javascript: 'map', groupId: 'array' },
  { meme: 'Рада', javascript: 'Array', groupId: 'array' },
  { meme: 'донат_на_дрони', javascript: '+', groupId: 'operators', gloss: 'додавання' },
  { meme: 'обʼєкт', javascript: 'Object', groupId: 'object' },
];

test('порожній запит і без категорії повертає все', () => {
  assert.equal(filterEntries(entries, { query: '  ', groupId: null }).length, 4);
});

test('шукає і за мемом, і за JS-словом, без урахування регістру', () => {
  assert.deepEqual(
    filterEntries(entries, { query: 'РОЗП', groupId: null }).map((entry) => entry.meme),
    ['розпил'],
  );
  assert.deepEqual(
    filterEntries(entries, { query: 'array', groupId: null }).map((entry) => entry.meme),
    ['Рада'],
  );
});

test("апострофи ʼ ’ і ' вважаються однаковими", () => {
  for (const query of ['обʼ', 'об’', "об'"]) {
    assert.equal(filterEntries(entries, { query, groupId: null }).length, 1, query);
  }
});

test('оператор знаходиться за символом і за поясненням', () => {
  assert.equal(filterEntries(entries, { query: '+', groupId: null }).length, 1);
  assert.equal(filterEntries(entries, { query: 'додав', groupId: null }).length, 1);
});

test('категорія звужує вибірку разом із запитом', () => {
  assert.equal(filterEntries(entries, { query: '', groupId: 'array' }).length, 2);
  assert.equal(filterEntries(entries, { query: 'map', groupId: 'object' }).length, 0);
});

test('відмінювання слова «слово»', () => {
  assert.deepEqual([1, 2, 5, 11, 12, 21, 22, 771].map(formatWordCount), [
    '1 слово',
    '2 слова',
    '5 слів',
    '11 слів',
    '12 слів',
    '21 слово',
    '22 слова',
    '771 слово',
  ]);
});
