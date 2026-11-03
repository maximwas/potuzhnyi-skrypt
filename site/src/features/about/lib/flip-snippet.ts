import { SNIPPET_LINES } from '../data/translation-snippet.ts';
import type { SnippetSegment } from '../data/translation-snippet.ts';

export interface FlipSegment extends SnippetSegment {
  // 0 для звичайного тексту; інакше номер кроку, на якому слово перекладається (з 1)
  readonly step: number;
}

export interface FlipSnippet {
  readonly lines: readonly (readonly FlipSegment[])[];
  readonly stepCount: number;
}

// Мемне слово відкриває новий крок, а імена, що йдуть за ним у тому ж рядку, перекладаються разом із ним.
export function assignFlipSteps(sourceLines: readonly (readonly SnippetSegment[])[]): FlipSnippet {
  let stepCount = 0;

  const lines = sourceLines.map((line) => {
    let lineStep = 0;

    return line.map((segment): FlipSegment => {
      if (segment.kind === 'plain') {
        return { ...segment, step: 0 };
      }

      if (segment.kind === 'keyword' || lineStep === 0) {
        stepCount += 1;
        lineStep = stepCount;
      }

      return { ...segment, step: lineStep };
    });
  });

  return { lines, stepCount };
}

export const FLIP_SNIPPET = assignFlipSteps(SNIPPET_LINES);
