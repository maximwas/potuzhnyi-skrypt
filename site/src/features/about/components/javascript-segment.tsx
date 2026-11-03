'use client';

import * as m from 'motion/react-m';

import type { FlipSegment } from '@/features/about/lib/flip-snippet';

interface JavaScriptSegmentProps {
  readonly segment: FlipSegment;
  readonly translatedSteps: number;
  readonly isReduced: boolean;
}

const KEYWORD_COLOR = '#ffd700';
const NAME_COLOR = '#f6efdf';
const POP_FROM = { scale: 1.6, rotate: -6, backgroundColor: '#ffd700', color: '#16181d' };
const POP_TRANSITION = {
  scale: { type: 'spring', stiffness: 520, damping: 14 },
  rotate: { type: 'spring', stiffness: 520, damping: 14 },
  backgroundColor: { duration: 0.7 },
  color: { duration: 0.7 },
} as const;

// Права панель: поки черга не дійшла, стоїть тьмяне мемне слово; коли дійшла, воно перемикається на JS із «поп» і жовтим спалахом.
// Спалахує лише слово останнього кроку: при стрибку скролу решта з'являється одразу, без хаосу.
export function JavaScriptSegment({ segment, translatedSteps, isReduced }: JavaScriptSegmentProps) {
  if (segment.step === 0) {
    return <span>{segment.js}</span>;
  }

  if (segment.step > translatedSteps) {
    return <span className="text-paper/60">{segment.meme}</span>;
  }

  const isJustTranslated = segment.step === translatedSteps && !isReduced;

  return (
    <m.span
      className="inline-block rounded-sm"
      style={{ fontWeight: segment.kind === 'keyword' ? 700 : 400 }}
      initial={isJustTranslated ? POP_FROM : false}
      animate={{
        scale: 1,
        rotate: 0,
        backgroundColor: 'rgba(255, 215, 0, 0)',
        color: segment.kind === 'keyword' ? KEYWORD_COLOR : NAME_COLOR,
      }}
      transition={POP_TRANSITION}
    >
      {segment.js}
    </m.span>
  );
}
