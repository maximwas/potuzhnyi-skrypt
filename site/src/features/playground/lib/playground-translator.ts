import jsTokens from 'js-tokens';
import { transliterate } from 'kmu-translit';

import { MemeDictionary } from '../../../../../src/dictionary/meme-dictionary.ts';
import { MEME_ENTRIES } from '../../../../../src/dictionary/meme-entries.ts';
import { IdentifierScanner } from '../../../../../src/translation/identifier-scanner.ts';
import { NameCollisionError } from '../../../../../src/translation/name-collision-error.ts';
import type { Replacement } from '../../../../../src/translation/translator.ts';
import { Translator } from '../../../../../src/translation/translator.ts';
import { LatinTransliterator } from '../../../../../src/transliteration/latin-transliterator.ts';

export const PLAYGROUND_FILE_NAME = 'код.potuzhno';

export type PlaygroundTranslation =
  | { readonly ok: true; readonly code: string; readonly replacements: readonly Replacement[] }
  | { readonly ok: false; readonly message: string };

interface PlaygroundTranslatorDependencies {
  readonly translator: Translator;
}

export class PlaygroundTranslator {
  private readonly translator: Translator;

  public constructor({ translator }: PlaygroundTranslatorDependencies) {
    this.translator = translator;
  }

  public translate(source: string): PlaygroundTranslation {
    try {
      const { code, replacements } = this.translator.translate(source, PLAYGROUND_FILE_NAME);

      return { ok: true, code, replacements };
    } catch (error) {
      if (error instanceof NameCollisionError) {
        return { ok: false, message: error.message };
      }

      return { ok: false, message: 'Не вдалося перекласти цей код. Перевір лапки та дужки.' };
    }
  }
}

// Збірка без Awilix і без src/container.ts (той тягне node:fs та node:module).
// reservedWords — фіксований список із Node, а не globalThis браузера.
export function createPlaygroundTranslator(reservedWords: readonly string[]): PlaygroundTranslator {
  const memeDictionary = new MemeDictionary({ memeEntries: MEME_ENTRIES });
  const latinTransliterator = new LatinTransliterator({
    transliterate,
    reservedWords: new Set(reservedWords),
  });
  const identifierScanner = new IdentifierScanner({ tokenize: jsTokens, memeDictionary });
  const translator = new Translator({ identifierScanner, memeDictionary, latinTransliterator });

  return new PlaygroundTranslator({ translator });
}
