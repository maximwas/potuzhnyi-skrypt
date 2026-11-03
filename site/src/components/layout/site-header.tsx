const NAV_LINKS = [
  { href: '#pro', label: 'Що це' },
  { href: '#sprobuj', label: 'Спробуй' },
  { href: '#slovnyk', label: 'Словник' },
  { href: '#start', label: 'Старт' },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-[env(safe-area-inset-top,0px)] z-50 border-b-2 border-ink bg-paper">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 py-1 px-4 sm:px-6">
        <a
          href="#top"
          className="flex min-h-11 items-center gap-2 font-serif text-xl font-extrabold text-ink"
        >
          <span
            aria-hidden="true"
            className="inline-flex items-baseline rounded-md bg-green px-1.5 py-0.5 font-serif leading-none text-paper"
          >
            <span className="text-lg">З</span>
            <span className="text-xs">е</span>
          </span>
          ПотужнийСкрипт
        </a>
        <nav aria-label="Розділи сторінки">
          <ul className="flex flex-wrap gap-x-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="flex min-h-11 items-center px-2 font-mono text-sm font-semibold text-ink underline-offset-4 hover:text-blue hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
