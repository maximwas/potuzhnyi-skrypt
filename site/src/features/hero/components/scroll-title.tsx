'use client';

import { type MotionValue, useTransform } from 'motion/react';
import * as m from 'motion/react-m';

const LINES = ['Потужний', 'Скрипт'] as const;
const TOTAL_CHARACTERS = LINES.join('').length;

interface TypedCharacterProps {
  readonly character: string;
  readonly progress: MotionValue<number>;
  readonly start: number;
  readonly end: number;
}

function TypedCharacter({ character, progress, start, end }: TypedCharacterProps) {
  const opacity = useTransform(progress, [start, start + 0.002], [0, 1]);
  const caretOpacity = useTransform(
    progress,
    [start, start + 0.002, end, end + 0.002],
    [0, 1, 1, 0],
  );

  return (
    <span className="relative inline-block">
      <m.span style={{ opacity }}>{character}</m.span>
      <m.span
        aria-hidden="true"
        style={{ opacity: caretOpacity }}
        className="absolute top-[8%] left-full h-[84%]"
      >
        <span className="caret bg-paper block h-full w-[0.09em]" />
      </m.span>
    </span>
  );
}

interface ScrollTitleProps {
  readonly progress: MotionValue<number>;
  readonly from: number;
  readonly to: number;
}

// Заголовок пишеться літера за літерою, поки гортаєш: кожна літера має своє вікно прогресу.
export function ScrollTitle({ progress, from, to }: ScrollTitleProps) {
  const leadingCaretOpacity = useTransform(progress, [from - 0.002, from], [1, 0]);
  let index = 0;

  return (
    <h1
      id="hero-title"
      aria-label="ПотужнийСкрипт"
      className="font-display text-yellow flex flex-col items-center text-[clamp(2.2rem,10.6vw,3.4rem)] leading-[0.95] font-black tracking-tight uppercase [text-shadow:5px_5px_0_#000] sm:text-[clamp(3rem,7.4vw,6.5rem)] sm:[text-shadow:7px_7px_0_#000]"
    >
      {LINES.map((line, lineIndex) => (
        <span key={line} aria-hidden="true" className="relative block whitespace-nowrap">
          {lineIndex === 0 ? (
            <m.span
              style={{ opacity: leadingCaretOpacity }}
              className="absolute top-[8%] left-0 h-[84%]"
            >
              <span className="caret bg-paper block h-full w-[0.09em]" />
            </m.span>
          ) : null}
          {[...line].map((character) => {
            const position = index;

            index += 1;

            return (
              <TypedCharacter
                key={position}
                character={character}
                progress={progress}
                start={from + ((to - from) * position) / TOTAL_CHARACTERS}
                end={from + ((to - from) * (position + 1)) / TOTAL_CHARACTERS}
              />
            );
          })}
        </span>
      ))}
    </h1>
  );
}
