import type { MemeEntry } from './meme-dictionary.ts';
import { KEYWORDS_ENTRIES } from './entries/keywords.ts';
import { ERRORS_ENTRIES } from './entries/errors.ts';
import { VALUES_ENTRIES } from './entries/values.ts';
import { CONSOLE_ENTRIES } from './entries/console.ts';
import { MATH_ENTRIES } from './entries/math.ts';
import { JSON_ENTRIES } from './entries/json.ts';
import { OBJECT_ENTRIES } from './entries/object.ts';
import { ARRAY_ENTRIES } from './entries/array.ts';
import { STRING_ENTRIES } from './entries/string.ts';
import { NUMBER_ENTRIES } from './entries/number.ts';
import { COLLECTIONS_ENTRIES } from './entries/collections.ts';
import { PROMISE_ENTRIES } from './entries/promise.ts';
import { DATE_AND_TIMERS_ENTRIES } from './entries/date-and-timers.ts';
import { NETWORK_ENTRIES } from './entries/network.ts';
import { OPERATORS_ENTRIES } from './entries/operators.ts';
import { FUNCTION_ENTRIES } from './entries/function.ts';
import { SYMBOL_ENTRIES } from './entries/symbol.ts';
import { REGEXP_ENTRIES } from './entries/regexp.ts';
import { REFLECT_AND_PROXY_ENTRIES } from './entries/reflect-and-proxy.ts';
import { TYPED_ARRAYS_ENTRIES } from './entries/typed-arrays.ts';
import { ITERATORS_ENTRIES } from './entries/iterators.ts';
import { DOM_EVENTS_ENTRIES } from './entries/dom-events.ts';
import { DOM_NODES_ENTRIES } from './entries/dom-nodes.ts';
import { DOM_STYLE_ENTRIES } from './entries/dom-style.ts';
import { DOM_FORMS_ENTRIES } from './entries/dom-forms.ts';
import { DOM_WINDOW_ENTRIES } from './entries/dom-window.ts';

// Мемне слово → JS-слово, один токен на один. Пояснення мемів і джерела — docs/research.md.
export const MEME_ENTRIES: readonly MemeEntry[] = [
  ...KEYWORDS_ENTRIES,
  ...ERRORS_ENTRIES,
  ...VALUES_ENTRIES,
  ...CONSOLE_ENTRIES,
  ...MATH_ENTRIES,
  ...JSON_ENTRIES,
  ...OBJECT_ENTRIES,
  ...ARRAY_ENTRIES,
  ...STRING_ENTRIES,
  ...NUMBER_ENTRIES,
  ...COLLECTIONS_ENTRIES,
  ...PROMISE_ENTRIES,
  ...DATE_AND_TIMERS_ENTRIES,
  ...NETWORK_ENTRIES,
  ...OPERATORS_ENTRIES,
  ...FUNCTION_ENTRIES,
  ...SYMBOL_ENTRIES,
  ...REGEXP_ENTRIES,
  ...REFLECT_AND_PROXY_ENTRIES,
  ...TYPED_ARRAYS_ENTRIES,
  ...ITERATORS_ENTRIES,
  ...DOM_EVENTS_ENTRIES,
  ...DOM_NODES_ENTRIES,
  ...DOM_STYLE_ENTRIES,
  ...DOM_FORMS_ENTRIES,
  ...DOM_WINDOW_ENTRIES,
];
