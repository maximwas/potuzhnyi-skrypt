// Апостроф у словах буває ʼ, ’, ‘, ` і ' — для пошуку це одна літера.
export function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ʼ’‘`´]/g, "'")
    .trim();
}
