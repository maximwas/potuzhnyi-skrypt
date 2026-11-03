'use client';

import {
  animate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import * as m from 'motion/react-m';
import { type PointerEvent, useEffect, useRef } from 'react';

import { MarqueeBand } from '@/components/ornaments/marquee-band';
import { withBasePath } from '@/lib/with-base-path';

import { CAST } from '../data/cast.ts';
import { CastFigure } from './cast-figure.tsx';
import { ScrollTitle } from './scroll-title.tsx';
import { WordRings } from './word-rings.tsx';

const TITLE_FROM = 0.04;
const TITLE_TO = 0.3;
const INTRO_PROGRESS = 0.085;
const CAST_FROM = 0.3;
const CAST_TO = 0.8;
const MARQUEE_ITEMS = [
  'потужно = let',
  'по_новому = new',
  'перемога = true',
  'партія = class',
  'щоб = if',
  'хто_не_чув = else',
] as const;

const BUTTON =
  'border-ink inline-flex min-h-11 items-center justify-center rounded-lg border-[3px] px-4 sm:min-h-12 sm:px-6 font-mono text-base font-bold shadow-[4px_4px_0_#000] transition-transform duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none';

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const finished = useMotionValue(1);
  // Перші літери друкуються самі при завантаженні, щоб екран не був порожнім до першого скролу.
  const intro = useMotionValue(0);
  const scrolledProgress = useTransform([scrollYProgress, intro], ([scrolled, typed]: number[]) =>
    Math.max(scrolled ?? 0, typed ?? 0),
  );
  const progress = shouldReduceMotion ? finished : scrolledProgress;

  useEffect(() => {
    const controls = animate(intro, INTRO_PROGRESS, { duration: 1.2, ease: 'linear', delay: 0.4 });

    return () => controls.stop();
  }, [intro]);

  const pointerTarget = useMotionValue(0);
  const pointer = useSpring(pointerTarget, { stiffness: 70, damping: 18 });

  const backdropScale = useTransform(progress, [0, 1], [1, 1.14]);
  const ringsScale = useTransform(progress, [0, 0.2], [0.85, 1]);
  const ringsOpacity = useTransform(progress, [0, 0.12], [0.45, 1]);
  const hintOpacity = useTransform(progress, [0, 0.04], [1, 0]);
  const ctaOpacity = useTransform(progress, [0.86, 0.94], [0, 1]);
  const ctaPointerEvents = useTransform(progress, (value) => (value > 0.9 ? 'auto' : 'none'));

  const trackPointer = (event: PointerEvent<HTMLDivElement>) => {
    pointerTarget.set(event.clientX / window.innerWidth - 0.5);
  };

  const castStep = (CAST_TO - CAST_FROM) / CAST.length;

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-labelledby="hero-title"
      className={`bg-deep relative ${shouldReduceMotion ? 'h-svh' : 'h-[460vh]'}`}
    >
      <div
        onPointerMove={trackPointer}
        className="sticky top-0 h-svh min-h-[560px] overflow-hidden"
      >
        <m.div style={{ scale: backdropScale }} className="absolute inset-0">
          <img
            src={withBasePath('/scene/kyiv-backdrop.webp')}
            alt=""
            width={1600}
            height={1093}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover opacity-45 mix-blend-luminosity"
          />
        </m.div>
        <div
          aria-hidden="true"
          className="from-deep/10 via-deep/40 to-deep absolute inset-0 bg-gradient-to-b"
        />

        <m.div
          style={{ scale: ringsScale, opacity: ringsOpacity }}
          className="absolute top-[58%] left-1/2 z-[5] sm:top-[64%] w-[min(88vw,58svh)] -translate-x-1/2 -translate-y-1/2"
        >
          <WordRings />
        </m.div>

        <div className="relative z-[20] flex justify-center px-4 pt-[7.5rem] sm:pt-28">
          <ScrollTitle progress={progress} from={TITLE_FROM} to={TITLE_TO} />
        </div>

        {CAST.map((member) => (
          <CastFigure
            key={member.id}
            member={member}
            progress={progress}
            pointer={pointer}
            appearAt={CAST_FROM + member.arrivalOrder * castStep}
          />
        ))}

        <m.div
          style={{ opacity: ctaOpacity, pointerEvents: ctaPointerEvents }}
          className="absolute bottom-16 left-1/2 z-[40] flex -translate-x-1/2 items-center gap-3 sm:bottom-20"
        >
          <a href="#sprobuj" className={`${BUTTON} bg-yellow text-ink`}>
            <span className="sm:hidden">Спробувати</span>
            <span className="hidden sm:inline">Спробувати в браузері</span>
          </a>
          <a href="#start" className={`${BUTTON} bg-paper text-ink`}>
            Як почати
          </a>
        </m.div>

        <m.p
          style={{ opacity: hintOpacity }}
          className="text-paper absolute bottom-16 left-1/2 z-[40] -translate-x-1/2 font-mono text-sm font-bold tracking-widest uppercase sm:bottom-20"
        >
          Крути вниз <span className="inline-block animate-bounce">↓</span>
        </m.p>

        <MarqueeBand
          items={MARQUEE_ITEMS}
          tone="yellow"
          durationSeconds={26}
          className="absolute inset-x-0 bottom-0 z-[45]"
        />
      </div>
    </section>
  );
}
