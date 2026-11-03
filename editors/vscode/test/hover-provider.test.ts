import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { describe, it } from 'node:test';

const loadCommonJs = createRequire(import.meta.url);
const { createHoverProvider } = loadCommonJs('../extension.cjs');

class FakeMarkdownString {
  public readonly value: string;

  public constructor(value: string) {
    this.value = value;
  }
}

class FakeRange {
  public readonly start: number;
  public readonly end: number;

  public constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
  }
}

class FakeHover {
  public readonly contents: FakeMarkdownString;
  public readonly range: FakeRange;

  public constructor(contents: FakeMarkdownString, range: FakeRange) {
    this.contents = contents;
    this.range = range;
  }
}

// У фейкових документа й позиції зсув у тексті збігається з позицією.
const fakeVscode = { Hover: FakeHover, MarkdownString: FakeMarkdownString, Range: FakeRange };
const fakeDocument = {
  getText: () => 'потужно х = 1;',
  offsetAt: (position: number) => position,
  positionAt: (offset: number) => offset,
};

describe('провайдер наведення', () => {
  it('перетворює відповідь сервісу на Hover з діапазоном', () => {
    const provider = createHoverProvider(fakeVscode, {
      hoverAt: (source: string, offset: number) => ({
        start: 0,
        end: 7,
        markdown: `${source}:${offset}`,
      }),
    });

    const hover = provider.provideHover(fakeDocument, 3);

    assert.equal(hover.contents.value, 'потужно х = 1;:3');
    assert.deepEqual([hover.range.start, hover.range.end], [0, 7]);
  });

  it('повертає undefined, коли сервіс нічого не знає про слово', () => {
    const provider = createHoverProvider(fakeVscode, { hoverAt: () => undefined });

    assert.equal(provider.provideHover(fakeDocument, 9), undefined);
  });
});
