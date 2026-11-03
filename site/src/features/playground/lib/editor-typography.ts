// Спільні метрики шрифту: шар підсвітки й textarea мусять збігатися до пікселя.
// 16px на телефоні, щоб iOS не наближав сторінку при фокусі.
export const EDITOR_TYPOGRAPHY =
  'font-mono text-base md:text-sm leading-6 whitespace-pre tab-size-[2] [tab-size:2] p-4 [letter-spacing:0] [font-variant-ligatures:none]';

export const SHIKI_RESET =
  '[&_pre]:m-0 [&_pre]:bg-transparent! [&_pre]:p-0 [&_pre]:font-[inherit] [&_pre]:overflow-visible [&_code]:font-[inherit]';
