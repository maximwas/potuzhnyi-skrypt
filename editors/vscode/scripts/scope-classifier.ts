interface ScopeClassifierDependencies {
  readonly scopeGroups: readonly (readonly [scope: string, jsWords: readonly string[]])[];
  readonly fallbackScope: string;
}

export class ScopeClassifier {
  private readonly scopeByJsWord: ReadonlyMap<string, string>;
  private readonly fallbackScope: string;

  public constructor({ scopeGroups, fallbackScope }: ScopeClassifierDependencies) {
    this.scopeByJsWord = this.indexByJsWord(scopeGroups);
    this.fallbackScope = fallbackScope;
  }

  public classify(jsWord: string): string {
    return this.scopeByJsWord.get(jsWord) ?? this.fallbackScope;
  }

  private indexByJsWord(
    scopeGroups: readonly (readonly [scope: string, jsWords: readonly string[]])[],
  ): ReadonlyMap<string, string> {
    const scopeByJsWord = new Map<string, string>();

    for (const [scope, jsWords] of scopeGroups) {
      for (const jsWord of jsWords) {
        scopeByJsWord.set(jsWord, scope);
      }
    }

    return scopeByJsWord;
  }
}
