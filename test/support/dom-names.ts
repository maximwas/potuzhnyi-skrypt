// Назви DOM, якими фронтенд-розробник користується щодня. Критерій добору:
// - беремо типи й члени, які трапляються в звичайному коді сторінки без бібліотек;
// - пропускаємо обробники `on*` (на подію підписуються через addEventListener);
// - пропускаємо застарілі члени (@deprecated у lib.dom.d.ts) і рідкісні API (WebGL, MIDI, VR тощо).
// Назви подій ('click', 'input') — рядки, а рядки перекладач не чіпає, тому їх тут немає.
// Кожну назву тест звіряє з node_modules/typescript/lib/lib.dom.d.ts: список не може розійтися з DOM.
export interface DomNameGroup {
  readonly description: string;
  // Інтерфейси lib.dom.d.ts, у яких має бути кожне ім'я групи (власний і міксини).
  readonly interfaces: readonly string[];
  readonly names: readonly string[];
}

export const DOM_CLASS_NAMES: readonly string[] = [
  ...['Node', 'Element', 'HTMLElement', 'Document', 'DocumentFragment'],
  ...['MouseEvent', 'KeyboardEvent'],
  ...['CustomEvent', 'NodeList', 'HTMLCollection', 'DOMTokenList', 'CSSStyleDeclaration'],
  ...['HTMLInputElement', 'HTMLFormElement', 'HTMLSelectElement', 'HTMLTextAreaElement'],
  ...['HTMLAnchorElement', 'HTMLImageElement', 'HTMLCanvasElement'],
  ...['Location', 'History', 'Storage', 'Navigator', 'MutationObserver', 'IntersectionObserver'],
  ...['ResizeObserver', 'FileReader'],
  'Window',
];

