import { CONSOLE_ENTRIES } from '@core/dictionary/entries/console.ts';
import { ARRAY_ENTRIES } from '@core/dictionary/entries/array.ts';
import { COLLECTIONS_ENTRIES } from '@core/dictionary/entries/collections.ts';
import { DATE_AND_TIMERS_ENTRIES } from '@core/dictionary/entries/date-and-timers.ts';
import { DOM_EVENTS_ENTRIES } from '@core/dictionary/entries/dom-events.ts';
import { DOM_FORMS_ENTRIES } from '@core/dictionary/entries/dom-forms.ts';
import { DOM_NODES_ENTRIES } from '@core/dictionary/entries/dom-nodes.ts';
import { DOM_STYLE_ENTRIES } from '@core/dictionary/entries/dom-style.ts';
import { DOM_WINDOW_ENTRIES } from '@core/dictionary/entries/dom-window.ts';
import { ERRORS_ENTRIES } from '@core/dictionary/entries/errors.ts';
import { FUNCTION_ENTRIES } from '@core/dictionary/entries/function.ts';
import { ITERATORS_ENTRIES } from '@core/dictionary/entries/iterators.ts';
import { JSON_ENTRIES } from '@core/dictionary/entries/json.ts';
import { KEYWORDS_ENTRIES } from '@core/dictionary/entries/keywords.ts';
import { MATH_ENTRIES } from '@core/dictionary/entries/math.ts';
import { NETWORK_ENTRIES } from '@core/dictionary/entries/network.ts';
import { NUMBER_ENTRIES } from '@core/dictionary/entries/number.ts';
import { OBJECT_ENTRIES } from '@core/dictionary/entries/object.ts';
import { OPERATORS_ENTRIES } from '@core/dictionary/entries/operators.ts';
import { PROMISE_ENTRIES } from '@core/dictionary/entries/promise.ts';
import { REFLECT_AND_PROXY_ENTRIES } from '@core/dictionary/entries/reflect-and-proxy.ts';
import { REGEXP_ENTRIES } from '@core/dictionary/entries/regexp.ts';
import { STRING_ENTRIES } from '@core/dictionary/entries/string.ts';
import { SYMBOL_ENTRIES } from '@core/dictionary/entries/symbol.ts';
import { TYPED_ARRAYS_ENTRIES } from '@core/dictionary/entries/typed-arrays.ts';
import { VALUES_ENTRIES } from '@core/dictionary/entries/values.ts';
import type { MemeEntry } from '@core/dictionary/meme-dictionary.ts';

interface GroupSource {
  readonly id: string;
  readonly label: string;
  readonly entries: readonly MemeEntry[];
}

// Порядок як у MEME_ENTRIES: спочатку мова, потім бібліотека, наприкінці DOM.
export const GROUP_SOURCES: readonly GroupSource[] = [
  { id: 'keywords', label: 'ключові слова', entries: KEYWORDS_ENTRIES },
  { id: 'errors', label: 'помилки', entries: ERRORS_ENTRIES },
  { id: 'values', label: 'значення', entries: VALUES_ENTRIES },
  { id: 'console', label: 'консоль', entries: CONSOLE_ENTRIES },
  { id: 'math', label: 'математика', entries: MATH_ENTRIES },
  { id: 'json', label: 'JSON', entries: JSON_ENTRIES },
  { id: 'object', label: 'обʼєкти', entries: OBJECT_ENTRIES },
  { id: 'array', label: 'масиви', entries: ARRAY_ENTRIES },
  { id: 'string', label: 'рядки', entries: STRING_ENTRIES },
  { id: 'number', label: 'числа', entries: NUMBER_ENTRIES },
  { id: 'collections', label: 'колекції', entries: COLLECTIONS_ENTRIES },
  { id: 'promise', label: 'проміси', entries: PROMISE_ENTRIES },
  { id: 'date-and-timers', label: 'дата й таймери', entries: DATE_AND_TIMERS_ENTRIES },
  { id: 'network', label: 'мережа', entries: NETWORK_ENTRIES },
  { id: 'operators', label: 'оператори', entries: OPERATORS_ENTRIES },
  { id: 'function', label: 'функції', entries: FUNCTION_ENTRIES },
  { id: 'symbol', label: 'символи', entries: SYMBOL_ENTRIES },
  { id: 'regexp', label: 'регулярні вирази', entries: REGEXP_ENTRIES },
  { id: 'reflect-and-proxy', label: 'Reflect і Proxy', entries: REFLECT_AND_PROXY_ENTRIES },
  { id: 'typed-arrays', label: 'типізовані масиви', entries: TYPED_ARRAYS_ENTRIES },
  { id: 'iterators', label: 'ітератори', entries: ITERATORS_ENTRIES },
  { id: 'dom-events', label: 'DOM-події', entries: DOM_EVENTS_ENTRIES },
  { id: 'dom-nodes', label: 'DOM-вузли', entries: DOM_NODES_ENTRIES },
  { id: 'dom-style', label: 'стилі DOM', entries: DOM_STYLE_ENTRIES },
  { id: 'dom-forms', label: 'форми DOM', entries: DOM_FORMS_ENTRIES },
  { id: 'dom-window', label: 'вікно DOM', entries: DOM_WINDOW_ENTRIES },
];
