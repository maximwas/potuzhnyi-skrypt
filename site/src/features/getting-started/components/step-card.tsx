import type { ReactNode } from 'react';

import { Reveal } from '@/components/ui/reveal';

interface StepCardProps {
  readonly number: string;
  readonly title: string;
  readonly tiltClassName: string;
  readonly children: ReactNode;
}

export function StepCard({ number, title, tiltClassName, children }: StepCardProps) {
  return (
    <li className="min-w-0">
      <Reveal className="grid grid-cols-[minmax(0,1fr)] items-start gap-3 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-8">
        <p
          aria-hidden="true"
          className={`font-display text-yellow text-[5rem] leading-none font-black select-none [paint-order:stroke_fill] [-webkit-text-stroke:10px_var(--color-ink)] md:text-[7rem] ${tiltClassName}`}
        >
          {number}
        </p>
        <article className="sticker bg-paper flex min-w-0 flex-col gap-4 p-5 sm:p-7">
          <h3 className="font-display text-ink text-2xl leading-tight font-black uppercase sm:text-3xl">
            {title}
          </h3>
          {children}
        </article>
      </Reveal>
    </li>
  );
}
