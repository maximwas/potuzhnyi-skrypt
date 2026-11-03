import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

export default defineConfig([
  globalIgnores(['.next/', 'out/', 'node_modules/', 'next-env.d.ts']),
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // Статичний експорт: next/image тут не оптимізує, тож картинки сцени звичайні <img>.
    rules: { '@next/next/no-img-element': 'off' },
  },
]);
