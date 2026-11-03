import type { DictionaryEntry, EntryFilter } from '../types.ts';
import { normalizeSearchText } from './normalize-search-text.ts';

export function filterEntries(
  entries: readonly DictionaryEntry[],
  filter: EntryFilter,
): readonly DictionaryEntry[] {
  const query = normalizeSearchText(filter.query);

  return entries.filter((entry) => {
    if (filter.groupId !== null && entry.groupId !== filter.groupId) {
      return false;
    }

    if (query === '') {
      return true;
    }

    const haystack = normalizeSearchText(`${entry.meme} ${entry.javascript} ${entry.gloss ?? ''}`);

    return haystack.includes(query);
  });
}
