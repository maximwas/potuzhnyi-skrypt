import { animate, stagger } from 'motion/react';

import { morphText } from './morph-text.ts';
import type { OutputRange } from './transform-planner.ts';

const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;

// Огортає слова у <span> за зсувом у тексті й програє появу + «перетворення» літер.
// shortcut: слово, розірване між кількома токенами Shiki, не анімується, а просто стоїть як є.
export function playTransform(root: HTMLElement, ranges: readonly OutputRange[]): void {
  const spans: { span: HTMLElement; range: OutputRange }[] = [];

  for (const range of [...ranges].reverse()) {
    const span = wrapRange(root, range);

    if (span) {
      spans.unshift({ span, range });
    }
  }

  spans.forEach(({ span, range }, index) => {
    span.textContent = range.original;
    animate(0, 1, {
      duration: 0.45,
      delay: index * 0.025,
      ease: EASE_OUT_QUINT,
      onUpdate: (progress) => {
        span.textContent = morphText(range.original, range.replacement, progress);
      },
      onComplete: () => {
        span.textContent = range.replacement;
      },
    });
  });

  animate(
    spans.map(({ span }) => span),
    { opacity: [0.2, 1], y: [6, 0] },
    { duration: 0.35, delay: stagger(0.025), ease: EASE_OUT_QUINT },
  );
}

function wrapRange(
  root: HTMLElement,
  { start, end, replacement }: OutputRange,
): HTMLElement | null {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let offset = 0;

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const length = node.textContent?.length ?? 0;

    if (start >= offset && end <= offset + length) {
      if (node.textContent?.slice(start - offset, end - offset) !== replacement) {
        return null;
      }

      const range = document.createRange();
      const span = document.createElement('span');

      range.setStart(node, start - offset);
      range.setEnd(node, end - offset);
      span.style.display = 'inline-block';
      range.surroundContents(span);

      return span;
    }

    offset += length;
  }

  return null;
}
