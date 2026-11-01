export type Transliterate = (text: string) => { readonly latin: string };

interface LatinTransliteratorDependencies {
  readonly transliterate: Transliterate;
  readonly reservedWords: ReadonlySet<string>;
}

const CYRILLIC_LETTER = /\p{Script=Cyrillic}/u;

export class LatinTransliterator {
  private readonly transliterate: Transliterate;
  private readonly reservedWords: ReadonlySet<string>;

  public constructor({ transliterate, reservedWords }: LatinTransliteratorDependencies) {
    this.transliterate = transliterate;
    this.reservedWords = reservedWords;
  }

  public containsCyrillic(name: string): boolean {
    return CYRILLIC_LETTER.test(name);
  }

  public toLatin(cyrillicName: string): string {
    const latinName = this.transliterate(cyrillicName).latin;

    return this.reservedWords.has(latinName) ? `${latinName}_` : latinName;
  }
}
