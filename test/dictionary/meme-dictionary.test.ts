import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { MemeDictionary, type MemeEntry } from '../../src/dictionary/meme-dictionary.ts';
import { MEME_ENTRIES } from '../../src/dictionary/meme-entries.ts';
import { BUILT_IN_HOSTS, JAVASCRIPT_KEYWORD_TARGETS } from '../support/javascript-words.ts';

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

    it('має для кожного мему існуюче в JS слово', () => {
      for (const [meme, jsWord] of MEME_ENTRIES) {
        const isKeyword = JAVASCRIPT_KEYWORD_TARGETS.includes(jsWord);
        const isBuiltIn = BUILT_IN_HOSTS.some((host) => jsWord in host);

        assert.ok(isKeyword || isBuiltIn, `${meme} → ${jsWord}`);
      }
    });
  });
});
