'use client';

import { useReducedMotion, useScroll, useTransform } from 'motion/react';
import * as m from 'motion/react-m';
import type { ReactNode } from 'react';

interface ParallaxLayerProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly speed: number;
}

// Зсув униз повільніший за скрол: збирається в нижній відступ колажу, тож не обрізається смугою.
export function ParallaxLayer({ children, className, speed }: ParallaxLayerProps) {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const offsetY = useTransform(scrollY, [0, 700], [0, shouldReduceMotion ? 0 : speed]);

  return (
    <m.div className={className} style={{ y: offsetY }}>
      {children}
    </m.div>
  );
}
