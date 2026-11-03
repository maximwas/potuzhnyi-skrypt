'use client';

import { useEffect, useRef, useState } from 'react';

interface CopyButtonProps {
  readonly text: string;
}

type CopyState = 'idle' | 'copied' | 'failed';

const labels: Record<CopyState, string> = {
  idle: 'Копіювати',
  copied: 'Скопійовано',
  failed: 'Не вдалося, виділіть вручну',
};

const tones: Record<CopyState, string> = {
  idle: 'bg-yellow text-ink',
  copied: 'bg-green text-paper',
  failed: 'bg-red text-paper',
};

export function CopyButton({ text }: CopyButtonProps) {
  const [state, setState] = useState<CopyState>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState('copied');
    } catch {
      setState('failed');
    }

    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 2500);
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className={`border-ink cursor-pointer rounded-md border-2 px-3 py-1 font-mono text-xs font-bold shadow-[3px_3px_0_var(--color-ink)] transition-[transform,box-shadow] duration-100 hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_var(--color-ink)] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none motion-reduce:transition-none ${tones[state]}`}
      >
        {labels[state]}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === 'idle' ? '' : labels[state]}
      </span>
    </>
  );
}
