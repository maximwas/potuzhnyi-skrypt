import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { MEME_ENTRIES } from '../../src/dictionary/meme-entries.ts';
import { enumerateStandardLibraryNames } from '../support/standard-library-names.ts';

// Кожна група виключень має одним рядком пояснену причину: мовчки пропускати імена не можна.
const EXCLUDED_NAME_GROUPS: readonly (readonly [reason: string, names: readonly string[]])[] = [
  [
    'Annex B, застарілі методи об’єктів: замість них є Object.getOwnPropertyDescriptor і Object.setPrototypeOf',
    ['__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__', '__proto__'],
  ],
  ['Annex B, глобальні escape/unescape: замінені encodeURIComponent', ['escape', 'unescape']],
  [
    'Annex B, HTML-методи рядка: застарілі, у сучасному коді їх не пишуть',
    ['anchor', 'big', 'blink', 'bold', 'fixed', 'fontcolor', 'fontsize', 'italics'],
  ],
  ['Annex B, HTML-методи рядка (продовження)', ['link', 'small', 'strike', 'sub', 'sup']],
  [
    'Annex B, застарілі синоніми: є substring, trimStart, trimEnd, getFullYear, toUTCString',
    ['substr', 'trimLeft', 'trimRight', 'getYear', 'setYear', 'toGMTString'],
  ],
  ['Annex B, RegExp.prototype.compile: змінює регулярний вираз на місці', ['compile']],
  [
    'Annex B, застарілі статичні поля RegExp ($1…$9 тощо)',
    [
      ...['$1', '$2', '$3', '$4', '$5', '$6', '$7', '$8', '$9', '$_', '$&', "$'", '$`', '$+'],
      ...['input', 'lastMatch', 'lastParen', 'leftContext', 'rightContext'],
    ],
  ],
  ['обмеження суворого режиму: caller й arguments кидають TypeError', ['caller', 'arguments']],
  [
    'eval виконує вихідний текст без перекладу, мемного слова в ньому все одно не зрозуміють',
    ['eval'],
  ],
  [
    'нутрощі console, які Node показує як власні поля',
    ['_ignoreErrors', '_stderr', '_stderrErrorHandler', '_stdout', '_stdoutErrorHandler', '_times'],
  ],
  [
    'лише інспектор або лише V8: у звичайному коді не трапляються',
    [
      ...['profile', 'profileEnd', 'context', 'createTask', 'prepareStackTrace'],
      ...['captureStackTrace', 'stackTraceLimit', 'toTemporalInstant'],
    ],
  ],
  [
    'коди DOMException зі старого DOM Level 1–3: замість них перевіряють name',
    [
      ...['ABORT_ERR', 'DATA_CLONE_ERR', 'DOMSTRING_SIZE_ERR', 'HIERARCHY_REQUEST_ERR'],
      ...['INDEX_SIZE_ERR', 'INUSE_ATTRIBUTE_ERR', 'INVALID_ACCESS_ERR', 'INVALID_CHARACTER_ERR'],
      ...[
        'INVALID_MODIFICATION_ERR',
        'INVALID_NODE_TYPE_ERR',
        'INVALID_STATE_ERR',
        'NAMESPACE_ERR',
      ],
      ...['NETWORK_ERR', 'NOT_FOUND_ERR', 'NOT_SUPPORTED_ERR', 'NO_DATA_ALLOWED_ERR'],
      ...['NO_MODIFICATION_ALLOWED_ERR', 'QUOTA_EXCEEDED_ERR', 'SECURITY_ERR', 'SYNTAX_ERR'],
      ...['TIMEOUT_ERR', 'TYPE_MISMATCH_ERR', 'URL_MISMATCH_ERR', 'VALIDATION_ERR'],
      ...['WRONG_DOCUMENT_ERR', 'QuotaExceededError'],
    ],
  ],
  [
    'явне керування ресурсами (using): ще не базовий рівень, у вебі немає',
    ['AsyncDisposableStack', 'DisposableStack', 'SuppressedError', 'dispose', 'asyncDispose'],
  ],
  [
    'потоки (Streams API): окрема велика бібліотека, не стандарт мови',
    [
      ...['ReadableStream', 'ReadableStreamBYOBReader', 'ReadableStreamBYOBRequest'],
      ...['ReadableByteStreamController', 'ReadableStreamDefaultController'],
      ...['ReadableStreamDefaultReader', 'WritableStream', 'WritableStreamDefaultController'],
      ...['WritableStreamDefaultWriter', 'TransformStream', 'TransformStreamDefaultController'],
      ...['ByteLengthQueuingStrategy', 'CountQueuingStrategy', 'CompressionStream'],
      ...['DecompressionStream', 'TextDecoderStream', 'TextEncoderStream'],
    ],
  ],
  [
    'обмін повідомленнями між контекстами, WebSocket і події помилок: платформа, не мова',
    [
      ...['BroadcastChannel', 'MessageChannel', 'MessagePort', 'MessageEvent', 'CloseEvent'],
      ...['ErrorEvent', 'WebSocket'],
    ],
  ],
  [
    'Performance API крім performance.now: записи й спостерігачі потрібні рідко',
    [
      ...['PerformanceEntry', 'PerformanceMark', 'PerformanceMeasure', 'PerformanceObserver'],
      ...['PerformanceObserverEntryList', 'PerformanceResourceTiming'],
    ],
  ],
  [
    'Web Crypto крім crypto.randomUUID і getRandomValues: ключі та SubtleCrypto — окрема область',
    ['CryptoKey', 'SubtleCrypto'],
  ],
  [
    'лише Node, не стандарт: Buffer, Console, URLPattern',
    ['Buffer', 'Console', 'URLPattern', 'Crypto', 'Performance'],
  ],
  [
    'сталі фаз події: замість них читають eventPhase або порівнюють з target',
    ['NONE', 'CAPTURING_PHASE', 'AT_TARGET', 'BUBBLING_PHASE'],
  ],
  [
    'застарілі члени Event: замість них стандартні target, stopPropagation, preventDefault',
    ['cancelBubble', 'initEvent', 'returnValue', 'srcElement'],
  ],
  ['обробники on*: підписуються через addEventListener', ['onabort', 'onresourcetimingbufferfull']],
  [
    'Performance API: записи, таймінги ресурсів і вимірювання Node, потрібні рідко',
    [
      ...['clearMarks', 'clearMeasures', 'clearResourceTimings', 'eventLoopUtilization'],
      ...['getEntries', 'getEntriesByName', 'getEntriesByType', 'markResourceTiming'],
      ...['nodeTiming', 'setResourceTimingBufferSize', 'timerify'],
    ],
  ],
  [
    'члени, пов’язані з потоками (Streams API) і SubtleCrypto: окрема область',
    ['stream', 'textStream', 'subtle'],
  ],
  [
    'нестандартні члени Request з undici (Node), у вебі їх немає',
    ['attribute', 'isHistoryNavigation', 'isReloadNavigation'],
  ],
];

