'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { PLAYGROUND_EXAMPLES } from '../data/playground-examples.ts';
import reservedWords from '../data/reserved-words.json';
import { toPlainHtml } from '../lib/escape-html.ts';
import { createPlaygroundTranslator } from '../lib/playground-translator.ts';
import { TransformPlanner, type OutputRange } from '../lib/transform-planner.ts';
import { usePlaygroundHighlighter } from '../lib/use-playground-highlighter.ts';
import { useScriptRun } from '../lib/use-script-run.ts';
import { HighlightedEditor } from './highlighted-editor.tsx';
import { OutputPane, type TransformPlayback } from './output-pane.tsx';
import { ReplacementsBadge } from './replacements-badge.tsx';
import { RunPanel } from './run-panel.tsx';
import { StickerWindow } from './sticker-window.tsx';
import { TranslateArrow } from './translate-arrow.tsx';

const DEBOUNCE_MILLISECONDS = 120;
const translator = createPlaygroundTranslator(reservedWords);
const planner = new TransformPlanner({ maxAnimatedWords: 40 });
const FIRST_EXAMPLE = PLAYGROUND_EXAMPLES[0];

// Кнопка-наліпка: тінь «втискається» при наведенні й натисканні (лише для активної кнопки).
const BUTTON =
  'border-ink shadow-hard-sm focus-visible:outline-blue min-h-11 cursor-pointer rounded-lg border-[3px] px-4 font-mono text-sm font-extrabold tracking-wide uppercase transition-[transform,box-shadow] duration-100 focus-visible:outline-3 focus-visible:outline-offset-4 enabled:hover:translate-x-0.5 enabled:hover:translate-y-0.5 enabled:hover:shadow-[2px_2px_0_var(--color-ink)] enabled:active:translate-x-1 enabled:active:translate-y-1 enabled:active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none';

export function PlaygroundWorkbench() {
  const [exampleId, setExampleId] = useState(FIRST_EXAMPLE.id);
  const [source, setSource] = useState(FIRST_EXAMPLE.source);
  const [translation, setTranslation] = useState(() => translator.translate(FIRST_EXAMPLE.source));
  const [goodCode, setGoodCode] = useState(translation.ok ? translation.code : '');
  const [playback, setPlayback] = useState<TransformPlayback | null>(null);
  const [copyMessage, setCopyMessage] = useState('');
  const [translationRuns, setTranslationRuns] = useState(0);
  const previousRanges = useRef<OutputRange[] | null>(null);
  const playbackCounter = useRef(0);
  const highlighter = usePlaygroundHighlighter();
  const { state: runState, run, clear: clearRun } = useScriptRun();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const next = translator.translate(source);

      setTranslation(next);

      if (!next.ok) {
        return;
      }

      setGoodCode(next.code);
      setTranslationRuns((count) => count + 1);

      const ranges = planner.toOutputRanges(next.replacements);
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const changed = reducedMotion ? null : planner.planChanges(previousRanges.current, ranges);

      previousRanges.current = ranges;
      playbackCounter.current += 1;
      setPlayback(
        changed && changed.length > 0 ? { token: playbackCounter.current, ranges: changed } : null,
      );
    }, DEBOUNCE_MILLISECONDS);

    return () => window.clearTimeout(timer);
  }, [source]);

  const sourceHtml = useMemo(() => {
    const text = `${source}\n`;

    return highlighter ? highlighter.highlightPotuzhno(text) : toPlainHtml(text);
  }, [highlighter, source]);
  const outputHtml = useMemo(() => {
    const text = `${goodCode}\n`;

    return highlighter ? highlighter.highlightJavaScript(text) : toPlainHtml(text);
  }, [highlighter, goodCode]);

  const status = translation.ok
    ? `Замін у коді: ${translation.replacements.length}`
    : translation.message;

  const loadExample = (id: string) => {
    const example = PLAYGROUND_EXAMPLES.find((candidate) => candidate.id === id);

    if (example) {
      setExampleId(id);
      setSource(example.source);
      clearRun();
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(goodCode);
      setCopyMessage('JavaScript скопійовано.');
    } catch {
      setCopyMessage('Не вдалося скопіювати: виділи код праворуч і скопіюй вручну.');
    }
  };

  const badgeLabel = translation.ok ? `замін: ${translation.replacements.length}` : 'помилка';

  return (
    <div className="mt-10 grid gap-6">
      <div className="flex flex-wrap items-end gap-3">
        <label className="text-ink grid gap-1 font-mono text-xs font-bold tracking-wider uppercase">
          Приклад
          <select
            value={exampleId}
            onChange={(event) => loadExample(event.target.value)}
            className="border-ink bg-paper text-ink shadow-hard-sm focus-visible:outline-blue min-h-11 cursor-pointer rounded-lg border-[3px] px-3 font-mono text-base font-bold normal-case select-none focus-visible:outline-3 focus-visible:outline-offset-4"
          >
            {PLAYGROUND_EXAMPLES.map((example) => (
              <option key={example.id} value={example.id}>
                {example.title}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => loadExample(exampleId)}
          className={`${BUTTON} bg-paper text-ink`}
        >
          Скинути
        </button>
        <button
          type="button"
          onClick={() => void copyCode()}
          className={`${BUTTON} bg-paper text-ink`}
        >
          Копіювати JS
        </button>
        <button
          type="button"
          disabled={!translation.ok || runState.status === 'running'}
          aria-busy={runState.status === 'running'}
          onClick={() => void run(goodCode)}
          className={`${BUTTON} bg-ink text-yellow`}
        >
          Запустити ▶
        </button>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-2 min-[900px]:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] min-[900px]:items-center min-[900px]:gap-5">
        <StickerWindow title="ти пишеш: .potuzhno" tone="deep">
          <HighlightedEditor value={source} html={sourceHtml} onChange={setSource} />
        </StickerWindow>
        <TranslateArrow pulse={translationRuns} />
        <StickerWindow
          title="виходить: JavaScript"
          tone="ink"
          badge={<ReplacementsBadge label={badgeLabel} failed={!translation.ok} />}
        >
          <OutputPane html={outputHtml} playback={playback} dimmed={!translation.ok} />
        </StickerWindow>
      </div>

      <p
        role="status"
        className={`font-mono text-sm font-bold ${translation.ok ? 'text-ink' : 'border-ink bg-red text-paper shadow-hard-sm w-fit max-w-full rounded-lg border-[3px] px-3 py-2'}`}
      >
        {status} {copyMessage}
      </p>

      <RunPanel state={runState} />
      <p className="text-ink font-mono text-xs">
        Код виконується лише в твоєму браузері, в окремому потоці без доступу до сторінки, і
        зупиняється за 2 секунди.
      </p>
    </div>
  );
}
