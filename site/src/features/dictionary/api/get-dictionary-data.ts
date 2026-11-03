import { GROUP_SOURCES } from '../constants/dictionary-groups.ts';
import { OPERATOR_GLOSSES } from '../constants/operator-glosses.ts';
import type { DictionaryData } from '../types.ts';

// Викликається лише на сервері під час збірки; клієнту йде звичайний серіалізований обʼєкт.
export function getDictionaryData(): DictionaryData {
  return {
    groups: GROUP_SOURCES.map(({ id, label }) => ({ id, label })),
    entries: GROUP_SOURCES.flatMap(({ id, entries }) =>
      entries.map(([meme, javascript]) => ({
        meme,
        javascript,
        groupId: id,
        gloss: OPERATOR_GLOSSES.get(javascript),
      })),
    ),
  };
}
