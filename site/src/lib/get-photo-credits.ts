import photoCredits from '@/constants/photo-credits.json';
import type { PhotoCredit } from '@/types/photo-credit';

const credits = photoCredits as readonly PhotoCredit[];

export function getPhotoCredits(): readonly PhotoCredit[] {
  return credits;
}
