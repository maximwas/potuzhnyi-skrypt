import { getDictionaryData } from '../api/get-dictionary-data.ts';
import { formatWordCount } from '../lib/format-word-count.ts';
import { DictionaryBrowser } from './dictionary-browser.tsx';

export function DictionarySection() {
  const data = getDictionaryData();

  return (
    <section id="slovnyk" aria-labelledby="slovnyk-heading" className="scroll-mt-20 bg-paper py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2
          id="slovnyk-heading"
          className="font-serif text-4xl font-extrabold text-ink sm:text-5xl"
        >
          Словник
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          У словнику {formatWordCount(data.entries.length)}: кожне мемне слово стає звичайним словом
          JavaScript. Шукайте за будь-яким із двох боків.
        </p>
        <DictionaryBrowser groups={data.groups} entries={data.entries} />
      </div>
    </section>
  );
}
