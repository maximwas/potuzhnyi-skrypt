import jsTokens from 'js-tokens';
import { transliterate } from 'kmu-translit';

import { MemeDictionary } from '../../../src/dictionary/meme-dictionary.ts';
import { MEME_ENTRIES } from '../../../src/dictionary/meme-entries.ts';
import { IdentifierScanner } from '../../../src/translation/identifier-scanner.ts';
import { Translator } from '../../../src/translation/translator.ts';
import { LatinTransliterator } from '../../../src/transliteration/latin-transliterator.ts';
import { collectReservedWords } from '../../../src/transliteration/reserved-words.ts';
import { HoverInfoService, type TypeScriptModule } from './hover-info-service.ts';

// Збірка без src/container.ts: той імпортує node:fs і node:module, а бандлу розширення вони не потрібні.
export function createHoverInfoService(typescript: TypeScriptModule | undefined): HoverInfoService {
  const memeDictionary = new MemeDictionary({ memeEntries: MEME_ENTRIES });
  const latinTransliterator = new LatinTransliterator({
    transliterate,
    reservedWords: collectReservedWords(globalThis),
  });
  const identifierScanner = new IdentifierScanner({ tokenize: jsTokens, memeDictionary });
  const translator = new Translator({ identifierScanner, memeDictionary, latinTransliterator });

  return new HoverInfoService({ translator, memeDictionary, typescript });
}
