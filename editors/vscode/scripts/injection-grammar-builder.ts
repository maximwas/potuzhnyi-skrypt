import type { MemeEntry } from '../../../src/dictionary/meme-dictionary.ts';
import type { ScopeClassifier } from './scope-classifier.ts';

interface InjectionGrammarBuilderDependencies {
  readonly memeEntries: readonly MemeEntry[];
  readonly scopeClassifier: ScopeClassifier;
  readonly fallbackScope: string;
}

interface InjectionPattern {
  readonly match: string;
  readonly name: string;
}

// Слово не може торкатися літер, цифр, _ і $: інакше `в` спрацює всередині чужого ідентифікатора.
const BEFORE_WORD = String.raw`(?<![\p{L}\p{N}_$])`;
const AFTER_WORD = String.raw`(?![\p{L}\p{N}_$])`;

// Усередині `${}` весь шаблон має scope string.template, тому простий `- string` вимкнув би й інтер'єр.
const INJECTION_SELECTOR = [
  'L:source.potuzhno - (string | comment)',
  'L:source.potuzhno meta.template.expression - (string.quoted | string.regexp | comment)',
].join(', ');

export class InjectionGrammarBuilder {
  private readonly memeEntries: readonly MemeEntry[];
  private readonly scopeClassifier: ScopeClassifier;
  private readonly fallbackScope: string;

  public constructor({
    memeEntries,
    scopeClassifier,
    fallbackScope,
  }: InjectionGrammarBuilderDependencies) {
    this.memeEntries = memeEntries;
    this.scopeClassifier = scopeClassifier;
    this.fallbackScope = fallbackScope;
  }

  public build(): string {
    const grammar = {
      $comment: 'Згенеровано командою npm run generate. Не редагувати вручну.',
      scopeName: 'potuzhno.keywords.injection',
      injectTo: ['source.potuzhno'],
      injectionSelector: INJECTION_SELECTOR,
      patterns: this.buildPatterns(),
    };

    return `${JSON.stringify(grammar, null, 2)}\n`;
  }

  private buildPatterns(): InjectionPattern[] {
    const memesByScope = new Map<string, string[]>();

    for (const [meme, jsWord] of this.memeEntries) {
      const scope = this.scopeClassifier.classify(jsWord);
      const memes = memesByScope.get(scope) ?? [];

      memes.push(meme);
      memesByScope.set(scope, memes);
    }

    return [...memesByScope.entries()]
      .sort(([left], [right]) => this.rank(left) - this.rank(right) || left.localeCompare(right))
      .map(([scope, memes]) => ({ match: this.buildMatch(memes), name: scope }));
  }

  // Запасний scope іде останнім, решта — за алфавітом: вивід стабільний для drift-тесту.
  private rank(scope: string): number {
    return scope === this.fallbackScope ? 1 : 0;
  }

  private buildMatch(memes: readonly string[]): string {
    const alternatives = [...memes]
      .sort((left, right) => right.length - left.length || left.localeCompare(right))
      .map((meme) => this.escapeRegex(meme));

    return `${BEFORE_WORD}(?:${alternatives.join('|')})${AFTER_WORD}`;
  }

  private escapeRegex(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
  }
}
