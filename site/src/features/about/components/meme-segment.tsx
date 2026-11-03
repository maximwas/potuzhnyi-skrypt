import type { FlipSegment } from '@/features/about/lib/flip-snippet';

interface MemeSegmentProps {
  readonly segment: FlipSegment;
  readonly translatedSteps: number;
  readonly isReduced: boolean;
}

// Ліва панель: слово підсвічується, коли його переклад щойно з'явився справа, і тьмяніє, коли воно «використане».
export function MemeSegment({ segment, translatedSteps, isReduced }: MemeSegmentProps) {
  if (segment.step === 0) {
    return <span>{segment.meme}</span>;
  }

  if (segment.step === translatedSteps && !isReduced) {
    return <span className="bg-yellow text-ink rounded-sm">{segment.meme}</span>;
  }

  if (segment.step <= translatedSteps) {
    return <span className="text-paper/60">{segment.meme}</span>;
  }

  return (
    <span className={segment.kind === 'keyword' ? 'text-yellow font-bold' : undefined}>
      {segment.meme}
    </span>
  );
}
