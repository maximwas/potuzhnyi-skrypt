import { Reveal } from '@/components/ui/reveal';

import { PlaygroundWorkbench } from './playground-workbench.tsx';

const STICKER =
  'border-ink shadow-hard-sm inline-block rounded-lg border-[3px] px-3 py-1 font-mono text-sm font-bold tracking-wider uppercase';

export function PlaygroundSection() {
  return (
    <section
      id="sprobuj"
      aria-labelledby="sprobuj-heading"
      className="bg-yellow text-ink scroll-mt-24 overflow-x-clip"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <Reveal>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <span className={`${STICKER} bg-red text-paper -rotate-2`}>02 · пісочниця</span>
            <span className={`${STICKER} bg-paper text-ink rotate-2`}>без реєстрації й СМС</span>
          </div>
          <h2
            id="sprobuj-heading"
            className="font-display mt-5 text-[clamp(2.25rem,11vw,7rem)] leading-[0.95] font-black tracking-tight uppercase"
          >
            <span className="block">Пиши</span>
            <span className="bg-ink text-yellow mt-1 inline-block -rotate-1 px-[0.15em] py-[0.05em]">
              потужно
            </span>
          </h2>
          <p className="mt-6 max-w-xl text-lg font-semibold">
            Пиши мемами ліворуч: праворуч одразу звичайний JavaScript. Тисни «Запустити» і дивись,
            що вийшло.
          </p>
        </Reveal>
        <PlaygroundWorkbench />
      </div>
    </section>
  );
}
