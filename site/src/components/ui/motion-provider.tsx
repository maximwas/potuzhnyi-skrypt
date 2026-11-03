'use client';

import { domAnimation, LazyMotion, MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

// Один раз на сторінку: легка збірка Motion (m + domAnimation) і повага до prefers-reduced-motion.
// strict забороняє випадково підтягнути повний motion.* замість m.*
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
