import type { MemeEntry } from '../meme-dictionary.ts';

export const ERRORS_ENTRIES: readonly MemeEntry[] = [
  // Винятки
  ['Ганьба', 'Error'],
  ['Азірівка', 'SyntaxError'],
  ['Ахмєтова', 'TypeError'],
  ['Перевищення', 'RangeError'],
  ['МертваДуша', 'ReferenceError'],
  ['формулювання', 'message'],
  ['матеріали_справи', 'stack'],

  // Ганьба і родичі
  ['ЗагальнаГаньба', 'AggregateError'],
  ['ГанебнаОцінка', 'EvalError'],
  ['ГанебнаАдреса', 'URIError'],
  ['ДомашнійАрешт', 'DOMException'],
  ['чи_ганьба', 'isError'],
  ['код_справи', 'code'],
];
