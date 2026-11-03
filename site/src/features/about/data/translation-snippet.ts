export type SegmentKind = 'plain' | 'keyword' | 'name';

export interface SnippetSegment {
  readonly meme: string;
  readonly js: string;
  readonly kind: SegmentKind;
}

function plain(text: string): SnippetSegment {
  return { meme: text, js: text, kind: 'plain' };
}

function keyword(meme: string, js: string): SnippetSegment {
  return { meme, js, kind: 'keyword' };
}

function name(meme: string, js: string): SnippetSegment {
  return { meme, js, kind: 'name' };
}

// Сніпет написано руками, щоб не тягнути на сторінку весь перекладач.
// Що він збігається зі справжнім перекладом, перевіряє test/about-snippet.test.ts.
export const SNIPPET_LINES: readonly (readonly SnippetSegment[])[] = [
  [keyword('партія', 'class'), plain(' '), name('Гість', 'Hist'), plain(' {}')],
  [
    keyword('схема', 'function'),
    plain(' '),
    name('вітати', 'vitaty'),
    plain('('),
    name('імя', 'imia'),
    plain(') {'),
  ],
  [
    plain('  '),
    keyword('щоб', 'if'),
    plain(' ('),
    name('імя', 'imia'),
    plain(') '),
    keyword('ОП.звернення', 'console.log'),
    plain("('Привіт, ' + "),
    name('імя', 'imia'),
    plain(');'),
  ],
  [
    plain('  '),
    keyword('хто_не_чув', 'else'),
    plain(' '),
    keyword('ОП.звернення', 'console.log'),
    plain("('Привіт, світе');"),
  ],
  [plain('}')],
  [
    keyword('потужно', 'let'),
    plain(' '),
    name('готово', 'hotovo'),
    plain(' = '),
    keyword('перемога', 'true'),
    plain(';'),
  ],
  [
    keyword('батон', 'const'),
    plain(' '),
    name('новачок', 'novachok'),
    plain(' = '),
    keyword('по_новому', 'new'),
    plain(' '),
    name('Гість', 'Hist'),
    plain('();'),
  ],
];
