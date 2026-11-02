import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { MemeDictionary, type MemeEntry } from '../../src/dictionary/meme-dictionary.ts';
import { MEME_ENTRIES } from '../../src/dictionary/meme-entries.ts';
import { DOM_NAMES } from '../support/dom-names.ts';
import { JAVASCRIPT_KEYWORD_TARGETS, OPERATOR_TARGETS } from '../support/javascript-words.ts';
import { enumerateStandardLibraryNames } from '../support/standard-library-names.ts';

describe('MemeDictionary', () => {
  it('знаходить JS-слово за мемним', () => {
    const dictionary = new MemeDictionary({ memeEntries: [['потужно', 'let']] });

    assert.equal(dictionary.findJsWord('потужно'), 'let');
    assert.equal(dictionary.size, 1);
  });

  it('повертає undefined для невідомого слова', () => {
    const dictionary = new MemeDictionary({ memeEntries: [['потужно', 'let']] });

    assert.equal(dictionary.findJsWord('ганьба'), undefined);
  });

  it('відхиляє мемне слово, яке повторюється', () => {
    const duplicatedEntries: MemeEntry[] = [
      ['потужно', 'let'],
      ['потужно', 'const'],
    ];

    assert.throws(() => new MemeDictionary({ memeEntries: duplicatedEntries }), /«потужно»/);
  });

  describe('словник проєкту', () => {
    it('не містить повторів', () => {
      const dictionary = new MemeDictionary({ memeEntries: MEME_ENTRIES });

      assert.equal(dictionary.size, MEME_ENTRIES.length);
    });

    it('складається з валідних імен JS', () => {
      for (const [meme] of MEME_ENTRIES) {
        assert.doesNotThrow(() => new Function(`let ${meme};`), meme);
      }
    });

    it('має для кожного мему існуюче в JS слово: ключове слово, оператор, Node або DOM', () => {
      const builtInNames = new Set([...enumerateStandardLibraryNames().values()].flat());

      const unknown = MEME_ENTRIES.filter(
        ([, jsWord]) =>
          !JAVASCRIPT_KEYWORD_TARGETS.includes(jsWord) &&
          !OPERATOR_TARGETS.includes(jsWord) &&
          !builtInNames.has(jsWord) &&
          !DOM_NAMES.has(jsWord),
      );

      assert.deepEqual(unknown, []);
    });

    it('дає кожному JS-слову рівно один мем', () => {
      const memesByJsWord = Map.groupBy(MEME_ENTRIES, ([, jsWord]) => jsWord);
      const duplicated = [...memesByJsWord]
        .filter(([, entries]) => entries.length > 1)
        .map(([jsWord, entries]) => `${jsWord}: ${entries.map(([meme]) => meme).join(', ')}`);

      assert.deepEqual(duplicated, []);
    });

    it('складається лише з українських літер, цифр, _ і ʼ', () => {
      for (const [meme] of MEME_ENTRIES) {
        assert.match(meme, /^[А-ЩЬЮЯЄІЇҐа-щьюяєіїґʼ][А-ЩЬЮЯЄІЇҐа-щьюяєіїґʼ0-9_]*$/u, meme);
      }
    });
  });
});
