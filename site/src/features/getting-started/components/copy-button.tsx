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
        className="cursor-pointer rounded bg-yellow px-3 py-1 font-mono text-xs font-bold text-deep hover:bg-paper"
      >
        {labels[state]}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {state === 'idle' ? '' : labels[state]}
      </span>
    </>
  );
}