export const DOM_MEMBER_GROUPS: readonly DomNameGroup[] = [
  {
    description: 'Node',
    interfaces: ['Node'],
    names: [
      ...['parentNode', 'parentElement', 'childNodes', 'firstChild', 'lastChild', 'nextSibling'],
      ...['previousSibling', 'nodeType', 'nodeName', 'textContent', 'isConnected'],
      ...['appendChild', 'removeChild', 'insertBefore', 'cloneNode'],
      ...['hasChildNodes', 'contains'],
    ],
  },
  {
    description: 'ParentNode і ChildNode',
    interfaces: ['ParentNode', 'ChildNode'],
    names: [
      ...['children', 'firstElementChild', 'lastElementChild', 'childElementCount'],
      ...['querySelector', 'querySelectorAll', 'prepend', 'append', 'replaceChildren'],
      ...['before', 'after', 'remove', 'replaceWith'],
    ],
  },
  {
    description: 'Element',
    interfaces: ['Element'],
    names: [
      ...['id', 'className', 'classList', 'attributes', 'tagName', 'innerHTML', 'outerHTML'],
      ...['clientWidth', 'clientHeight', 'scrollWidth', 'scrollHeight', 'scrollTop', 'scrollLeft'],
      ...['getAttribute', 'setAttribute', 'removeAttribute', 'hasAttribute'],
      ...['closest', 'matches', 'getBoundingClientRect', 'scrollIntoView'],
      ...['scrollBy', 'scrollTo', 'insertAdjacentHTML'],
      ...['getElementsByClassName'],
      'getElementsByTagName',
    ],
  },
  {
    description: 'HTMLElement',
    interfaces: ['HTMLElement', 'ElementCSSInlineStyle', 'HTMLOrSVGElement'],
    names: [
      ...['style', 'dataset', 'hidden', 'title', 'innerText', 'offsetWidth'],
      ...['offsetHeight', 'offsetTop', 'offsetLeft', 'click', 'focus', 'blur'],
      ...['tabIndex'],
    ],
  },
  {
    description: 'Document',
    interfaces: ['Document', 'NonElementParentNode', 'DocumentOrShadowRoot'],
    names: [
      ...['documentElement', 'body', 'head', 'cookie', 'readyState', 'referrer', 'activeElement'],
      ...['forms', 'links'],
      ...['visibilityState', 'createElement', 'createTextNode', 'createComment'],
      ...['createDocumentFragment', 'getElementById'],
      ...['getSelection'],
    ],
  },
  {
    description: 'EventTarget і Event',
    interfaces: ['EventTarget', 'Event', 'CustomEvent'],
    names: [
      ...['addEventListener', 'removeEventListener', 'dispatchEvent', 'preventDefault'],
      ...['stopPropagation', 'stopImmediatePropagation', 'target', 'currentTarget', 'type'],
      ...['bubbles', 'cancelable', 'defaultPrevented'],
      'detail',
    ],
  },
  {
    description: 'Миша, клавіатура, ввід, вказівник',
    interfaces: ['MouseEvent', 'KeyboardEvent'],
    names: [
      ...['clientX', 'clientY', 'pageX', 'pageY'],
      ...['button', 'altKey', 'ctrlKey', 'metaKey', 'shiftKey'],
      ...['relatedTarget', 'key', 'code', 'repeat'],
      ...[],
    ],
  },
  {
    description: 'DOMTokenList, NodeList, HTMLCollection',
    interfaces: ['DOMTokenList', 'NodeList', 'HTMLCollection'],
    names: [
      ...['add', 'remove', 'toggle', 'contains', 'replace', 'item', 'supports', 'value'],
      ...['length', 'forEach', 'entries', 'keys', 'values', 'namedItem'],
    ],
  },
  {
    description: 'CSSStyleDeclaration: методи та щоденні властивості',
    interfaces: ['CSSStyleDeclaration', 'CSSStyleProperties', 'CSSStyleDeclarationBase'],
    names: [
      ...['cssText', 'getPropertyValue', 'setProperty', 'removeProperty'],
      ...['display', 'position', 'top', 'right', 'bottom', 'left', 'width', 'height', 'margin'],
      ...['padding', 'border', 'color', 'backgroundColor', 'fontSize'],
      ...['opacity', 'transform'],
      ...[],
    ],
  },
  {
    description: 'Поля вводу, форми, вибір, текстове поле',
    interfaces: [
      ...['HTMLInputElement', 'HTMLFormElement', 'HTMLSelectElement', 'HTMLTextAreaElement'],
      ...['HTMLOptionElement'],
    ],
    names: [
      ...['name', 'checked', 'disabled', 'files', 'placeholder', 'readOnly', 'required'],
      ...['selectionStart', 'selectionEnd', 'setSelectionRange', 'select', 'validity'],
      ...['valueAsNumber', 'multiple', 'min', 'max', 'step', 'pattern'],
      ...['maxLength', 'checkValidity', 'reportValidity'],
      ...['form', 'elements', 'action'],
      ...['method', 'submit', 'reset', 'requestSubmit', 'options', 'selectedIndex'],
      ...['selected', 'rows'],
    ],
  },
  {
    description: 'Посилання, картинка, canvas',
    interfaces: [
      'HTMLAnchorElement',
      'HTMLImageElement',
      'HTMLCanvasElement',
      'HTMLHyperlinkElementUtils',
    ],
    names: [
      ...['href', 'download', 'target', 'src', 'alt'],
      ...['naturalWidth', 'naturalHeight', 'decode', 'getContext'],
      ...['toDataURL', 'toBlob'],
    ],
  },
  {
    description: 'Location, History, Storage',
    interfaces: ['Location', 'History', 'Storage'],
    names: [
      ...['origin', 'protocol', 'host', 'hostname', 'port', 'pathname', 'search', 'hash'],
      ...['assign', 'reload', 'back', 'forward', 'go', 'pushState', 'replaceState', 'state'],
      ...['getItem', 'setItem', 'removeItem', 'key', 'clear'],
    ],
  },
  {
    description: 'Navigator, буфер обміну, геолокація',
    interfaces: [
      'Navigator',
      'NavigatorID',
      'NavigatorLanguage',
      'NavigatorOnLine',
      'NavigatorCookies',
      'NavigatorConcurrentHardware',
      'Clipboard',
      'Geolocation',
    ],
    names: [
      ...['userAgent', 'language', 'languages', 'onLine'],
      ...['clipboard', 'geolocation'],
      ...['sendBeacon', 'share', 'readText'],
      ...['writeText', 'getCurrentPosition'],
    ],
  },
  {
    description: 'Window',
    interfaces: [
      ...['Window', 'WindowLocalStorage', 'WindowSessionStorage', 'WindowOrWorkerGlobalScope'],
      ...['AnimationFrameProvider', 'GlobalEventHandlers'],
    ],
    names: [
      ...['window', 'document', 'location', 'alert', 'confirm', 'prompt', 'requestAnimationFrame'],
      ...['cancelAnimationFrame', 'getComputedStyle', 'matchMedia', 'scrollX', 'scrollY'],
      ...['innerWidth', 'innerHeight', 'devicePixelRatio'],
      ...['history', 'navigator', 'localStorage', 'sessionStorage', 'screen'],
      ...['parent', 'top', 'self', 'open', 'close', 'print'],
      ...['postMessage', 'requestIdleCallback', 'indexedDB'],
      ...[],
    ],
  },
  {
    description: 'Спостерігачі, читання файлів, медіа, діалог',
    interfaces: [
      ...['MutationObserver', 'IntersectionObserver', 'ResizeObserver', 'FileReader'],
      ...['HTMLMediaElement', 'HTMLTemplateElement'],
      ...['HTMLDialogElement', 'DOMRectReadOnly'],
    ],
    names: [
      ...['observe', 'unobserve', 'disconnect'],
      ...['readAsText', 'readAsDataURL', 'result'],
      ...['showModal', 'play', 'pause'],
    ],
  },
];

export const DOM_NAMES: ReadonlySet<string> = new Set([
  ...DOM_CLASS_NAMES,
  ...DOM_MEMBER_GROUPS.flatMap((group) => group.names),
]);
