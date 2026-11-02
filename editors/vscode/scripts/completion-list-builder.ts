import type { MemeEntry } from '../../../src/dictionary/meme-dictionary.ts';
import type { ScopeClassifier } from './scope-classifier.ts';

interface CompletionListBuilderDependencies {
  readonly memeEntries: readonly MemeEntry[];
  readonly scopeClassifier: ScopeClassifier;
}

// Імена з vscode.CompletionItemKind. Перший збіг за початком scope виграє, тому вужчі стоять вище.
const KIND_BY_SCOPE_PREFIX: readonly (readonly [scopePrefix: string, kind: string])[] = [
  ['keyword.operator.arithmetic', 'Operator'],
  ['keyword', 'Keyword'],
  ['storage', 'Keyword'],
  ['support.class', 'Class'],
  ['variable.language', 'Variable'],
  ['constant.language', 'Constant'],
];

const FALLBACK_KIND = 'Method';

export class CompletionListBuilder {
  private readonly memeEntries: readonly MemeEntry[];
  private readonly scopeClassifier: ScopeClassifier;

  public constructor({ memeEntries, scopeClassifier }: CompletionListBuilderDependencies) {
    this.memeEntries = memeEntries;
    this.scopeClassifier = scopeClassifier;
  }

  // Один запис на рядок, щоб зміни словника було видно в git diff.
  public build(): string {
    const lines = this.memeEntries.map(([label, jsWord]) => {
      const kind = this.kindOf(this.scopeClassifier.classify(jsWord));

      return `  ${JSON.stringify({ label, detail: jsWord, kind })}`;
    });

    return `[\n${lines.join(',\n')}\n]\n`;
  }

  private kindOf(scope: string): string {
    const match = KIND_BY_SCOPE_PREFIX.find(([scopePrefix]) => scope.startsWith(scopePrefix));

    return match?.[1] ?? FALLBACK_KIND;
  }
}
