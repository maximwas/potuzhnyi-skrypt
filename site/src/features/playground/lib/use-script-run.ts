'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { createScriptRunner } from './create-script-runner.ts';
import type { RunReport } from './script-runner.ts';
import type { ScriptRunner } from './script-runner.ts';

export type RunState =
  | { readonly status: 'idle' }
  | { readonly status: 'running' }
  | { readonly status: 'done'; readonly report: RunReport };

export function useScriptRun() {
  const runnerRef = useRef<ScriptRunner | null>(null);
  const [state, setState] = useState<RunState>({ status: 'idle' });

  useEffect(() => {
    return () => runnerRef.current?.dispose();
  }, []);

  const run = useCallback(async (code: string) => {
    runnerRef.current ??= createScriptRunner();
    setState({ status: 'running' });

    const report = await runnerRef.current.run(code);

    setState({ status: 'done', report });
  }, []);

  const clear = useCallback(() => setState({ status: 'idle' }), []);

  return { state, run, clear };
}
