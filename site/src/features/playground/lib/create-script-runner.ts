import { ScriptRunner, type WorkerLike } from './script-runner.ts';
import { createWorkerSource } from './worker-source.ts';

const TIMEOUT_MILLISECONDS = 2000;
const MAX_OUTPUT_LINES = 1000;

// Воркер із Blob: немає DOM, а terminate() зупиняє навіть while(true). Sandboxed iframe цього не вміє.
function createBlobWorker(): WorkerLike {
  const blob = new Blob([createWorkerSource(MAX_OUTPUT_LINES)], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);

  URL.revokeObjectURL(url);

  return worker as unknown as WorkerLike;
}

export function createScriptRunner(): ScriptRunner {
  return new ScriptRunner({
    createWorker: createBlobWorker,
    timeoutMilliseconds: TIMEOUT_MILLISECONDS,
    setTimer: (callback, milliseconds) => window.setTimeout(callback, milliseconds),
    clearTimer: (timer) => window.clearTimeout(timer as number),
  });
}
