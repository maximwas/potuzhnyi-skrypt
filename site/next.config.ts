import path from 'node:path';

import type { NextConfig } from 'next';

// Сайт живе на project page GitHub Pages: https://<user>.github.io/<repo>/
const basePath = process.env.SITE_BASE_PATH ?? '';
// Сайт імпортує перекладач і словник з src/ кореня репо, тож збірка має бачити корінь.
const repositoryRoot = path.join(import.meta.dirname, '..');

const config: NextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  turbopack: { root: repositoryRoot },
  outputFileTracingRoot: repositoryRoot,
};

export default config;
