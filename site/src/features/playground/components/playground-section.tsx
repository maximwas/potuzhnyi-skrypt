import { PlaygroundWorkbench } from './playground-workbench.tsx';

export function PlaygroundSection() {
  return (
    <section id="sprobuj" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="font-serif text-4xl font-bold">Спробуй</h2>
      <p className="text-muted mt-3 max-w-prose">
        Пиши ПотужнийСкрипт ліворуч: праворуч одразу з’являється звичайний JavaScript. Натисни
        «Запустити», щоб виконати його просто тут.
      </p>
      <PlaygroundWorkbench />
    </section>
  );
}
