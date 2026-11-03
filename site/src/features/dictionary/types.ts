export interface DictionaryGroup {
  readonly id: string;
  readonly label: string;
}

export interface DictionaryEntry {
  readonly meme: string;
  readonly javascript: string;
  readonly groupId: string;
  readonly gloss?: string;
}

export interface DictionaryData {
  readonly groups: readonly DictionaryGroup[];
  readonly entries: readonly DictionaryEntry[];
}

export interface EntryFilter {
  readonly query: string;
  readonly groupId: string | null;
}
