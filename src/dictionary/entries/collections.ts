import type { MemeEntry } from '../meme-dictionary.ts';

export const COLLECTIONS_ENTRIES: readonly MemeEntry[] = [
  // Сімʼя = Map, Фракція = Set
  ['Сімʼя', 'Map'],
  ['Фракція', 'Set'],
  ['в_команду', 'add'],
  ['в_темі', 'has'],
  ['склад', 'size'],

  // Слабкі посилання
  ['ТіньоваСімʼя', 'WeakMap'],
  ['ТіньоваФракція', 'WeakSet'],
  ['СлабкаЗгадка', 'WeakRef'],
  ['розсекретити', 'deref'],
  ['ЛіквідаційнаКомісія', 'FinalizationRegistry'],

  // Теорія множин
  ['різниця_мандатів', 'difference'],
  ['спільні_мандати', 'intersection'],
  ['обʼєднана_опозиція', 'union'],
  ['різниця_без_спільних', 'symmetricDifference'],
  ['входить_до_фракції', 'isSubsetOf'],
  ['включає_фракцію', 'isSupersetOf'],
  ['не_перетинаються', 'isDisjointFrom'],
  ['отримати_або_призначити', 'getOrInsert'],
  ['отримати_або_порахувати', 'getOrInsertComputed'],
];
