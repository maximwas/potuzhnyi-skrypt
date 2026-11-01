export type MemeEntry = readonly [meme: string, jsWord: string];

interface MemeDictionaryDependencies {
  readonly memeEntries: readonly MemeEntry[];
}

export class MemeDictionary {
  private readonly jsWordsByMeme: ReadonlyMap<string, string>;

  public constructor({ memeEntries }: MemeDictionaryDependencies) {
    this.jsWordsByMeme = this.indexByMeme(memeEntries);
  }

  public get size(): number {
    return this.jsWordsByMeme.size;
  }

  public findJsWord(meme: string): string | undefined {
    return this.jsWordsByMeme.get(meme);
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
