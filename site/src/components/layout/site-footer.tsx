import { PhotoCreditsList } from '@/features/credits/components/photo-credits-list';

export function SiteFooter() {
  return (
    <footer id="credits" className="bg-deep text-paper">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="font-mono text-2xl text-yellow">ПотужнийСкрипт</p>
        <p className="mt-2 max-w-2xl font-serif text-lg">
          JavaScript з мемними словами: пишеш у файлі <code className="font-mono">.potuzhno</code>,
          отримуєш звичайний JS.
        </p>

        <section aria-labelledby="disclaimer-title" className="mt-12 max-w-3xl">
          <h3 id="disclaimer-title" className="font-mono text-base text-yellow">
            Застереження
          </h3>
          <p className="mt-3 font-serif leading-relaxed">
            Це сатира й пародія на публічні меми про мову. Вона нікого ні в чому не звинувачує: збіг
            слів із подіями чи людьми — це жарт про слова, а не твердження про факти. Проєкт ні з
            ким не афілійований і нічиєї думки не представляє.
          </p>
        </section>

        <section aria-labelledby="photos-title" className="mt-12">
          <h3 id="photos-title" className="font-mono text-base text-yellow">
            Фото
          </h3>
          <div className="mt-4">
            <PhotoCreditsList />
          </div>
        </section>

        <section aria-labelledby="licenses-title" className="mt-12 max-w-3xl">
          <h3 id="licenses-title" className="font-mono text-base text-yellow">
            Ліцензії
          </h3>
          <p className="mt-3 font-serif leading-relaxed">
            Фотографії взято з Wikimedia Commons за ліцензіями CC BY, CC BY-SA 4.0, CC0 або як
            суспільне надбання, як указано біля кожного фото. Файли CC BY-SA лишаються CC BY-SA і
            після зменшення та стиснення. Ці ліцензії не поширюються на код ПотужногоСкрипта.
          </p>
        </section>

        <p className="mt-12 max-w-3xl border-t border-paper/30 pt-6 font-serif text-sm leading-relaxed">
          Це хобі-проєкт без комерційного використання.
        </p>
      </div>
    </footer>
  );
}
