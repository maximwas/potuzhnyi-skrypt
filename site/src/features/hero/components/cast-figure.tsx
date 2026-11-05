'use client';

import { backOut, type MotionValue, useTransform } from 'motion/react';
import * as m from 'motion/react-m';
import { type CSSProperties, useState } from 'react';

import { withBasePath } from '@/lib/with-base-path';

import { type CastMember, type Placement, SHOUTS } from '../data/cast.ts';

interface CastFigureProps {
  readonly member: CastMember;
  readonly progress: MotionValue<number>;
  readonly pointer: MotionValue<number>;
  readonly appearAt: number;
}

const ENTER_DISTANCE_PERCENT = { left: -120, right: 120, bottom: 0 } as const;

function getBubbleStyle(placement: Placement, breakpoint: 'mobile' | 'desktop') {
  const isOnRight = placement.bubbleSide === 'right';

  return {
    [`--lift-${breakpoint}`]: `${placement.bubbleLift}%`,
    [`--bubble-left-${breakpoint}`]: isOnRight ? `${placement.bubbleOffset}%` : 'auto',
    [`--bubble-right-${breakpoint}`]: isOnRight ? 'auto' : `${placement.bubbleOffset}%`,
    [`--tail-left-${breakpoint}`]: isOnRight ? '1.25rem' : 'auto',
    [`--tail-right-${breakpoint}`]: isOnRight ? 'auto' : '1.25rem',
    [`--origin-${breakpoint}`]: isOnRight ? 'bottom left' : 'bottom right',
  };
}

function getPlacementStyle(member: CastMember, zIndex: number): CSSProperties {
  const mobile = member.mobile ?? member.desktop;

  return {
    '--left-mobile': `${mobile.left}%`,
    '--height-mobile': `${mobile.height}%`,
    '--left-desktop': `${member.desktop.left}%`,
    '--height-desktop': `${member.desktop.height}%`,
    ...getBubbleStyle(mobile, 'mobile'),
    ...getBubbleStyle(member.desktop, 'desktop'),
    aspectRatio: `${member.width} / ${member.height}`,
    zIndex,
  } as CSSProperties;
}

export function CastFigure({ member, progress, pointer, appearAt }: CastFigureProps) {
  const [shoutIndex, setShoutIndex] = useState(member.firstShoutIndex);
  const shout = SHOUTS[shoutIndex] ?? SHOUTS[0];

  const opacity = useTransform(progress, [appearAt, appearAt + 0.03], [0, 1]);
  const enter = useTransform(progress, [appearAt, appearAt + 0.07], [1, 0], { ease: backOut });
  const enterX = useTransform(
    enter,
    (value) => `${value * ENTER_DISTANCE_PERCENT[member.enterFrom]}%`,
  );
  const enterY = useTransform(
    enter,
    (value) => `${value * (member.enterFrom === 'bottom' ? 80 : 12)}%`,
  );
  const parallaxX = useTransform(
    pointer,
    [-0.5, 0.5],
    [member.parallaxPixels, -member.parallaxPixels],
  );
  const bubbleScale = useTransform(progress, [appearAt + 0.06, appearAt + 0.1], [0, 1], {
    ease: backOut,
  });

  const shoutAgain = () => {
    setShoutIndex((current) => {
      const next = Math.floor(Math.random() * (SHOUTS.length - 1));

      return next >= current ? next + 1 : next;
    });
  };

  const visibilityClassName = member.mobile ? '' : 'hidden xl:block';
  const boxClassName = `absolute bottom-0 left-(--left-mobile) h-(--height-mobile) -translate-x-1/2 xl:left-(--left-desktop) xl:h-(--height-desktop) ${visibilityClassName}`;

  return (
    <>
      <div className={boxClassName} style={getPlacementStyle(member, member.zIndex)}>
        <m.div style={{ x: parallaxX }} className="h-full w-full">
          <m.div style={{ opacity, x: enterX, y: enterY }} className="h-full w-full">
            <button
              type="button"
              onClick={shoutAgain}
              title="Натисни: нове слово"
              className="block h-full w-full origin-bottom cursor-pointer transition-transform duration-200 ease-out hover:scale-[1.03] focus-visible:scale-[1.03] active:scale-[0.99]"
            >
              <img
                src={withBasePath(`/scene/${member.id}.webp`)}
                alt={member.nameUk}
                width={member.width}
                height={member.height}
                decoding="async"
                draggable={false}
                className="pointer-events-none h-full w-full select-none [filter:drop-shadow(0_10px_0_rgb(0_0_0/0.45))]"
              />
            </button>
          </m.div>
        </m.div>
      </div>

      <div
        aria-live="polite"
        className={`pointer-events-none ${boxClassName}`}
        style={getPlacementStyle(member, 30)}
      >
        <m.div style={{ x: parallaxX }} className="h-full w-full">
          <m.div style={{ opacity, x: enterX, y: enterY }} className="relative h-full w-full">
            <m.div
              style={{ scale: bubbleScale }}
              className="absolute bottom-(--lift-mobile) left-(--bubble-left-mobile) origin-(--origin-mobile) right-(--bubble-right-mobile) xl:bottom-(--lift-desktop) xl:left-(--bubble-left-desktop) xl:origin-(--origin-desktop) xl:right-(--bubble-right-desktop)"
            >
              <m.div
                key={shout.word}
                initial={{ scale: 0.5, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 520, damping: 14 }}
              >
                <div
                  className="shout border-ink bg-paper text-ink relative min-w-[8.25rem] rounded-2xl border-[3px] px-3 py-1.5 text-center whitespace-nowrap shadow-[4px_4px_0_#000] xl:min-w-[13.75rem]"
                  style={{ '--tilt': `${member.bubbleTiltDegrees}deg` } as CSSProperties}
                >
                  <span className="font-display block text-[0.7rem] leading-none font-black xl:text-base">
                    {shout.word}
                  </span>
                  <span className="text-blue block font-mono text-[0.55rem] leading-tight font-bold xl:text-xs">
                    = {shout.jsWord}
                  </span>
                  <span
                    aria-hidden="true"
                    className="border-ink bg-paper absolute -bottom-[11px] left-(--tail-left-mobile) h-4 w-4 rotate-45 border-r-[3px] border-b-[3px] right-(--tail-right-mobile) xl:left-(--tail-left-desktop) xl:right-(--tail-right-desktop)"
                  />
                </div>
              </m.div>
            </m.div>
          </m.div>
        </m.div>
      </div>
    </>
  );
}
