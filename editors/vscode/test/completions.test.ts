import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { MEME_ENTRIES } from '../../../src/dictionary/meme-entries.ts';
import { CompletionListBuilder } from '../scripts/completion-list-builder.ts';
import { ScopeClassifier } from '../scripts/scope-classifier.ts';
import { FALLBACK_SCOPE, SCOPE_GROUPS } from '../scripts/scope-groups.ts';

interface Completion {
  readonly label: string;
  readonly detail: string;
  readonly kind: string;
}

const loadCommonJs = createRequire(import.meta.url);
const { createCompletionItems } = loadCommonJs('../extension.cjs');

const completionListBuilder = new CompletionListBuilder({
  memeEntries: MEME_ENTRIES,
  scopeClassifier: new ScopeClassifier({
    scopeGroups: SCOPE_GROUPS,
    fallbackScope: FALLBACK_SCOPE,
  }),
});
const completions: Completion[] = JSON.parse(completionListBuilder.build());

function completionFor(jsWord: string): Completion {
  const completion = completions.find((candidate) => candidate.detail === jsWord);

  assert.ok(completion, `немає підказки для ${jsWord}`);

  return completion;
}

describe('підказки мемних слів', () => {
  it('completions.json збігається зі свіжою генерацією зі словника', () => {
    const committed = readFileSync(new URL('../completions.json', import.meta.url), 'utf8');

    assert.equal(committed, completionListBuilder.build());
  });

  it('кожне слово словника має підказку з JS-відповідником', () => {
    assert.equal(completions.length, MEME_ENTRIES.length);
    assert.deepEqual(completionFor('let'), { label: 'потужно', detail: 'let', kind: 'Keyword' });
  });

  it('вид підказки залежить від групи слова', () => {
    assert.equal(completionFor('Array').kind, 'Class');
    assert.equal(completionFor('+').kind, 'Operator');
    assert.equal(completionFor('this').kind, 'Variable');
    assert.equal(completionFor('null').kind, 'Constant');
    assert.equal(completionFor('map').kind, 'Method');
  });

  it('створює елементи підказок через API VS Code', () => {
    class FakeCompletionItem {
      public label: unknown;
      public kind: number;
      public detail = '';

      public constructor(label: unknown, kind: number) {
        this.label = label;
        this.kind = kind;
      }
    }

    const fakeVscode = { CompletionItem: FakeCompletionItem, CompletionItemKind: { Keyword: 13 } };

    const [item] = createCompletionItems(fakeVscode, [
      { label: 'потужно', detail: 'let', kind: 'Keyword' },
    ]);

    assert.deepEqual(item.label, { label: 'потужно', description: 'let' });
    assert.equal(item.kind, 13);
    assert.equal(item.detail, 'let');
  });
});
