// Текст воркера. Рядок, а не функція: мініфікація бандла не повинна чіпати імена всередині Blob.
export function createWorkerSource(maxLines: number): string {
  return `
const maxLines = ${maxLines};
let sentLines = 0;

const show = (value) => {
  if (typeof value === 'string') return value;
  if (value instanceof Error) return value.name + ': ' + value.message;
  try {
    const json = JSON.stringify(value);
    return json === undefined ? String(value) : json;
  } catch {
    return String(value);
  }
};

const send = (level, values) => {
  if (sentLines >= maxLines) return;
  sentLines += 1;
  postMessage({ type: 'line', level, text: values.map(show).join(' ') });
  if (sentLines === maxLines) postMessage({ type: 'truncated' });
};

console.log = console.info = console.debug = (...values) => send('log', values);
console.warn = (...values) => send('warn', values);
console.error = (...values) => send('error', values);

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

onmessage = async (event) => {
  try {
    await new AsyncFunction(event.data)();
    postMessage({ type: 'done' });
  } catch (error) {
    postMessage({ type: 'failed', message: show(error) });
  }
};
`;
}
