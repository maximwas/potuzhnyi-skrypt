'use client';

import { AnimatePresence, useReducedMotion } from 'motion/react';
import * as m from 'motion/react-m';
import { useEffect, useId, useMemo, useRef, useState } from 'react';

import { filterEntries } from '../lib/filter-entries.ts';
import { formatWordCount } from '../lib/format-word-count.ts';
import { getEntryKey } from '../lib/get-entry-key.ts';
import type { DictionaryEntry, DictionaryGroup } from '../types.ts';
import { WordCard } from './word-card.tsx';

const PAGE_SIZE = 48;

interface DictionaryBrowserProps {
  readonly groups: readonly DictionaryGroup[];
  readonly entries: readonly DictionaryEntry[];
}

// Кнопка-наліпка: тінь «втискається» при наведенні й натисканні.
const BUTTON =
  'border-ink shadow-hard-sm focus-visible:outline-blue min-h-11 cursor-pointer rounded-lg border-[3px] px-4 font-mono text-sm font-extrabold tracking-wide uppercase transition-[transform,box-shadow] duration-100 focus-visible:outline-3 focus-visible:outline-offset-4 enabled:hover:translate-x-0.5 enabled:hover:translate-y-0.5 enabled:hover:shadow-[2px_2px_0_var(--color-ink)] enabled:active:translate-x-1 enabled:active:translate-y-1 enabled:active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none';
const chipBase =
  'border-ink min-h-9 shrink-0 cursor-pointer rounded-lg border-[3px] px-3 py-1 font-mono text-sm font-bold transition-[translate,box-shadow,background-color] duration-100 motion-reduce:transition-none';
const chipIdle =
  'bg-paper text-ink hover:bg-yellow shadow-[3px_3px_0_var(--color-ink)] hover:-translate-y-0.5';
const chipActive = 'bg-ink text-yellow translate-x-[3px] translate-y-[3px] shadow-none';

export function DictionaryBrowser({ groups, entries }: DictionaryBrowserProps) {
  const searchId = useId();
  const listRef = useRef<HTMLUListElement>(null);
  const reducedMotion = useReducedMotion();
  const [query, setQuery] = useState('');
  const [groupId, setGroupId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [spotlightKey, setSpotlightKey] = useState<string | null>(null);

  const matches = useMemo(
    () => filterEntries(entries, { query, groupId }),
    [entries, query, groupId],
  );
  const groupLabels = useMemo(
    () => new Map(groups.map((group) => [group.id, group.label])),
    [groups],
  );
  const visible = matches.slice(0, visibleCount);

  // Прокрутка до обраної картки: нативний smooth-scroll, Lenis його не ламає.
  useEffect(() => {
    if (spotlightKey === null) {
      return;
    }

    listRef.current
      ?.querySelector(`[data-word-key="${CSS.escape(spotlightKey)}"]`)
      ?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
  }, [spotlightKey, reducedMotion]);

  function changeQuery(value: string) {
    setQuery(value);
    setVisibleCount(PAGE_SIZE);
    setSpotlightKey(null);
  }

  function changeGroup(nextGroupId: string | null) {
    setGroupId(nextGroupId);
    setVisibleCount(PAGE_SIZE);
    setSpotlightKey(null);
  }

  function pickRandomWord() {
    if (matches.length === 0) {
      return;
    }

    let index = Math.floor(Math.random() * matches.length);

    if (matches.length > 1 && getEntryKey(matches[index]) === spotlightKey) {
      index = (index + 1) % matches.length;
    }

    setVisibleCount(Math.max(visibleCount, Math.ceil((index + 1) / PAGE_SIZE) * PAGE_SIZE));
    setSpotlightKey(getEntryKey(matches[index]));
  }

  return (
    <div className="mt-12">
      <div className="relative">
        <label
          htmlFor={searchId}
          className="bg-ink text-yellow absolute -top-4 left-4 z-10 -rotate-2 rounded-md px-3 py-0.5 font-mono text-xs font-bold tracking-wider uppercase"
        >
          Знайти слово
        </label>
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(event) => changeQuery(event.target.value)}
          placeholder="наприклад: розпил або map"
          autoComplete="off"
          spellCheck={false}
          className="sticker bg-yellow text-ink placeholder:text-ink/70 h-16 w-full px-5 font-mono text-lg font-bold sm:h-20 sm:text-3xl"
        />
      </div>

      <div
        role="group"
        aria-label="Категорії"
        className="-mx-4 mt-8 grid auto-cols-max grid-flow-col grid-rows-2 gap-3 overflow-x-auto px-4 py-2 sm:mx-0 sm:flex sm:flex-wrap sm:overflow-visible sm:px-0 [&>*:nth-child(3n+1)]:-rotate-1 [&>*:nth-child(3n+2)]:rotate-1"
      >
        <button
          type="button"
          aria-pressed={groupId === null}
          onClick={() => changeGroup(null)}
          className={`${chipBase} ${groupId === null ? chipActive : chipIdle}`}
        >
          Усі
        </button>
        {groups.map((group) => (
          <button
            key={group.id}
            type="button"
            aria-pressed={groupId === group.id}
            onClick={() => changeGroup(group.id)}
            className={`${chipBase} ${groupId === group.id ? chipActive : chipIdle}`}
          >
            {group.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="font-mono text-sm font-bold">
          {matches.length === 0
            ? 'Нічого не знайдено'
            : `Знайдено ${formatWordCount(matches.length)}`}
        </p>
        <button
          type="button"
          disabled={matches.length === 0}
          onClick={pickRandomWord}
          className={`${BUTTON} bg-red text-paper`}
        >
          🎲 Випадкове слово
        </button>
      </div>

      {matches.length === 0 ? (
        <p className="sticker bg-yellow mt-8 -rotate-1 p-8 text-center text-lg font-semibold">
          Порожньо. Спробуй коротший запит або тисни «Усі».
        </p>
      ) : (
        <ul
          ref={listRef}
          className="relative mt-8 grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((entry) => {
              const key = getEntryKey(entry);

              return (
                <m.li
                  key={key}
                  data-word-key={key}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.18 }}
                  className="min-w-0"
                >
                  <WordCard
                    entry={entry}
                    groupLabel={groupLabels.get(entry.groupId) ?? ''}
                    spotlight={key === spotlightKey}
                  />
                </m.li>
              );
            })}
          </AnimatePresence>
        </ul>
      )}

      {matches.length > visibleCount ? (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount(visibleCount + PAGE_SIZE)}
            className={`${BUTTON} bg-ink text-yellow`}
          >
            Показати ще ({Math.min(PAGE_SIZE, matches.length - visibleCount)})
          </button>
        </div>
      ) : null}
    </div>
  );
}
