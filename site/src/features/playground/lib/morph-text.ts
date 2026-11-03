// Перетворення «слово → слово»: нові літери по одній витісняють старі.
export function morphText(from: string, to: string, progress: number): string {
  const steps = Math.max(from.length, to.length);
  const done = Math.round(Math.min(Math.max(progress, 0), 1) * steps);

  return to.slice(0, done) + from.slice(done);
}
