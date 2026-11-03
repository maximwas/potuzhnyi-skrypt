import assert from 'node:assert/strict';
import { test } from 'node:test';
import vm from 'node:vm';

import {
  ScriptRunner,
  type WorkerLike,
  type WorkerMessage,
} from '../src/features/playground/lib/script-runner.ts';
import { createWorkerSource } from '../src/features/playground/lib/worker-source.ts';

class FakeWorker implements WorkerLike {
  public onmessage: WorkerLike['onmessage'] = null;
  public onerror: WorkerLike['onerror'] = null;
  public terminated = false;

  private readonly behaviour: (worker: FakeWorker) => void;

  public constructor(behaviour: (worker: FakeWorker) => void) {
    this.behaviour = behaviour;
  }

  public postMessage(): void {
    this.behaviour(this);
  }

  public terminate(): void {
    this.terminated = true;
  }

  public emit(data: WorkerMessage): void {
    this.onmessage?.({ data });
  }
}

function createRunner(behaviour: (worker: FakeWorker) => void) {
  const workers: FakeWorker[] = [];
  const timers: (() => void)[] = [];
  const runner = new ScriptRunner({
    createWorker: () => {
      const worker = new FakeWorker(behaviour);

      workers.push(worker);

      return worker;
    },
    timeoutMilliseconds: 2000,
    setTimer: (callback) => timers.push(callback),
    clearTimer: () => undefined,
  });

  return { runner, workers, timers };
}

test('збирає рядки консолі й завершується на done', async () => {
  const { runner, workers } = createRunner((worker) => {
    worker.emit({ type: 'line', level: 'log', text: 'привіт' });
    worker.emit({ type: 'done' });
  });
  const report = await runner.run('1');

  assert.equal(report.outcome, 'finished');
  assert.deepEqual(report.lines, [{ level: 'log', text: 'привіт' }]);
  assert.equal(workers[0]?.terminated, true);
});

test('нескінченний цикл: таймер вбиває воркер', async () => {
  const { runner, workers, timers } = createRunner(() => undefined);
  const pending = runner.run('while (true) {}');

  timers[0]?.();

  const report = await pending;

  assert.equal(report.outcome, 'timeout');
  assert.equal(workers[0]?.terminated, true);
});

test('виняток із воркера повертається як помилка', async () => {
  const { runner } = createRunner((worker) =>
    worker.emit({ type: 'failed', message: 'Error: ой' }),
  );
  const report = await runner.run('x');

  assert.equal(report.outcome, 'failed');
  assert.equal(report.errorMessage, 'Error: ой');
});

test('текст воркера: консоль форматується, помилка й ліміт рядків працюють', async () => {
  const messages: WorkerMessage[] = [];
  const context: Record<string, unknown> = {
    console: {},
    postMessage: (message: WorkerMessage) => messages.push(message),
  };

  vm.createContext(context);
  vm.runInContext(createWorkerSource(2), context);

  const onmessage = context.onmessage as (event: { data: string }) => Promise<void>;

  await onmessage({
    data: 'console.log("a", 1, {k: [1]}); console.error(new Error("бум")); console.log("зайве");',
  });
  await onmessage({ data: 'throw new TypeError("ой")' });
  await onmessage({ data: 'const x = await Promise.resolve(5); console.log(x);' });

  assert.deepEqual(JSON.parse(JSON.stringify(messages)).slice(0, 4), [
    { type: 'line', level: 'log', text: 'a 1 {"k":[1]}' },
    { type: 'line', level: 'error', text: 'Error: бум' },
    { type: 'truncated' },
    { type: 'done' },
  ]);
  assert.deepEqual(JSON.parse(JSON.stringify(messages[4])), {
    type: 'failed',
    message: 'TypeError: ой',
  });
  assert.equal(messages[5]?.type, 'done');
});
