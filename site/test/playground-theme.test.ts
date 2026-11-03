import assert from 'node:assert/strict';
import { test } from 'node:test';

import { PLAYGROUND_PALETTE } from '../src/features/playground/data/playground-theme.ts';

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((index) => {
    const value = parseInt(hex.slice(index, index + 2), 16) / 255;

    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(foreground: string, background: string): number {
  const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);

  return (light + 0.05) / (dark + 0.05);
}

test('кожен колір теми має контраст >= 4.5:1 на тлі deep', () => {
  const { background, ...colors } = PLAYGROUND_PALETTE;

  for (const [name, color] of Object.entries(colors)) {
    assert.ok(contrast(color, background) >= 4.5, `${name} ${color}`);
  }
});
