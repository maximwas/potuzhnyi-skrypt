export type MemeEntry = readonly [meme: string, jsWord: string];

interface MemeDictionaryDependencies {
  readonly memeEntries: readonly MemeEntry[];
}

export class MemeDictionary {
  private readonly jsWordsByMeme: ReadonlyMap<string, string>;
  private readonly memesByJsWord: ReadonlyMap<string, string>;

  public constructor({ memeEntries }: MemeDictionaryDependencies) {
    this.jsWordsByMeme = this.indexByMeme(memeEntries);
    this.memesByJsWord = new Map(memeEntries.map(([meme, jsWord]) => [jsWord, meme]));
  }

  public get size(): number {
    return this.jsWordsByMeme.size;
  }

  public findJsWord(meme: string): string | undefined {
    return this.jsWordsByMeme.get(meme);
  }

  // Зворотний пошук для підказок: у словнику кожне JS-слово має одне мемне (це перевіряє тест).
  public findMeme(jsWord: string): string | undefined {
    return this.memesByJsWord.get(jsWord);
  }

  private indexByMeme(memeEntries: readonly MemeEntry[]): ReadonlyMap<string, string> {
    const jsWordsByMeme = new Map<string, string>();

    for (const [meme, jsWord] of memeEntries) {
      if (jsWordsByMeme.has(meme)) {
        throw new Error(`Мемне слово «${meme}» повторюється в словнику`);
      }

      jsWordsByMeme.set(meme, jsWord);
    }

    return jsWordsByMeme;
  }
}
