import type { MemeEntry } from '../meme-dictionary.ts';

export const STRING_ENTRIES: readonly MemeEntry[] = [
  // Мова = String, Віра = Boolean, Гривня = Number
  ['Мова', 'String'],
  ['розкол', 'split'],
  ['очистити', 'trim'],
  ['майдан', 'toUpperCase'],
  ['кулуари', 'toLowerCase'],
  ['відмити', 'replace'],
  ['відмити_все', 'replaceAll'],
  ['накрутити', 'padStart'],
  ['накрутити_в_кінці', 'padEnd'],
  ['другий_термін', 'repeat'],
  ['договорняк', 'match'],
  ['експертиза', 'test'],
  ['озвучити', 'toString'],

  // Мова = String, решта
  ['літера_за_номером', 'charAt'],
  ['код_літери', 'charCodeAt'],
  ['кодова_точка', 'codePointAt'],
  ['закінчується_на', 'endsWith'],
  ['починається_з', 'startsWith'],
  ['привести_до_ладу', 'normalize'],
  ['порівняти_за_місцевими', 'localeCompare'],
  ['всі_договорняки', 'matchAll'],
  ['як_є', 'raw'],
  ['зі_кодів_літер', 'fromCharCode'],
  ['зі_кодових_точок', 'fromCodePoint'],
  ['вирізка', 'substring'],
  ['обрізати_спереду', 'trimStart'],
  ['обрізати_ззаду', 'trimEnd'],
  ['чи_законний_запис', 'isWellFormed'],
  ['зробити_законним', 'toWellFormed'],
  ['кулуари_місцеві', 'toLocaleLowerCase'],
  ['майдан_місцевий', 'toLocaleUpperCase'],
  ['розшук', 'search'],
];
