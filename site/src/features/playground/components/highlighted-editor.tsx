'use client';

import { type ChangeEvent, type UIEvent, useRef } from 'react';

import { EDITOR_TYPOGRAPHY, SHIKI_RESET } from '../lib/editor-typography.ts';

interface HighlightedEditorProps {
  readonly value: string;
  readonly html: string;
  readonly onChange: (value: string) => void;
}

// Прозорий textarea поверх шару з підсвіченим HTML: однакові метрики, спільний скрол.
export function HighlightedEditor({ value, html, onChange }: HighlightedEditorProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  const syncScroll = (event: UIEvent<HTMLTextAreaElement>) => {
    if (layerRef.current) {
      layerRef.current.scrollTop = event.currentTarget.scrollTop;
      layerRef.current.scrollLeft = event.currentTarget.scrollLeft;
    }
  };

  return (
    <div className="bg-deep text-paper focus-within:outline-yellow relative h-72 min-w-0 overflow-hidden rounded-md focus-within:outline-3 focus-within:outline-offset-2 md:h-96">
      <div
        ref={layerRef}
        aria-hidden="true"
        className={`${EDITOR_TYPOGRAPHY} ${SHIKI_RESET} pointer-events-none absolute inset-0 overflow-hidden`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <textarea
        aria-label="Код .potuzhno"
        value={value}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
        onScroll={syncScroll}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        wrap="off"
        className={`${EDITOR_TYPOGRAPHY} caret-yellow selection:bg-blue/70 absolute inset-0 h-full w-full resize-none overflow-auto bg-transparent text-transparent outline-none`}
      />
    </div>
  );
}