const coveredNames = new Set(MEME_ENTRIES.map(([, jsWord]) => jsWord));

const excludedNames = new Set(EXCLUDED_NAME_GROUPS.flatMap(([, names]) => names));

describe('покриття стандартної бібліотеки', () => {
  const namesByGroup = enumerateStandardLibraryNames();
  const enumeratedNames = new Set([...namesByGroup.values()].flat());

  it('кожне ім’я стандартної бібліотеки є ціллю словника або у виключеннях', () => {
    const missing = [...enumeratedNames].filter(
      (name) => !coveredNames.has(name) && !excludedNames.has(name),
    );

    assert.deepEqual(missing.sort(), []);
  });

  it('виключення не містять імен, які вже є у словнику', () => {
    const redundant = [...excludedNames].filter((name) => coveredNames.has(name));

    assert.deepEqual(redundant, []);
  });

  it('виключення містять лише імена, які справді є в Node', () => {
    const stale = [...excludedNames].filter((name) => !enumeratedNames.has(name));

    assert.deepEqual(stale.sort(), []);
  });

  it('перелік охоплює очікувані групи', () => {
    for (const group of ['globalThis', 'Array', 'String', 'Map', '%TypedArray%', 'Generator']) {
      assert.ok((namesByGroup.get(group) ?? []).length > 0, group);
    }
  });
});
