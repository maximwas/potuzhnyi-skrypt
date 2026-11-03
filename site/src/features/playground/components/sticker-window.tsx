import type { ReactNode } from 'react';

const TONES = {
  deep: { bar: 'bg-blue text-paper', body: 'bg-deep text-paper' },
  ink: { bar: 'bg-paper text-ink', body: 'bg-ink text-paper' },
  terminal: { bar: 'bg-paper-2 text-ink', body: 'bg-ink text-paper' },
} as const;

interface StickerWindowProps {
  readonly title: string;
  readonly tone: keyof typeof TONES;
  readonly badge?: ReactNode;
  readonly children: ReactNode;
}

// Вікно-наліпка: товста рамка, жорстка тінь, смужка з трьома кружечками.
export function StickerWindow({ title, tone, badge, children }: StickerWindowProps) {
  return (
    <div className={`sticker min-w-0 overflow-hidden ${TONES[tone].body}`}>
      <div
        className={`border-ink flex items-center gap-3 border-b-[3px] px-3 py-2 ${TONES[tone].bar}`}
      >
        <span aria-hidden="true" className="flex shrink-0 gap-1.5">
          <span className="border-ink bg-red size-3 rounded-full border-2" />
          <span className="border-ink bg-yellow size-3 rounded-full border-2" />
          <span className="border-ink bg-green size-3 rounded-full border-2" />
        </span>
        <span className="min-w-0 truncate font-mono text-sm font-bold">{title}</span>
        {badge ? <span className="ml-auto shrink-0">{badge}</span> : null}
      </div>
      {children}
    </div>
  );
}
