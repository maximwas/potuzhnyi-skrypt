import type { Metadata } from 'next';
import { JetBrains_Mono, Literata } from 'next/font/google';
import type { ReactNode } from 'react';

import { MotionProvider } from '@/components/ui/motion-provider';

import './globals.css';

const serif = Literata({
  subsets: ['cyrillic', 'latin'],
  axes: ['opsz'],
  variable: '--font-literata',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ПотужнийСкрипт',
  description: 'JavaScript із мемними словами: пишіть файли .potuzhno, а виходить звичайний JS.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk" className={`${serif.variable} ${mono.variable}`}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
