// Файли з public/ і metadata.icons Next не префіксує basePath-ом, тож їхні адреси проходять через цю функцію.
export function withBasePath(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;
}
