import { useId } from 'react';

interface PetrykivkaPatternProps {
  readonly className?: string;
}

export function PetrykivkaPattern({ className = '' }: PetrykivkaPatternProps) {
  const uid = useId().replaceAll(':', '');
  const petalId = `petryk-petal-${uid}`;
  const flowerId = `petryk-flower-${uid}`;
  const patternId = `petryk-${uid}`;

  return (
    <svg
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden text-blue [--accent:var(--color-red)] [--leaf:var(--color-green)] [--ground:var(--color-paper-2)] ${className}`}
    >
      <defs>
        <g id={flowerId}>
          <g fill="currentColor">
            <path id={petalId} d="M0-4C-9-14-8-28 0-33C8-28 9-14 0-4Z" />
            <use href={`#${petalId}`} transform="rotate(72)" />
            <use href={`#${petalId}`} transform="rotate(144)" />
            <use href={`#${petalId}`} transform="rotate(216)" />
            <use href={`#${petalId}`} transform="rotate(288)" />
          </g>
          <circle r="5.5" fill="var(--accent,currentColor)" />
          <circle r="2" fill="var(--ground,#EDE3CC)" />
        </g>
        <pattern id={patternId} width="120" height="120" patternUnits="userSpaceOnUse">
          <g opacity=".16">
            <use href={`#${flowerId}`} x="30" y="30" />
            <use href={`#${flowerId}`} transform="translate(90 90) scale(.7)" />
            <path
              d="M30 64c0 14 16 16 16 28M90 56c0-14-16-16-16-28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <g fill="var(--accent,currentColor)">
              <circle cx="90" cy="30" r="3" />
              <circle cx="96" cy="26" r="3" />
              <circle cx="30" cy="92" r="3" />
              <circle cx="24" cy="96" r="3" />
            </g>
            <g fill="var(--leaf,currentColor)">
              <path d="M46 92c4-8 12-8 16-4-4 8-12 8-16 4ZM74 28c-4 8-12 8-16 4 4-8 12-8 16-4Z" />
            </g>
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
