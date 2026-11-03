import { Reveal } from '@/components/ui/reveal';

import { getDictionaryData } from '../api/get-dictionary-data.ts';
import { formatWordCount } from '../lib/format-word-count.ts';
import { DictionaryBrowser } from './dictionary-browser.tsx';

export function DictionarySection() {
  const data = getDictionaryData();

  return (
    <section
      id="slovnyk"
      aria-labelledby="slovnyk-heading"
      className="halftone bg-paper text-ink scroll-mt-24 overflow-x-clip"
    >
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <Reveal>
          <span className="border-ink shadow-hard-sm bg-red text-paper inline-block -rotate-2 rounded-lg border-[3px] px-3 py-1 font-mono text-sm font-bold tracking-wider uppercase">
            03 · шпаргалка
          </span>
          <h2
            id="slovnyk-heading"
            className="font-display mt-5 text-[clamp(2.25rem,12vw,9rem)] leading-[0.95] font-black tracking-tight uppercase [overflow-wrap:anywhere] [text-shadow:5px_5px_0_var(--color-yellow)] sm:[text-shadow:8px_8px_0_var(--color-yellow)]"
          >
            Словник
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-semibold">
            <span className="bg-ink text-yellow inline-block rotate-1 rounded-md px-2 font-mono font-bold">
              {formatWordCount(data.entries.length)}
            </span>{' '}
            і кожне стає звичайним словом JavaScript. Шукай із будь-якого боку, а картку тицяй: вона
            перевернеться.
          </p>
        </Reveal>
        <DictionaryBrowser groups={data.groups} entries={data.entries} />
      </div>
    </section>
  );
}
