import type { DictionaryEntry } from '../types.ts';

export function getEntryKey(entry: DictionaryEntry): string {
  return `${entry.groupId}:${entry.meme}:${entry.javascript}`;
}
