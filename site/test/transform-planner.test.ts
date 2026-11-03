import assert from 'node:assert/strict';
import { test } from 'node:test';

import { morphText } from '../src/features/playground/lib/morph-text.ts';
import { TransformPlanner } from '../src/features/playground/lib/transform-planner.ts';

const planner = new TransformPlanner({ maxAnimatedWords: 2 });

test('діапазони у виході враховують зсув і прибирають відступи оператора', () => {
  const ranges = planner.toOutputRanges([
    { start: 0, end: 7, original: 'потужно', replacement: 'let' },
    { start: 10, end: 15, original: 'відпил', replacement: ' - ' },
  ]);

  assert.deepEqual(ranges, [
    { start: 0, end: 3, original: 'потужно', replacement: 'let' },
    { start: 7, end: 8, original: 'відпил', replacement: '-' },
  ]);
});

test('змінені слова: знайомі пари не рахуються, понад ліміт — без анімації', () => {
  const word = (replacement: string, start: number) => ({
    start,
    end: start + 1,
    original: 'а',
    replacement,
  });
  const before = [word('let', 0)];

  assert.equal(planner.planChanges(null, before), null);
  assert.deepEqual(planner.planChanges(before, [word('let', 5), word('const', 9)]), [
    word('const', 9),
  ]);
  assert.equal(planner.planChanges([], [word('a', 0), word('b', 1), word('c', 2)]), null);
});

test('morphText іде від старого слова до нового', () => {
  assert.equal(morphText('потужно', 'let', 0), 'потужно');
  assert.equal(morphText('потужно', 'let', 1), 'let');
  assert.equal(morphText('потужно', 'let', 0.5), 'letжно');
});
