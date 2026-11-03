'use client';

import { useEffect, useState } from 'react';

import type { PlaygroundHighlighter } from './create-playground-highlighter.ts';

// null, поки Shiki вантажиться; помилка завантаження лишає сторінку на простому тексті.
export function usePlaygroundHighlighter(): PlaygroundHighlighter | null {
  const [highlighter, setHighlighter] = useState<PlaygroundHighlighter | null>(null);

  useEffect(() => {
    let cancelled = false;

    import('./create-playground-highlighter.ts')
      .then((module) => module.createPlaygroundHighlighter())
      .then((created) => {
        if (!cancelled) {
          setHighlighter(created);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  return highlighter;
}
