import { JavaScriptSegment } from '@/features/about/components/javascript-segment';
import { MemeSegment } from '@/features/about/components/meme-segment';
import { FLIP_SNIPPET } from '@/features/about/lib/flip-snippet';

interface CodePanelProps {
  readonly side: 'meme' | 'js';
  readonly label: string;
  readonly translatedSteps: number;
  readonly isReduced: boolean;
}

const dotClass = 'h-2.5 w-2.5 rounded-full border-2 border-ink';

export function CodePanel({ side, label, translatedSteps, isReduced }: CodePanelProps) {
  return (
    <figure
      className={`sticker text-paper m-0 min-w-0 overflow-hidden ${side === 'meme' ? 'bg-deep' : 'bg-ink'}`}
    >
      <figcaption className="border-ink bg-paper text-ink flex items-center gap-2 border-b-[3px] px-3 py-1.5 font-mono text-xs font-bold sm:text-sm">
        <span aria-hidden="true" className="flex gap-1">
          <span className={`${dotClass} bg-red`} />
          <span className={`${dotClass} bg-yellow`} />
          <span className={`${dotClass} bg-green`} />
        </span>
        {label}
        {side === 'js' ? (
          <span aria-hidden="true" className="bg-ink text-yellow ml-auto rounded px-1.5">
            {translatedSteps}/{FLIP_SNIPPET.stepCount}
          </span>
        ) : null}
      </figcaption>
      <pre
        tabIndex={0}
        data-lenis-prevent
        aria-label={`Код: ${label}`}
        className="m-0 max-h-[30svh] overflow-auto p-3 font-mono text-[11.5px] leading-[1.5] whitespace-pre [font-variant-ligatures:none] sm:p-4 sm:text-[13px] md:max-h-none lg:text-[15px]"
      >
        <code>
          {FLIP_SNIPPET.lines.map((line, lineIndex) => (
            <span key={lineIndex} className="block">
              {line.map((segment, segmentIndex) =>
                side === 'meme' ? (
                  <MemeSegment
                    key={segmentIndex}
                    segment={segment}
                    translatedSteps={translatedSteps}
                    isReduced={isReduced}
                  />
                ) : (
                  <JavaScriptSegment
                    key={segmentIndex}
                    segment={segment}
                    translatedSteps={translatedSteps}
                    isReduced={isReduced}
                  />
                ),
              )}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
