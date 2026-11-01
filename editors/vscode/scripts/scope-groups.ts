// JS-цілі мемних слів, згруповані за TextMate-scope. Решта (методи, функції, властивості) іде в запасний scope.
export const SCOPE_GROUPS: readonly (readonly [scope: string, jsWords: readonly string[]])[] = [
  [
    'keyword.control.potuzhno',
    [
      ...['if', 'else', 'switch', 'case', 'default', 'for', 'while', 'do', 'break', 'continue'],
      ...['return', 'throw', 'try', 'catch', 'finally', 'await', 'yield'],
      ...['import', 'export', 'from', 'as'],
    ],
  ],
  ['storage.type.potuzhno', ['let', 'const', 'var', 'function', 'class']],
  ['storage.modifier.potuzhno', ['extends', 'static', 'get', 'set', 'async', 'constructor']],
  ['keyword.operator.potuzhno', ['new', 'typeof', 'instanceof', 'delete', 'void', 'in', 'of']],
  ['keyword.other.debugger.potuzhno', ['debugger']],
  ['variable.language.potuzhno', ['this', 'super', 'globalThis']],
  ['constant.language.potuzhno', ['true', 'false', 'null', 'undefined', 'NaN', 'Infinity']],
  [
    'support.class.potuzhno',
    [
      ...['Error', 'SyntaxError', 'TypeError', 'RangeError', 'ReferenceError'],
      ...['Object', 'Array', 'String', 'Number', 'Boolean', 'Map', 'Set', 'Promise', 'Date'],
      ...['Math', 'JSON', 'console'],
    ],
  ],
];

export const FALLBACK_SCOPE = 'support.function.potuzhno';
