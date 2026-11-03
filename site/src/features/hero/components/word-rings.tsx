import { useId } from 'react';

import { ZeMarkShapes } from '@/components/ui/ze-mark';

// Ширина знака моноширинного шрифту в em: рядок підганяється під довжину кола.
const GLYPH_WIDTH_EM = 0.6;

interface Ring {
  readonly radius: number;
  readonly text: string;
  readonly textClassName: string;
  readonly durationSeconds: number;
  readonly direction: 'normal' | 'reverse';
}

// Слова нейтральні: назви слів мови та гасла самого проєкту.
const RINGS: readonly Ring[] = [
  {
    radius: 178,
    text: 'Пиши потужно • Кожне слово має JS-пару • Файли .potuzhno • ',
    textClassName: 'fill-yellow',
    durationSeconds: 70,
    direction: 'normal',
  },
  {
    radius: 138,
    text: 'потужно → let • по_новому → new • перемога → true • партія → class • ',
    textClassName: 'fill-paper',
    durationSeconds: 52,
    direction: 'reverse',
  },
  {
    radius: 100,
    text: 'щоб → if • хто_не_чув → else • каденція → for • ',
    textClassName: 'fill-[#9BC4A0]',
    durationSeconds: 38,
    direction: 'normal',
  },
];

const LINE_RADII = [196, 158, 118, 80] as const;

interface WordRingsProps {
  readonly className?: string;
}

export function WordRings({ className = '' }: WordRingsProps) {
  const uid = useId().replaceAll(':', '');

  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden="true"
      focusable="false"
      className={`block aspect-square w-full ${className}`}
    >
      <defs>
        {RINGS.map((ring) => (
          <path
            key={ring.radius}
            id={`ring-${uid}-${ring.radius}`}
            d={`M ${200 - ring.radius} 200 a ${ring.radius} ${ring.radius} 0 1 1 ${2 * ring.radius} 0 a ${ring.radius} ${ring.radius} 0 1 1 ${-2 * ring.radius} 0`}
          />
        ))}
      </defs>
      <circle
        cx="200"
        cy="200"
        r="198"
        fill="none"
        className="stroke-yellow"
        strokeWidth="2"
        strokeDasharray="2 7"
        strokeLinecap="round"
      />
      {LINE_RADII.map((radius) => (
        <circle
          key={radius}
          cx="200"
          cy="200"
          r={radius}
          fill="none"
          className="stroke-yellow/35"
          strokeWidth="1.5"
        />
      ))}
      {RINGS.map((ring) => {
        const circumference = 2 * Math.PI * ring.radius;
        const fontSize = circumference / (GLYPH_WIDTH_EM * ring.text.length);

        return (
          <g
            key={ring.radius}
            className="ring-spin"
            style={
              {
                '--ring-duration': `${ring.durationSeconds}s`,
                '--ring-direction': ring.direction,
              } as React.CSSProperties
            }
          >
            <text
              className={`font-mono font-bold ${ring.textClassName}`}
              fontSize={fontSize.toFixed(2)}
              dominantBaseline="middle"
            >
              <textPath
                href={`#ring-${uid}-${ring.radius}`}
                textLength={circumference.toFixed(1)}
                lengthAdjust="spacing"
              >
                {ring.text}
              </textPath>
            </text>
          </g>
        );
      })}
      <svg x="142" y="142" width="116" height="116" viewBox="0 0 128 128">
        <ZeMarkShapes />
      </svg>
    </svg>
  );
}
