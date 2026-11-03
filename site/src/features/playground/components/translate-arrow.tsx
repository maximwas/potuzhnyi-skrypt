'use client';

import * as m from 'motion/react-m';

interface TranslateArrowProps {
  // Лічильник перекладів: кожна зміна перемонтовує стрілку й запускає пульс.
  readonly pulse: number;
}

export function TranslateArrow({ pulse }: TranslateArrowProps) {
  return (
    <div aria-hidden="true" className="relative flex items-center justify-center py-1">
      <m.span
        key={`ring-${pulse}`}
        initial={pulse === 0 ? { opacity: 0 } : { scale: 1, opacity: 0.9 }}
        animate={{ scale: 1.9, opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="border-ink absolute size-14 rounded-full border-[3px]"
      />
      <m.span
        key={`arrow-${pulse}`}
        initial={pulse === 0 ? false : { scale: 1.4, rotate: -14 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 520, damping: 11 }}
        className="border-ink bg-ink text-yellow relative grid size-14 place-items-center rounded-full border-[3px] shadow-[4px_4px_0_var(--color-paper)]"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-8 rotate-90 min-[900px]:rotate-0"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="square"
        >
          <path d="M3 12h16M13 5l7 7-7 7" />
        </svg>
      </m.span>
    </div>
  );
}
