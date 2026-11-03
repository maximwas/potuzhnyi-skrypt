export function formatWordCount(count: number): string {
  const lastTwo = count % 100;
  const last = count % 10;

  if (lastTwo >= 11 && lastTwo <= 14) {
    return `${count} слів`;
  }

  if (last === 1) {
    return `${count} слово`;
  }

  if (last >= 2 && last <= 4) {
    return `${count} слова`;
  }

  return `${count} слів`;
}
