import type { RunState } from '../lib/use-script-run.ts';
import { StickerWindow } from './sticker-window.tsx';

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

// Термінал: рядки виводу, а в кінці курсор, що блимає (клас caret, лише коли анімації дозволені).
export function RunPanel({ state }: RunPanelProps) {
  const lines = state.status === 'done' ? state.report.lines : [];
  const outcome = describeOutcome(state);

  return (
    <StickerWindow title="термінал: вивід програми" tone="terminal">
      <div
        data-lenis-prevent
        role="log"
        aria-live="polite"
        aria-label="Вивід програми"
        className="max-h-60 min-h-24 min-w-0 overflow-auto p-4 font-mono text-sm leading-6"
      >
        {outcome === null ? (
          <p className="text-[#A9B8D4]">
            Натисни «Запустити»: тут з’явиться те, що виведе програма.
          </p>
        ) : null}
        {lines.map((line, index) => (
          <p key={index} className={`${LEVEL_CLASSES[line.level]} break-words whitespace-pre-wrap`}>
            <span aria-hidden="true" className="text-yellow select-none">
              ${' '}
            </span>
            {line.text}
          </p>
        ))}
        {outcome !== null ? <p className="mt-1 text-[#A9B8D4]">{outcome}</p> : null}
        <p aria-hidden="true" className="text-yellow">
          $<span className="caret ml-1">▌</span>
        </p>
      </div>
    </StickerWindow>
  );
}
