import type { RunState } from '../lib/use-script-run.ts';

const LEVEL_CLASSES = {
  log: 'text-paper',
  warn: 'text-yellow',
  error: 'text-[#FF9A8F]',
} as const;

interface RunPanelProps {
  readonly state: RunState;
}

function describeOutcome(state: RunState): string | null {
  if (state.status === 'running') {
    return 'Виконується…';
  }

  if (state.status === 'idle') {
    return null;
  }

  const { outcome, errorMessage, truncated } = state.report;
  const suffix = truncated ? ' Вивід обрізано до 1000 рядків.' : '';

  if (outcome === 'timeout') {
    return `Зупинено через 2 с: схоже на нескінченний цикл.${suffix}`;
  }

  if (outcome === 'failed') {
    return `Помилка: ${errorMessage}${suffix}`;
  }

  return `Готово.${suffix}`;
}

export function RunPanel({ state }: RunPanelProps) {
  const lines = state.status === 'done' ? state.report.lines : [];
  const outcome = describeOutcome(state);

  return (
    <div
      role="log"
      aria-live="polite"
      aria-label="Вивід програми"
      className="bg-deep text-paper max-h-60 min-h-20 min-w-0 overflow-auto rounded-md p-4 font-mono text-sm leading-6"
    >
      {outcome === null ? (
        <p className="text-[#A9B8D4]">Натисни «Запустити»: тут з’явиться те, що виведе програма.</p>
      ) : null}
      {lines.map((line, index) => (
        <p key={index} className={`${LEVEL_CLASSES[line.level]} break-words whitespace-pre-wrap`}>
          {line.text}
        </p>
      ))}
      {outcome !== null ? <p className="text-[#A9B8D4] mt-1">{outcome}</p> : null}
    </div>
  );
}
