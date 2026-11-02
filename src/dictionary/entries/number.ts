import type { MemeEntry } from '../meme-dictionary.ts';

export const NUMBER_ENTRIES: readonly MemeEntry[] = [
  // Мова = String, Віра = Boolean, Гривня = Number
  ['Гривня', 'Number'],
  ['зафіксувати', 'toFixed'],
  ['порахувати', 'parseInt'],
  ['порахувати_з_копійками', 'parseFloat'],
  ['чи_проффесор', 'isNaN'],

  // Гривня = Number, межі
  ['копійка_точності', 'EPSILON'],
  ['стеля_держбюджету', 'MAX_SAFE_INTEGER'],
  ['максимальний_транш', 'MAX_VALUE'],
  ['дно_держбюджету', 'MIN_SAFE_INTEGER'],
  ['мінімальна_субвенція', 'MIN_VALUE'],
  ['мінус_тарифи', 'NEGATIVE_INFINITY'],
  ['плюс_тарифи', 'POSITIVE_INFINITY'],

  // Гривня = Number, методи
  ['у_наукових_тарифах', 'toExponential'],
  ['з_точністю_до_копійки', 'toPrecision'],
  ['чи_є_межа', 'isFinite'],
  ['чи_ціла_гривня', 'isInteger'],
  ['чи_безпечна_гривня', 'isSafeInteger'],
  ['для_декларації', 'toJSON'],

  // Мільярдер = BigInt
  ['Мільярдер', 'BigInt'],
  ['мільярд_зі_знаком', 'asIntN'],
  ['мільярд_без_знаку', 'asUintN'],
];
