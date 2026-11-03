'use client';

import * as m from 'motion/react-m';
import { useState } from 'react';

import type { DictionaryEntry } from '../types.ts';

const FRONT_TONES = [
  'bg-paper text-ink',
  'bg-yellow text-ink',
  'bg-blue text-paper',
  'bg-green text-paper',
] as const;

const FACE =
  'border-ink shadow-hard-sm absolute inset-0 flex flex-col rounded-xl border-[3px] p-3 [backface-visibility:hidden]';

const REST = { rotate: 0, scale: 1 };
const WOBBLE = { rotate: [0, -6, 6, -4, 4, 0], scale: [1, 1.07, 1.07, 1.04, 1.04, 1] };

interface WordCardProps {
  readonly entry: DictionaryEntry;
  readonly groupLabel: string;
  // Картку обрала кнопка «Випадкове слово»: вона труситься й лишається перевернутою.
  readonly spotlight: boolean;
}

// Колір лицьового боку залежить від слова, тож не «стрибає» при фільтрах.
function pickTone(meme: string): string {
  let sum = 0;

  for (const character of meme) {
    sum += character.codePointAt(0) ?? 0;
  }

  return FRONT_TONES[sum % FRONT_TONES.length];
}

function pickSize(word: string): string {
  if (word.length <= 2) {
    return 'text-5xl';
  }

  if (word.length <= 10) {
    return 'text-2xl';
  }

  return word.length <= 18 ? 'text-lg' : 'text-sm';
}

// Уся картка — одна кнопка: мемне слово спереду, JavaScript-слово ззаду. Мишка перевертає
// наведенням, дотик і клавіатура (Enter, пробіл) перемикають.
export function WordCard({ entry, groupLabel, spotlight }: WordCardProps) {
  const [flipped, setFlipped] = useState(false);
  const showBack = flipped || spotlight;
  const label = `${entry.meme}, у JavaScript: ${entry.javascript}${entry.gloss === undefined ? '' : ` (${entry.gloss})`}`;

  return (
    <m.div
      animate={spotlight ? WOBBLE : REST}
      transition={{ duration: 0.8 }}
      whileTap={{ scale: 0.97 }}
    >
      <button
        type="button"
        aria-pressed={showBack}
        aria-label={label}
        data-flipped={showBack}
        onClick={() => setFlipped(!flipped)}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse') {
            setFlipped(false);
          }
        }}
        className="group focus-visible:outline-blue block h-36 w-full cursor-pointer text-left [perspective:900px] focus-visible:outline-4 focus-visible:outline-offset-4"
      >
        <span className="relative block size-full transition-transform duration-500 ease-[cubic-bezier(0.3,1.35,0.5,1)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-data-[flipped=true]:[transform:rotateY(180deg)] motion-reduce:transition-none">
          <span aria-hidden="true" className={`${FACE} ${pickTone(entry.meme)}`}>
            <span className="flex items-start justify-between gap-2 font-mono text-xs font-bold tracking-wider uppercase">
              <span>{groupLabel}</span>
              <span className="text-base leading-none">↻</span>
            </span>
            <span
              className={`${pickSize(entry.meme)} my-auto font-mono leading-tight font-extrabold break-all`}
            >
              {entry.meme}
            </span>
          </span>
          <span
            aria-hidden="true"
            className={`${FACE} bg-ink text-yellow [transform:rotateY(180deg)]`}
          >
            <span className="text-paper font-mono text-xs font-bold tracking-wider uppercase">
              у JavaScript
            </span>
            <span
              className={`${pickSize(entry.javascript)} my-auto font-mono leading-tight font-extrabold break-all`}
            >
              {entry.javascript}
            </span>
            {entry.gloss === undefined ? null : (
              <span className="text-paper font-mono text-xs font-bold">{entry.gloss}</span>
            )}
          </span>
        </span>
      </button>
    </m.div>
  );
}
