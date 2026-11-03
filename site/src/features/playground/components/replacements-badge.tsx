'use client';

import * as m from 'motion/react-m';

interface ReplacementsBadgeProps {
  readonly label: string;
  readonly failed: boolean;
}

// Бейдж «замін: N»: key = текст, тож кожна зміна числа перемонтовує його й він «вискакує».
export function ReplacementsBadge({ label, failed }: ReplacementsBadgeProps) {
  return (
    <m.span
      key={label}
      aria-hidden="true"
      initial={{ scale: 1.7, rotate: -12 }}
      animate={{ scale: 1, rotate: -3 }}
      transition={{ type: 'spring', stiffness: 600, damping: 12 }}
      className={`border-ink inline-block rounded-md border-2 px-2 py-0.5 font-mono text-xs font-bold ${failed ? 'bg-red text-paper' : 'bg-yellow text-ink'}`}
    >
      {label}
    </m.span>
  );
}
