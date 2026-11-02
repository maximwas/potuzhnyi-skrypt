import { writeFileSync } from 'node:fs';

import { MEME_ENTRIES } from '../../../src/dictionary/meme-entries.ts';
import { CompletionListBuilder } from './completion-list-builder.ts';
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
const completionListBuilder = new CompletionListBuilder({
  memeEntries: MEME_ENTRIES,
  scopeClassifier,
});

writeFileSync(
  new URL('../syntaxes/potuzhno-keywords.injection.json', import.meta.url),
  builder.build(),
);

writeFileSync(new URL('../completions.json', import.meta.url), completionListBuilder.build());
