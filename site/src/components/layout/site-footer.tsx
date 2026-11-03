import Link from 'next/link';

import { MarqueeBand } from '@/components/ornaments/marquee-band';

const MARQUEE_WORDS = ['потужно', 'батон', 'схема', 'партія', 'по_новому', 'перемога'] as const;

export function SiteFooter() {
  return (
    <footer className="bg-deep text-paper">
      <MarqueeBand items={MARQUEE_WORDS} tone="yellow" durationSeconds={28} />

      <div className="mx-auto max-w-6xl px-4 pt-16 pb-8 sm:px-6 sm:pt-24">
        <p className="font-display text-yellow text-[clamp(2.25rem,11vw,8rem)] leading-[0.92] font-black uppercase [text-shadow:5px_5px_0_var(--color-red)]">
          <span className="block">Потужний</span>
          <span className="block">Скрипт</span>
        </p>
        <p className="mt-6 max-w-2xl font-serif text-lg">
          JavaScript з мемними словами: пишеш у файлі <code className="font-mono">.potuzhno</code>,
          отримуєш звичайний JS.
        </p>

        <section
          aria-labelledby="disclaimer-title"
          className="border-yellow mt-12 max-w-3xl border-l-4 pl-5"
        >
          <h3
            id="disclaimer-title"
            className="font-display text-yellow text-lg font-black uppercase"
          >
            Застереження
          </h3>
          <p className="mt-3 font-serif leading-relaxed">
            Це сатира й пародія на публічні меми про мову. Вона нікого ні в чому не звинувачує: збіг
            слів із подіями чи людьми — це жарт про слова, а не твердження про факти. Слова в
            бульбашках на сцені — це ключові слова мови, а не цитати людей на фото. Проєкт ні з ким
            не афілійований і нічиєї думки не представляє.
          </p>
        </section>

        <div className="border-paper/30 mt-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t pt-6">
          <p className="max-w-3xl font-serif text-sm leading-relaxed">
            Це хобі-проєкт без комерційного використання.
          </p>
          <a
            href="#top"
            className="bg-yellow text-ink border-ink inline-flex min-h-11 items-center rounded-lg border-[3px] px-5 font-mono text-sm font-bold shadow-[4px_4px_0_var(--color-paper)] transition-[transform,box-shadow] duration-100 hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0_var(--color-paper)] active:translate-x-1 active:translate-y-1 active:shadow-none motion-reduce:transition-none"
          >
            Нагору ↑
          </a>
        </div>

        <p className="mt-8 text-xs">
          <Link
            href="/credits/"
            className="text-paper/60 hover:text-paper underline underline-offset-4"
          >
            Автори фото
          </Link>
        </p>
      </div>
    </footer>
  );
}
