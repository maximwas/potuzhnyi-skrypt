import type { Metadata } from 'next';
import Link from 'next/link';

import { PhotoCreditsList } from '@/features/credits/components/photo-credits-list';

export const metadata: Metadata = {
  title: 'Автори фото — ПотужнийСкрипт',
};

export default function CreditsPage() {
  return (
    <main className="halftone bg-paper min-h-screen px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="text-ink border-ink bg-yellow inline-flex min-h-11 items-center rounded-lg border-[3px] px-4 font-mono text-sm font-bold shadow-[4px_4px_0_var(--color-ink)] transition-[transform,box-shadow] duration-100 hover:translate-x-px hover:translate-y-px hover:shadow-[3px_3px_0_var(--color-ink)] active:translate-x-1 active:translate-y-1 active:shadow-none motion-reduce:transition-none"
        >
          ← на головну
        </Link>

        <h1 className="font-display text-ink mt-10 text-[clamp(2.25rem,8vw,5rem)] leading-[0.95] font-black uppercase">
          Автори <span className="bg-ink text-yellow inline-block -rotate-2 px-3 py-1">фото</span>
        </h1>
        <p className="text-ink mt-6 max-w-2xl text-lg">
          Фото на сайті змінено: людей вирізано з фону, кадри обрізано й стиснуто.
        </p>

        <div className="mt-10">
          <PhotoCreditsList />
        </div>

        <section aria-labelledby="licenses-title" className="mt-12 max-w-3xl">
          <h2 id="licenses-title" className="font-display text-ink text-xl font-black uppercase">
            Ліцензії
          </h2>
          <p className="text-ink mt-3 leading-relaxed">
            Фотографії взято з Wikimedia Commons за ліцензіями CC BY, CC BY-SA 4.0, CC0 або як
            суспільне надбання, як указано біля кожного фото. Файли CC BY-SA лишаються CC BY-SA і
            після зменшення та стиснення. Ці ліцензії не поширюються на код ПотужногоСкрипта.
          </p>
        </section>
      </div>
    </main>
  );
}
