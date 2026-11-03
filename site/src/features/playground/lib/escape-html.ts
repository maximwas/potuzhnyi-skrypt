// Запасний показ, поки Shiki ще вантажиться: той самий <pre><code>, що дає Shiki.
export function toPlainHtml(code: string): string {
  const escaped = code.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

  return `<pre><code>${escaped}</code></pre>`;
}
