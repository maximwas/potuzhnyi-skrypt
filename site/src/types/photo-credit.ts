export type PhotoCategory = 'kyiv' | 'zelensky' | 'politician';

export interface PhotoCredit {
  readonly file: string;
  readonly subject: string;
  readonly category: PhotoCategory;
  readonly altUk: string;
  readonly captionUk: string;
  readonly author: string;
  readonly license: string;
  readonly licenseUrl: string;
  readonly sourceUrl: string;
  readonly commonsUrl: string;
  readonly attributionUk: string;
  readonly width: number;
  readonly height: number;
  readonly bytes: number;
}
