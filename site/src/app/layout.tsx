import type { Metadata } from 'next';
import { JetBrains_Mono, Literata, Unbounded } from 'next/font/google';
import type { ReactNode } from 'react';

import { MotionProvider } from '@/components/ui/motion-provider';
import { SmoothScroll } from '@/components/ui/smooth-scroll';

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

const display = Unbounded({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-unbounded',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ПотужнийСкрипт',
  description: 'JavaScript із мемними словами: пишіть файли .potuzhno, а виходить звичайний JS.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk" className={`${serif.variable} ${mono.variable} ${display.variable}`}>
      <body>
        <MotionProvider>
          <SmoothScroll>{children}</SmoothScroll>
        </MotionProvider>
      </body>
    </html>
  );
}
