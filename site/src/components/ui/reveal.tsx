'use client';

import * as m from 'motion/react-m';
import type { ReactNode } from 'react';

interface RevealProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly delay?: number;
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
