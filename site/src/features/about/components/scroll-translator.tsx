'use client';

import { useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import * as m from 'motion/react-m';
import { useRef, useState } from 'react';

import { CodePanel } from '@/features/about/components/code-panel';
import { FLIP_SNIPPET } from '@/features/about/lib/flip-snippet';
import { usePrefersReducedMotion } from '@/features/about/lib/use-prefers-reduced-motion';

// Перші й останні відсотки скролу порожні: код встигає з'явитися на екрані і лишається готовим перед тим, як панель відчепиться.
const SCROLL_START = 0.04;
const SCROLL_END = 0.88;

export function ScrollTranslator() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrolledSteps, setScrolledSteps] = useState(0);
  const isReduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  const stepProgress = useTransform(
    scrollYProgress,
    [SCROLL_START, SCROLL_END],
    [0, FLIP_SNIPPET.stepCount],
    { clamp: true },
  );

  useMotionValueEvent(stepProgress, 'change', (value) => {
    setScrolledSteps(Math.ceil(value));
  });

  const translatedSteps = isReduced ? FLIP_SNIPPET.stepCount : scrolledSteps;

  return (
    <div ref={trackRef} className="relative h-[250svh] motion-reduce:h-auto">
      <div className="sticky top-0 flex h-svh flex-col justify-center px-4 pt-24 pb-6 sm:px-6 motion-reduce:static motion-reduce:h-auto motion-reduce:py-20">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)] gap-4 sm:gap-6">
          <p className="sticker bg-red text-paper w-fit -rotate-2 px-3 py-1 font-mono text-xs font-bold uppercase">
            01 · про мову
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <h2
              id="about-title"
              className="font-display text-ink text-[clamp(2rem,6.5vw,4.75rem)] leading-[0.95] font-black uppercase"
            >
              Що <span className="bg-ink text-yellow inline-block -rotate-2 px-3 py-1">це</span>
            </h2>
            <p className="sticker bg-paper rotate-1 px-3 py-1.5 font-mono text-xs font-bold sm:text-sm motion-reduce:hidden">
              Крути вниз: код перекладає сам себе
            </p>
          </div>

          <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-2 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-4">
            <CodePanel
              side="meme"
              label=".potuzhno"
              translatedSteps={translatedSteps}
              isReduced={isReduced}
            />
            <span
              aria-hidden="true"
              className="font-display text-ink text-center text-2xl leading-none font-black md:text-5xl"
            >
              <span className="md:hidden">↓</span>
              <span className="hidden md:inline">→</span>
            </span>
            <CodePanel
              side="js"
              label="JavaScript"
              translatedSteps={translatedSteps}
              isReduced={isReduced}
            />
          </div>

          <div
            aria-hidden="true"
            className="border-ink bg-paper h-3.5 overflow-hidden rounded-full border-[3px] motion-reduce:hidden"
          >
            <m.div className="bg-red h-full origin-left" style={{ scaleX: scrollYProgress }} />
          </div>
        </div>
      </div>
    </div>
  );
}
