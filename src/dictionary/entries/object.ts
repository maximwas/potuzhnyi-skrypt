import type { MemeEntry } from '../meme-dictionary.ts';

export const OBJECT_ENTRIES: readonly MemeEntry[] = [
  // Декларація = JSON, Майно = Object
  ['Майно', 'Object'],
  ['ключі', 'keys'],
  ['статки', 'values'],
  ['активи', 'entries'],
  ['переписати_на_тещу', 'assign'],
  ['арешт', 'freeze'],
  ['легалізувати', 'fromEntries'],
  ['прокладка', 'create'],
  ['оформлено_на_себе', 'hasOwn'],

  // Майно = Object
  ['оформити_актив', 'defineProperty'],
  ['оформити_активи', 'defineProperties'],
  ['витяг_із_реєстру', 'getOwnPropertyDescriptor'],
  ['витяги_із_реєстру', 'getOwnPropertyDescriptors'],
  ['імена_власників', 'getOwnPropertyNames'],
  ['символи_власників', 'getOwnPropertySymbols'],
  ['хто_був_першим', 'getPrototypeOf'],
  ['призначити_першого', 'setPrototypeOf'],
  ['однозначно', 'is'],
  ['чи_можна_добудувати', 'isExtensible'],
  ['чи_під_арештом', 'isFrozen'],
  ['чи_опечатано', 'isSealed'],
  ['заборонити_будівництво', 'preventExtensions'],
  ['опечатати', 'seal'],
  ['розкласти_по_фракціях', 'groupBy'],

  // Прототип і успадкування
  ['Єрмак', 'prototype'],
  ['декларовано_як_своє', 'hasOwnProperty'],
  ['чи_попередник', 'isPrototypeOf'],
  ['чи_видно_в_реєстрі', 'propertyIsEnumerable'],
  ['озвучити_місцевою', 'toLocaleString'],
  ['оцінна_вартість', 'valueOf'],
  ['позивний', 'name'],
];
