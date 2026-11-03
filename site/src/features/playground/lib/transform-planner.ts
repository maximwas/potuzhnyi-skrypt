import type { Replacement } from '../../../../../src/translation/translator.ts';

// Діапазон слова у ВИХІДНОМУ (перекладеному) тексті, без пробілів-відступів слова-оператора.
export interface OutputRange {
  readonly start: number;
  readonly end: number;
  readonly original: string;
  readonly replacement: string;
}

interface TransformPlannerDependencies {
  readonly maxAnimatedWords: number;
}

export class TransformPlanner {
  private readonly maxAnimatedWords: number;

  public constructor({ maxAnimatedWords }: TransformPlannerDependencies) {
    this.maxAnimatedWords = maxAnimatedWords;
  }

  public toOutputRanges(replacements: readonly Replacement[]): OutputRange[] {
    const ranges: OutputRange[] = [];
    let shift = 0;

    for (const { start, end, original, replacement } of replacements) {
      const trimmed = replacement.trim();
      const leadingSpaces = replacement.length - replacement.trimStart().length;
      const outputStart = start + shift + leadingSpaces;

      ranges.push({
        start: outputStart,
        end: outputStart + trimmed.length,
        original,
        replacement: trimmed,
      });
      shift += replacement.length - (end - start);
    }

    return ranges;
  }

  // null — анімації не буде (перший показ або забагато змін), масив — слова, що змінилися.
  public planChanges(
    previous: readonly OutputRange[] | null,
    current: readonly OutputRange[],
  ): OutputRange[] | null {
    if (previous === null) {
      return null;
    }

    const knownPairs = new Map<string, number>();

    for (const range of previous) {
      const key = this.pairKey(range);

      knownPairs.set(key, (knownPairs.get(key) ?? 0) + 1);
    }

    const changed: OutputRange[] = [];

    for (const range of current) {
      const key = this.pairKey(range);
      const remaining = knownPairs.get(key) ?? 0;

      if (remaining > 0) {
        knownPairs.set(key, remaining - 1);
      } else {
        changed.push(range);
      }
    }

    return changed.length > this.maxAnimatedWords ? null : changed;
  }

  private pairKey({ original, replacement }: OutputRange): string {
    return `${original}\u0000${replacement}`;
  }
}
