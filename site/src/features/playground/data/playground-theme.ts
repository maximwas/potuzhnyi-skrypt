import type { ThemeRegistration } from 'shiki/core';

export const PLAYGROUND_THEME_NAME = 'potuzhno-deep';

// Пари «колір на тлі deep» перевіряє тест на контраст >= 4.5:1.
export const PLAYGROUND_PALETTE = {
  background: '#0B2A5B',
  foreground: '#F6EFDF',
  keyword: '#FFD700',
  memeName: '#FF9A8F',
  string: '#9BD0A4',
  comment: '#A9B8D4',
  number: '#8EC5FF',
  punctuation: '#D5DDEC',
} as const;

export const PLAYGROUND_THEME: ThemeRegistration = {
  name: PLAYGROUND_THEME_NAME,
  type: 'dark',
  colors: {
    'editor.background': PLAYGROUND_PALETTE.background,
    'editor.foreground': PLAYGROUND_PALETTE.foreground,
  },
  tokenColors: [
    {
      scope: ['keyword', 'storage', 'constant.language', 'variable.language'],
      settings: { foreground: PLAYGROUND_PALETTE.keyword },
    },
    { scope: ['support', 'entity.name'], settings: { foreground: PLAYGROUND_PALETTE.memeName } },
    { scope: ['string', 'string.regexp'], settings: { foreground: PLAYGROUND_PALETTE.string } },
    {
      scope: ['comment'],
      settings: { foreground: PLAYGROUND_PALETTE.comment, fontStyle: 'italic' },
    },
    { scope: ['constant.numeric'], settings: { foreground: PLAYGROUND_PALETTE.number } },
    {
      scope: ['punctuation', 'meta.brace'],
      settings: { foreground: PLAYGROUND_PALETTE.punctuation },
    },
  ],
};
