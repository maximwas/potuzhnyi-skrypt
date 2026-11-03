import { CopyButton } from './copy-button.tsx';

interface CodeBlockProps {
  readonly label: string;
  readonly lines: readonly string[];
}

export function CodeBlock({ label, lines }: CodeBlockProps) {
  return (
    <figure className="overflow-hidden rounded-md bg-deep text-paper">
      <figcaption className="flex items-center justify-between gap-3 px-4 pt-3">
        <span className="font-mono text-xs text-paper">{label}</span>
        <CopyButton text={lines.join('\n')} />
      </figcaption>
      <pre className="overflow-x-auto px-4 pb-4 pt-3 font-mono text-sm leading-relaxed">
        <code>
          {lines.map((line) => (
            <span key={line} className="block whitespace-pre">
              <span aria-hidden="true" className="select-none text-yellow">
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
