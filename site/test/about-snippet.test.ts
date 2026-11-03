import assert from 'node:assert/strict';
import { test } from 'node:test';

import { createPotuzhnoContainer } from '../../src/container.ts';
import { SNIPPET_LINES } from '../src/features/about/data/translation-snippet.ts';
import { assignFlipSteps } from '../src/features/about/lib/flip-snippet.ts';

const SOURCE_FILE_NAME = 'snippet.potuzhno';

function joinLines(side: 'meme' | 'js'): string {
  return SNIPPET_LINES.map((line) => line.map((segment) => segment[side]).join('')).join('\n');
}

test('JS-сторона сніпета збігається зі справжнім перекладом мемної', () => {
  const translator = createPotuzhnoContainer().cradle.translator;

  assert.equal(translator.translate(joinLines('meme'), SOURCE_FILE_NAME).code, joinLines('js'));
});

test('імена перекладаються разом зі словом, що стоїть перед ними в рядку', () => {
  const { lines, stepCount } = assignFlipSteps(SNIPPET_LINES);
  const steps = lines.map((line) => line.map((segment) => segment.step));

  assert.deepEqual(steps[0], [1, 0, 1, 0]);
  assert.deepEqual(steps[2], [0, 3, 0, 3, 0, 4, 0, 4, 0]);
  assert.equal(stepCount, 10);
});
