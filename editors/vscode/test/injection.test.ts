import { readFileSync } from 'node:fs';
import { before, describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { MEME_ENTRIES } from '../../../src/dictionary/meme-entries.ts';
import { InjectionGrammarBuilder } from '../scripts/injection-grammar-builder.ts';
import { ScopeClassifier } from '../scripts/scope-classifier.ts';
import { FALLBACK_SCOPE, SCOPE_GROUPS } from '../scripts/scope-groups.ts';
import { GrammarTester } from './grammar-tester.ts';

const scopeClassifier = new ScopeClassifier({
  scopeGroups: SCOPE_GROUPS,
  fallbackScope: FALLBACK_SCOPE,
});

// Кореневий scope source.potuzhno теж закінчується на .potuzhno, тому його виключаємо.
const hasMemeScope = (scopes: readonly string[]): boolean =>
  scopes.some((scope) => scope !== 'source.potuzhno' && scope.endsWith('.potuzhno'));

const CODE_CONTEXTS: Readonly<Record<string, string>> = {
  'верхній рівень': 'WORD;',
  'тіло функції': 'function f() {\n  WORD;\n}',
  'тіло класу': 'class C {\n  m() {\n    WORD;\n  }\n}',
  'стрілкова функція': 'const f = () => WORD;',
  'вираз у шаблоні': 'const s = `a ${WORD} b`;',
};

const NON_CODE_CONTEXTS: Readonly<Record<string, string>> = {
  'подвійні лапки': 'const s = "WORD";',
  'одинарні лапки': "const s = 'WORD';",
  'рядковий коментар': '// WORD',
  'блоковий коментар': '/* WORD */',
  'регулярний вираз': 'const r = /WORD/;',
  'текст шаблону': 'const s = `a WORD b`;',
};

describe('ін’єкція мемних слів', () => {
  let tester: GrammarTester;

  before(async () => {
    tester = await GrammarTester.create();
  });

  for (const [contextName, template] of Object.entries(CODE_CONTEXTS)) {
    it(`усі слова мають свій scope: ${contextName}`, () => {
      const failures: string[] = [];

      for (const [meme, jsWord] of MEME_ENTRIES) {
        const expected = scopeClassifier.classify(jsWord);
        const scopes = tester.scopesOf(template.replace('WORD', meme), meme);

        if (!scopes.includes(expected)) {
          failures.push(`${meme} → очікував ${expected}, отримав ${scopes.join(' ')}`);
        }
      }

      assert.deepEqual(failures, []);
    });
  }

  for (const [contextName, template] of Object.entries(NON_CODE_CONTEXTS)) {
    it(`жодне слово не підсвічується: ${contextName}`, () => {
      const failures: string[] = [];

      for (const [meme] of MEME_ENTRIES) {
        const scopes = tester.scopesOf(template.replace('WORD', meme), meme);

        if (hasMemeScope(scopes)) {
          failures.push(`${meme}: ${scopes.join(' ')}`);
        }
      }

      assert.deepEqual(failures, []);
    });
  }

  it('слово всередині чужого ідентифікатора не підсвічується', () => {
    const scopes = tester.scopesOf('const вхід = 1;', 'вхід');

    assert.ok(!hasMemeScope(scopes));
  });

  it('англійський JS лишається звичайним', () => {
    assert.ok(tester.scopesOf('let x = 1;', 'let').includes('storage.type.js'));
    assert.ok(tester.scopesOf('console.log(1);', 'log').includes('entity.name.function.js'));
  });

  it('закомічена ін’єкція збігається зі свіжозгенерованою', () => {
    const builder = new InjectionGrammarBuilder({
      memeEntries: MEME_ENTRIES,
      scopeClassifier,
      fallbackScope: FALLBACK_SCOPE,
    });
    const committed = readFileSync(
      new URL('../syntaxes/potuzhno-keywords.injection.json', import.meta.url),
      'utf8',
    );

    assert.equal(committed, builder.build());
  });
});
