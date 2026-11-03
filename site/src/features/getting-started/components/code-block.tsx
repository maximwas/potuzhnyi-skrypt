import { CopyButton } from './copy-button.tsx';

interface CodeBlockProps {
  readonly label: string;
  readonly lines: readonly string[];
}

const dotClass = 'h-2.5 w-2.5 rounded-full border-2 border-ink';

export function CodeBlock({ label, lines }: CodeBlockProps) {
  return (
    <figure className="border-ink bg-deep text-paper shadow-hard-sm m-0 min-w-0 overflow-hidden rounded-lg border-[3px]">
      <figcaption className="border-ink bg-paper text-ink flex flex-wrap items-center justify-between gap-2 border-b-[3px] px-3 py-2">
        <span className="flex items-center gap-2 font-mono text-xs font-bold">
          <span aria-hidden="true" className="flex gap-1">
            <span className={`${dotClass} bg-red`} />
            <span className={`${dotClass} bg-yellow`} />
            <span className={`${dotClass} bg-green`} />
          </span>
          {label}
        </span>
        <CopyButton text={lines.join('\n')} />
      </figcaption>
      <pre
        tabIndex={0}
        data-lenis-prevent
        className="m-0 overflow-x-auto px-4 py-3 font-mono text-sm leading-relaxed"
      >
        <code>
          {lines.map((line) => (
            <span key={line} className="block whitespace-pre">
              <span aria-hidden="true" className="text-yellow select-none">
                ${' '}
              </span>
              {line}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
