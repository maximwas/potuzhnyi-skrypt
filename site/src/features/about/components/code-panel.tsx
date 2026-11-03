export interface CodeSegment {
  readonly text: string;
  readonly isKeyword?: boolean;
}

interface CodePanelProps {
  readonly label: string;
  readonly lines: readonly (readonly CodeSegment[])[];
}

export function CodePanel({ label, lines }: CodePanelProps) {
  return (
    <figure className="m-0 min-w-0 rounded-md border-2 border-ink bg-deep text-paper">
      <figcaption className="border-b border-paper/30 px-4 py-2 font-mono text-sm font-semibold text-yellow">
        {label}
      </figcaption>
      <pre
        tabIndex={0}
        aria-label={`Код: ${label}`}
        className="m-0 overflow-x-auto p-4 font-mono text-[15px] leading-[1.6] [font-variant-ligatures:none]"
      >
        <code>
          {lines.map((line) => (
            <span key={line.map((segment) => segment.text).join('')} className="block">
              {line.map((segment) => (
                <span
                  key={segment.text}
                  className={segment.isKeyword === true ? 'font-bold text-yellow' : undefined}
                >
                  {segment.text}
                </span>
              ))}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
