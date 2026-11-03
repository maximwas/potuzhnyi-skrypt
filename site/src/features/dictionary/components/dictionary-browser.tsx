'use client';

import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { useId, useMemo, useState } from 'react';

import { filterEntries } from '../lib/filter-entries.ts';
import { formatWordCount } from '../lib/format-word-count.ts';
import type { DictionaryEntry, DictionaryGroup } from '../types.ts';

const PAGE_SIZE = 48;

interface DictionaryBrowserProps {
  readonly groups: readonly DictionaryGroup[];
  readonly entries: readonly DictionaryEntry[];
}

const chipBase =
  'shrink-0 rounded-full border px-3 py-1 font-mono text-sm transition-colors cursor-pointer';
const chipIdle = 'border-ink/40 bg-paper text-ink hover:bg-paper-2';
const chipActive = 'border-deep bg-deep text-paper';

export function DictionaryBrowser({ groups, entries }: DictionaryBrowserProps) {
  const searchId = useId();
  const [query, setQuery] = useState('');
  const [groupId, setGroupId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const matches = useMemo(
    () => filterEntries(entries, { query, groupId }),
    [entries, query, groupId],
  );
  const visible = matches.slice(0, visibleCount);

  function changeQuery(value: string) {
    setQuery(value);
    setVisibleCount(PAGE_SIZE);
  }

  function changeGroup(nextGroupId: string | null) {
    setGroupId(nextGroupId);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div className="mt-10">
      <div className="flex flex-col gap-2">
        <label htmlFor={searchId} className="font-serif text-base font-semibold text-ink">
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
          className="w-full rounded-md border-2 border-ink bg-paper px-4 py-3 font-mono text-base text-ink placeholder:text-muted sm:max-w-md"
        />
      </div>

      <div
        role="group"
        aria-label="Категорії"
        className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
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

      <p role="status" aria-live="polite" className="mt-4 font-mono text-sm text-muted">
        {matches.length === 0
          ? 'Нічого не знайдено'
          : `Знайдено ${formatWordCount(matches.length)}`}
      </p>

      {matches.length === 0 ? (
        <p className="mt-8 rounded-md border border-dashed border-ink/40 p-8 text-center text-lg text-muted">
          У словнику такого немає. Спробуйте коротший запит або оберіть «Усі».
        </p>
      ) : (
        <ul className="relative mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((entry) => (
              <m.li
                key={`${entry.groupId}:${entry.meme}:${entry.javascript}`}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.18 }}
                className="flex flex-col gap-2 rounded-md border border-ink/20 bg-paper-2 p-4"
              >
                <span className="break-all font-mono text-base font-semibold text-ink">
                  {entry.meme}
                </span>
                <span className="flex flex-wrap items-center gap-2 font-mono text-sm">
                  <span aria-hidden="true" className="text-muted">
                    →
                  </span>
                  <span className="sr-only">це</span>
                  <code
                    className={
                      entry.gloss === undefined
                        ? 'break-all font-semibold text-blue'
                        : 'rounded bg-deep px-2 py-0.5 text-lg font-bold text-yellow'
                    }
                  >
                    {entry.javascript}
                  </code>
                  {entry.gloss === undefined ? null : (
                    <span className="font-serif text-sm text-muted">{entry.gloss}</span>
                  )}
                </span>
              </m.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      {matches.length > visibleCount ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount(visibleCount + PAGE_SIZE)}
            className="cursor-pointer rounded-md bg-blue px-6 py-3 font-serif text-base font-bold text-paper hover:bg-deep"
          >
            Показати ще ({Math.min(PAGE_SIZE, matches.length - visibleCount)})
          </button>
        </div>
      ) : null}
    </div>
  );
}
