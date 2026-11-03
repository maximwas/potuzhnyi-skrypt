// Знак «Зе»: ті самі форми й кольори, що в іконці розширення (editors/vscode/icons/potuzhno.svg).
export function ZeMarkShapes() {
  return (
    <>
      <rect width="128" height="128" rx="16" fill="#1f9d55" />
      <g fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 21H36A20 21.5 0 0 1 36 64H26H36A20 21.5 0 0 1 36 107H14" strokeWidth="14" />
        <path d="M75 85H113A19 24 0 1 0 94 109Q109 109 113 104" strokeWidth="12" />
      </g>
    </>
  );
}

interface ZeMarkProps {
  readonly className?: string;
}

export function ZeMark({ className = '' }: ZeMarkProps) {
  return (
    <svg viewBox="0 0 128 128" aria-hidden="true" focusable="false" className={className}>
      <ZeMarkShapes />
    </svg>
  );
}
