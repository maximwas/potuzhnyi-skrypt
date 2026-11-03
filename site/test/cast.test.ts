import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';

import { CAST, SHOUTS } from '../src/features/hero/data/cast.ts';

// Слова про злочини, гроші й вироки не можуть опинитися в бульбашках поруч із обличчями людей.
const FORBIDDEN_WORDS = [
  'ВІДКАТ',
  'ВИРОК',
  'ЗАСТАВА',
  'ЗРАДА',
  'СІЗО',
  'ГАНЬБА',
  'СХЕМА',
  'ПРОНЕСЕ',
];

test('у бульбашках лише нейтральні слова мови', () => {
  for (const shout of SHOUTS) {
    assert.ok(
      !FORBIDDEN_WORDS.some((word) => shout.word.includes(word)),
      `«${shout.word}» не для бульбашок`,
    );
  }
});

test('кожен герой сцени має картинку, унікальний id і порядок виходу', () => {
  assert.equal(new Set(CAST.map((member) => member.id)).size, CAST.length);
  assert.equal(new Set(CAST.map((member) => member.arrivalOrder)).size, CAST.length);

  for (const member of CAST) {
    assert.ok(existsSync(`public/scene/${member.id}.webp`), `немає public/scene/${member.id}.webp`);
    assert.ok(SHOUTS[member.firstShoutIndex], `${member.id}: firstShoutIndex поза списком`);
  }
});
