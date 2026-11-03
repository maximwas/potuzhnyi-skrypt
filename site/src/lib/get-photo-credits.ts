import photoCredits from '@/constants/photo-credits.json';
import type { PhotoCredit } from '@/types/photo-credit';

const credits = photoCredits as readonly PhotoCredit[];

export function getPhotoCredits(): readonly PhotoCredit[] {
  return credits;
}

export function getPhotoCredit(file: string): PhotoCredit {
  const credit = credits.find((candidate) => candidate.file === file);

  if (credit === undefined) {
    throw new Error(`Немає даних про фото ${file}`);
  }

  return credit;
}
