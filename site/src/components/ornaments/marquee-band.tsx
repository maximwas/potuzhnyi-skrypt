const toneClasses = {
  yellow: 'bg-yellow text-ink',
  ink: 'bg-ink text-yellow',
  blue: 'bg-blue text-paper',
  paper: 'bg-paper text-ink',
} as const;

// shortcut: 6 повторів покривають екран до ~4400 px для найкоротшої стрічки сайту; на ширших екранах з коротким списком слів лишиться пусто, тоді підняти число.
const WORD_REPEATS = 6;

interface MarqueeBandProps {
  readonly items: readonly string[];
  readonly tone?: keyof typeof toneClasses;
  readonly className?: string;
  readonly durationSeconds?: number;
}

// Бігуча стрічка зі слів. Слова повторюються в групі, щоб та була ширшою за екран,
// група дублюється, і зсув на -50% дає безшовний цикл. Тривалість рахуємо на один прохід слів.
export function MarqueeBand({
  items,
  tone = 'yellow',
  className = '',
  durationSeconds = 32,
}: MarqueeBandProps) {
  const group = (
    <span className="flex shrink-0 items-center">
      {Array.from({ length: WORD_REPEATS }, () => items)
        .flat()
        .map((item, position) => (
          <span key={`${position}-${item}`} className="flex shrink-0 items-center">
            <span className="px-5">{item}</span>
            <span aria-hidden="true" className="text-[0.7em]">
              ✶
            </span>
          </span>
        ))}
    </span>
  );

  return (
    <div
      aria-hidden="true"
      className={`border-ink overflow-hidden border-y-4 py-2 font-mono text-base font-bold tracking-wide whitespace-nowrap uppercase sm:text-lg ${toneClasses[tone]} ${className}`}
    >
      <div
        className="marquee flex w-max"
        style={
          { '--marquee-duration': `${durationSeconds * WORD_REPEATS}s` } as React.CSSProperties
        }
      >
        {group}
        {group}
      </div>
    </div>
  );
}
