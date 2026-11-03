// Запуск: npm run generate. Фіксуємо те, що бачить Node, щоб вихід сторінки збігався з `node bin/potuzhno.ts`:
// globalThis браузера має ~1240 імен і змінив би назви на кшталт `status`.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { collectReservedWords } from '../../src/transliteration/reserved-words.ts';

const outputPath = fileURLToPath(
  new URL('../src/features/playground/data/reserved-words.json', import.meta.url),
);
const words = [...collectReservedWords(globalThis)].sort();

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(words));

console.log(`зарезервованих слів: ${words.length}`);
