import { ZeMark } from '@/components/ui/ze-mark';

const NAV_LINKS = [
  { href: '#pro', label: 'Що це' },
  { href: '#slovnyk', label: 'Словник' },
  { href: '#start', label: 'Старт' },
] as const;

export function SiteHeader() {
  return (
    <header className="bg-deep border-yellow fixed inset-x-0 top-[env(safe-area-inset-top,0px)] z-50 border-b-4">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 px-4 py-1 sm:px-6">
        <a
          href="#top"
          className="font-display text-yellow flex min-h-11 items-center gap-2 text-base font-black uppercase sm:text-lg"
        >
          <ZeMark className="size-9 shrink-0" />
          ПотужнийСкрипт
        </a>
        <nav aria-label="Розділи сторінки">
          <ul className="flex flex-wrap items-center gap-x-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-paper hover:text-yellow flex min-h-11 items-center px-2 font-mono text-sm font-bold underline-offset-4 hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#sprobuj"
                className="bg-yellow text-ink border-ink ml-1 flex min-h-9 items-center rounded-lg border-2 px-3 font-mono text-sm font-bold shadow-[3px_3px_0_#000] transition-transform hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_#000]"
              >
                Спробуй
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
