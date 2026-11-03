'use client';

import { useReducedMotion } from 'motion/react';
import { ReactLenis } from 'lenis/react';
import type { ReactNode } from 'react';

// Плавний скрол Lenis на весь документ; для prefers-reduced-motion лишається рідний скрол.
// anchors: посилання #sprobuj тощо теж їдуть плавно, а не стрибком.
export function SmoothScroll({ children }: { children: ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return children;
  }

  return (
    <ReactLenis root options={{ lerp: 0.09, anchors: { offset: -72 } }}>
      {children}
    </ReactLenis>
  );
}
