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
import { RunPanel } from './run-panel.tsx';

const DEBOUNCE_MILLISECONDS = 120;
const translator = createPlaygroundTranslator(reservedWords);
const planner = new TransformPlanner({ maxAnimatedWords: 40 });
const FIRST_EXAMPLE = PLAYGROUND_EXAMPLES[0];

const BUTTON =
  'min-h-11 rounded-md px-4 font-sans text-base font-semibold focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue disabled:opacity-50';

export function PlaygroundWorkbench() {
  const [exampleId, setExampleId] = useState(FIRST_EXAMPLE.id);
  const [source, setSource] = useState(FIRST_EXAMPLE.source);
  const [translation, setTranslation] = useState(() => translator.translate(FIRST_EXAMPLE.source));
  const [goodCode, setGoodCode] = useState(translation.ok ? translation.code : '');
  const [playback, setPlayback] = useState<TransformPlayback | null>(null);
  const [copyMessage, setCopyMessage] = useState('');
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

  return (
    <div className="mt-8 grid gap-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="grid gap-1 font-sans text-sm font-semibold">
          Приклад
          <select
            value={exampleId}
            onChange={(event) => loadExample(event.target.value)}
            className="border-ink bg-paper text-ink focus-visible:outline-blue min-h-11 rounded-md border px-3 text-base focus-visible:outline-3 focus-visible:outline-offset-2"
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
          className={`${BUTTON} border-ink text-ink border`}
        >
          Скинути
        </button>
        <button
          type="button"
          onClick={() => void copyCode()}
          className={`${BUTTON} border-ink text-ink border`}
        >
          Копіювати JS
        </button>
        <button
          type="button"
          disabled={!translation.ok || runState.status === 'running'}
          onClick={() => void run(goodCode)}
          className={`${BUTTON} bg-blue text-paper`}
        >
          Запустити
        </button>
      </div>

      <div className="grid gap-4 min-[900px]:grid-cols-2">
        <div className="grid min-w-0 gap-2">
          <p className="font-sans text-sm font-semibold">Ти пишеш (ПотужнийСкрипт)</p>
          <HighlightedEditor value={source} html={sourceHtml} onChange={setSource} />
        </div>
        <div className="grid min-w-0 gap-2">
          <p className="font-sans text-sm font-semibold">Виходить (JavaScript)</p>
          <OutputPane html={outputHtml} playback={playback} dimmed={!translation.ok} />
        </div>
      </div>

      <p
        role="status"
        className={`font-sans text-sm ${translation.ok ? 'text-muted' : 'text-red'}`}
      >
        {status} {copyMessage}
      </p>

      <RunPanel state={runState} />
      <p className="text-muted font-sans text-sm">
        Код виконується лише в твоєму браузері, в окремому потоці без доступу до сторінки, і
        зупиняється за 2 секунди.
      </p>
    </div>
  );
}
