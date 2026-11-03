import { useId } from 'react';

const toneClasses = {
  light: 'text-blue [--accent:var(--color-red)] [--leaf:var(--color-green)]',
  dark: 'text-yellow [--accent:var(--color-paper)] [--leaf:#9BC4A0]',
} as const;

interface KalynaDividerProps {
  readonly className?: string;
  readonly tone?: keyof typeof toneClasses;
}

export function KalynaDivider({ className = '', tone = 'light' }: KalynaDividerProps) {
  const uid = useId().replaceAll(':', '');
  const leafId = `kalyna-leaf-${uid}`;
  const berriesId = `kalyna-berries-${uid}`;
  const patternId = `kalyna-${uid}`;

  return (
    <svg
      width="100%"
      height="90"
      aria-hidden="true"
      focusable="false"
      className={`block max-w-full overflow-hidden ${toneClasses[tone]} ${className}`}
    >
      <defs>
        <path id={leafId} d="M0 0L-9-6-6-9-12-15-4-14 0-22 4-14 12-15 6-9 9-6Z" />
        <g id={berriesId}>
          <circle cy="-9" r="4.6" />
          <circle cx="-8" cy="-3" r="4.6" />
          <circle cx="8" cy="-3" r="4.6" />
          <circle cx="-4" cy="5" r="4.6" />
          <circle cx="4" cy="5" r="4.6" />
          <circle cy="13" r="4.6" />
          <circle cy="2" r="4.6" />
        </g>
        <pattern id={patternId} width="200" height="90" patternUnits="userSpaceOnUse">
          <g transform="translate(0 7)">
            <path
              d="M0 38C34 28 66 28 100 38S166 48 200 38M50 31V18M150 45V58"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <g
              fill="var(--leaf,currentColor)"
              stroke="var(--leaf,currentColor)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            >
              <use href={`#${leafId}`} transform="translate(22 34) rotate(-62)" />
              <use href={`#${leafId}`} transform="translate(78 34) rotate(62)" />
              <use href={`#${leafId}`} transform="translate(122 42) rotate(118)" />
              <use href={`#${leafId}`} transform="translate(178 42) rotate(-118)" />
            </g>
            <g fill="var(--accent,currentColor)">
              <use href={`#${berriesId}`} x="50" y="11" />
              <use href={`#${berriesId}`} x="150" y="64" />
            </g>
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
