// JS-цілі мемних слів, згруповані за TextMate-scope. Решта (методи, функції, властивості) іде в запасний scope.
export const SCOPE_GROUPS: readonly (readonly [scope: string, jsWords: readonly string[]])[] = [
  [
    'keyword.control.potuzhno',
    [
      ...['if', 'else', 'switch', 'case', 'default', 'for', 'while', 'do', 'break', 'continue'],
      ...['return', 'throw', 'try', 'catch', 'finally', 'await', 'yield'],
      ...['import', 'export', 'from', 'as', 'with'],
    ],
  ],
  ['storage.type.potuzhno', ['let', 'const', 'var', 'function', 'class']],
  ['storage.modifier.potuzhno', ['extends', 'static', 'get', 'set', 'async', 'constructor']],
  ['keyword.operator.potuzhno', ['new', 'typeof', 'instanceof', 'delete', 'void', 'in', 'of']],
  ['keyword.operator.arithmetic.potuzhno', ['+', '-', '*', '/', '%']],
  ['keyword.other.debugger.potuzhno', ['debugger']],
  ['variable.language.potuzhno', ['this', 'super', 'globalThis']],
  ['constant.language.potuzhno', ['true', 'false', 'null', 'undefined', 'NaN', 'Infinity']],
  [
    'support.class.potuzhno',
    [
      ...['Error', 'SyntaxError', 'TypeError', 'RangeError', 'ReferenceError'],
      ...['AggregateError', 'EvalError', 'URIError', 'DOMException'],
      ...['Object', 'Function', 'Array', 'String', 'Number', 'Boolean', 'BigInt', 'Symbol'],
      ...['Map', 'Set', 'WeakMap', 'WeakSet', 'WeakRef', 'FinalizationRegistry'],
      ...['Promise', 'Date', 'RegExp', 'Proxy', 'Iterator'],
      ...['Math', 'JSON', 'Reflect', 'console', 'performance', 'crypto'],
      ...['ArrayBuffer', 'SharedArrayBuffer', 'DataView', 'Int8Array', 'Uint8Array'],
      ...['Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array'],
      ...['Float16Array', 'Float32Array', 'Float64Array', 'BigInt64Array', 'BigUint64Array'],
      ...['URL', 'URLSearchParams', 'Request', 'Response', 'Headers', 'FormData', 'Blob'],
      ...['File', 'AbortController', 'AbortSignal', 'TextEncoder', 'TextDecoder'],
      ...['Event', 'EventTarget', 'CustomEvent', 'MouseEvent', 'KeyboardEvent'],
      ...['Node', 'Element', 'HTMLElement', 'Document', 'DocumentFragment', 'NodeList'],
      ...['HTMLCollection', 'DOMTokenList', 'CSSStyleDeclaration', 'HTMLInputElement'],
      ...['HTMLFormElement', 'HTMLSelectElement', 'HTMLTextAreaElement', 'HTMLAnchorElement'],
      ...['HTMLImageElement', 'HTMLCanvasElement', 'Location', 'History', 'Storage'],
      ...['Navigator', 'MutationObserver', 'IntersectionObserver', 'ResizeObserver'],
      ...['FileReader', 'Window'],
      ...['window', 'document', 'location', 'history', 'navigator', 'localStorage'],
      'sessionStorage',
    ],
  ],
];

export const FALLBACK_SCOPE = 'support.function.potuzhno';
