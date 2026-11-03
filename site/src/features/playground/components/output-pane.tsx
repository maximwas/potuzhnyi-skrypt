'use client';

import { useEffect, useRef } from 'react';

import { EDITOR_TYPOGRAPHY, SHIKI_RESET } from '../lib/editor-typography.ts';
import { playTransform } from '../lib/play-transform.ts';
import type { OutputRange } from '../lib/transform-planner.ts';

export interface TransformPlayback {
  readonly token: number;
  readonly ranges: readonly OutputRange[];
}

interface OutputPaneProps {
  readonly html: string;
  readonly playback: TransformPlayback | null;
  readonly dimmed: boolean;
}

export function OutputPane({ html, playback, dimmed }: OutputPaneProps) {
  const paneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (playback && paneRef.current) {
      playTransform(paneRef.current, playback.ranges);
    }
  }, [playback]);

  return (
    <div
      ref={paneRef}
      data-lenis-prevent
      role="region"
      tabIndex={0}
      aria-label="Результат JavaScript"
      className={`${EDITOR_TYPOGRAPHY} ${SHIKI_RESET} text-paper focus-visible:outline-yellow h-72 min-w-0 overflow-auto focus-visible:outline-3 focus-visible:outline-offset-[-6px] md:h-96 ${dimmed ? 'opacity-60' : ''}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
