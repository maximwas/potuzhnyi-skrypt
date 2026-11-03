import { useId } from 'react';

const toneClasses = {
  light: 'text-blue [--accent:var(--color-red)] [--leaf:var(--color-green)]',
  dark: 'text-yellow [--accent:var(--color-paper)] [--leaf:#9BC4A0]',
} as const;

interface TowelDividerProps {
  readonly className?: string;
  readonly tone?: keyof typeof toneClasses;
}

export function TowelDivider({ className = '', tone = 'light' }: TowelDividerProps) {
  const patternId = `towel-${useId().replaceAll(':', '')}`;

  return (
    <svg
      width="100%"
      height="68"
      aria-hidden="true"
      focusable="false"
      className={`block max-w-full overflow-hidden ${toneClasses[tone]} ${className}`}
    >
      <defs>
        <pattern
          id={patternId}
          width="20"
          height="17"
          patternUnits="userSpaceOnUse"
          patternTransform="scale(4)"
        >
          <path fill="currentColor" d="M0 0h20v1H0zM0 16h20v1H0zM1 7h1v3H1zM0 8h3v1H0z" />
          <g transform="translate(5 2)">
            <path
              fill="currentColor"
              d="M5 0h3v1h-3zM5 1h1v1h-1zM7 1h1v1h-1zM4 2h1v1h-1zM8 2h1v1h-1zM3 3h1v1h-1zM9 3h1v1h-1zM2 4h1v1h-1zM10 4h1v1h-1zM0 5h2v1h-2zM11 5h2v1h-2zM0 6h1v1h-1zM12 6h1v1h-1zM0 7h2v1h-2zM11 7h2v1h-2zM2 8h1v1h-1zM10 8h1v1h-1zM3 9h1v1h-1zM9 9h1v1h-1zM4 10h1v1h-1zM8 10h1v1h-1zM5 11h1v1h-1zM7 11h1v1h-1zM5 12h3v1h-3z"
            />
            <path
              fill="var(--accent,currentColor)"
              d="M6 3h1v1h-1zM5 4h1v1h-1zM7 4h1v1h-1zM4 5h1v1h-1zM6 5h1v1h-1zM8 5h1v1h-1zM3 6h1v1h-1zM5 6h1v1h-1zM6 6h1v1h-1zM7 6h1v1h-1zM9 6h1v1h-1zM4 7h1v1h-1zM6 7h1v1h-1zM8 7h1v1h-1zM5 8h1v1h-1zM7 8h1v1h-1zM6 9h1v1h-1z"
            />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
