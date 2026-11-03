export type OutputLevel = 'log' | 'warn' | 'error';

export interface OutputLine {
  readonly level: OutputLevel;
  readonly text: string;
}

export interface RunReport {
  readonly lines: readonly OutputLine[];
  readonly outcome: 'finished' | 'failed' | 'timeout';
  readonly errorMessage: string | null;
  readonly truncated: boolean;
}

export type WorkerMessage =
  | { readonly type: 'line'; readonly level: OutputLevel; readonly text: string }
  | { readonly type: 'truncated' }
  | { readonly type: 'done' }
  | { readonly type: 'failed'; readonly message: string };

export interface WorkerLike {
  onmessage: ((event: { readonly data: WorkerMessage }) => void) | null;
  onerror: ((event: { readonly message?: string; preventDefault?: () => void }) => void) | null;
  postMessage(message: string): void;
  terminate(): void;
}

interface ScriptRunnerDependencies {
  readonly createWorker: () => WorkerLike;
  readonly timeoutMilliseconds: number;
  readonly setTimer: (callback: () => void, milliseconds: number) => unknown;
  readonly clearTimer: (timer: unknown) => void;
}

export class ScriptRunner {
  private readonly createWorker: () => WorkerLike;
  private readonly timeoutMilliseconds: number;
  private readonly setTimer: (callback: () => void, milliseconds: number) => unknown;
  private readonly clearTimer: (timer: unknown) => void;
  private activeWorker: WorkerLike | null = null;

  public constructor({
    createWorker,
    timeoutMilliseconds,
    setTimer,
    clearTimer,
  }: ScriptRunnerDependencies) {
    this.createWorker = createWorker;
    this.timeoutMilliseconds = timeoutMilliseconds;
    this.setTimer = setTimer;
    this.clearTimer = clearTimer;
  }

  // shortcut: після «done» воркер вбивається одразу, тож таймери (setTimeout) не дочекаємось, коли посилити: тримати воркер до таймауту
  public run(code: string): Promise<RunReport> {
    this.dispose();

    return new Promise((resolve) => {
      const worker = this.createWorker();
      const lines: OutputLine[] = [];
      let truncated = false;
      let settled = false;

      this.activeWorker = worker;

      const finish = (outcome: RunReport['outcome'], errorMessage: string | null) => {
        if (settled) {
          return;
        }

        settled = true;
        this.clearTimer(timer);
        worker.terminate();
        resolve({ lines, outcome, errorMessage, truncated });
      };
      const timer = this.setTimer(() => finish('timeout', null), this.timeoutMilliseconds);

      worker.onmessage = ({ data }) => {
        if (data.type === 'line') {
          lines.push({ level: data.level, text: data.text });
        } else if (data.type === 'truncated') {
          truncated = true;
        } else if (data.type === 'done') {
          finish('finished', null);
        } else {
          finish('failed', data.message);
        }
      };
      worker.onerror = (event) => {
        event.preventDefault?.();
        finish('failed', event.message ?? 'Невідома помилка');
      };
      worker.postMessage(code);
    });
  }

  public dispose(): void {
    this.activeWorker?.terminate();
    this.activeWorker = null;
  }
}
