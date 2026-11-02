// Імена стандартної бібліотеки беремо з Node, що виконує тести, а не зі списку в коді:
// нова версія Node з новим методом одразу ламає покриття, і ми це бачимо.
const TYPED_ARRAY_CLASS_NAMES: readonly string[] = [
  ...['Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array'],
  ...['Int32Array', 'Uint32Array', 'Float16Array', 'Float32Array', 'Float64Array'],
  ...['BigInt64Array', 'BigUint64Array'],
];

const ERROR_CLASS_NAMES: readonly string[] = [
  ...['EvalError', 'URIError', 'AggregateError', 'SuppressedError', 'DOMException'],
];

// Об'єкти-простори імен не є функціями, тому до списку globalThis їх додаємо вручну.
const NAMESPACE_NAMES: readonly string[] = [
  ...['Math', 'JSON', 'Reflect', 'console', 'performance', 'crypto'],
];

// Протокол ітератора й генератора: ці імена не є власними в жодному прототипі.
const ITERATOR_PROTOCOL_NAMES: readonly string[] = ['next', 'done', 'value', 'return', 'throw'];

const globalScope = globalThis as unknown as Record<string, unknown>;

function ownNames(host: object | undefined): string[] {
  return host === undefined ? [] : Object.getOwnPropertyNames(host);
}

function classHosts(className: string): object[] {
  const constructorFunction = globalScope[className] as { prototype?: object } | undefined;

  return constructorFunction === undefined
    ? []
    : [
        constructorFunction,
        ...(constructorFunction.prototype ? [constructorFunction.prototype] : []),
      ];
}

function buildHostsByGroup(): ReadonlyMap<string, readonly object[]> {
  const typedArray = Object.getPrototypeOf(Int8Array) as { prototype: object };
  const classNames = [
    ...['Object', 'Function', 'Array', 'String', 'Number', 'Boolean', 'BigInt', 'Promise'],
    ...['Map', 'Set', 'WeakMap', 'WeakSet', 'WeakRef', 'Symbol', 'Date', 'RegExp', 'Error'],
    ...['ArrayBuffer', 'DataView', 'Iterator', 'URL', 'URLSearchParams', 'TextEncoder'],
    ...['TextDecoder', 'AbortController', 'AbortSignal', 'Proxy', 'Event', 'EventTarget', 'Blob'],
    ...['Headers', 'Request', 'Response', 'FormData', 'Performance', 'Crypto'],
    ...ERROR_CLASS_NAMES,
    ...TYPED_ARRAY_CLASS_NAMES,
  ];

  const hostsByGroup = new Map<string, readonly object[]>();

  for (const className of classNames) {
    hostsByGroup.set(className, classHosts(className));
  }

  hostsByGroup.set('%TypedArray%', [typedArray, typedArray.prototype]);
  hostsByGroup.set('Generator', [Object.getPrototypeOf(function* () {}).prototype]);

  return hostsByGroup;
}

// Група → імена, які в ній є. Одне ім'я може бути в кількох групах.
export function enumerateStandardLibraryNames(): ReadonlyMap<string, readonly string[]> {
  const namesByGroup = new Map<string, readonly string[]>();

  const globalFunctionNames = ownNames(globalThis).filter(
    (name) => typeof globalScope[name] === 'function',
  );

  namesByGroup.set('globalThis', [...globalFunctionNames, ...NAMESPACE_NAMES]);

  for (const namespaceName of NAMESPACE_NAMES) {
    namesByGroup.set(namespaceName, ownNames(globalScope[namespaceName] as object));
  }

  for (const [group, hosts] of buildHostsByGroup()) {
    namesByGroup.set(group, hosts.flatMap(ownNames));
  }

  namesByGroup.set('екземпляр Error', ownNames(new Error('причина')));
  namesByGroup.set('протокол ітератора', ITERATOR_PROTOCOL_NAMES);

  return namesByGroup;
}
