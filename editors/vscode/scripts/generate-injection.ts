import { writeFileSync } from 'node:fs';

import { MEME_ENTRIES } from '../../../src/dictionary/meme-entries.ts';
import { InjectionGrammarBuilder } from './injection-grammar-builder.ts';
import { FALLBACK_SCOPE, SCOPE_GROUPS } from './scope-groups.ts';
import { ScopeClassifier } from './scope-classifier.ts';

const scopeClassifier = new ScopeClassifier({
  scopeGroups: SCOPE_GROUPS,
  fallbackScope: FALLBACK_SCOPE,
});
const builder = new InjectionGrammarBuilder({
  memeEntries: MEME_ENTRIES,
  scopeClassifier,
  fallbackScope: FALLBACK_SCOPE,
});
const outputPath = new URL('../syntaxes/potuzhno-keywords.injection.json', import.meta.url);

writeFileSync(outputPath, builder.build());
