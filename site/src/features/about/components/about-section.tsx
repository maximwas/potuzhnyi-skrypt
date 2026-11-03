import { CodePanel } from '@/features/about/components/code-panel';
import type { CodeSegment } from '@/features/about/components/code-panel';
import { Reveal } from '@/components/ui/reveal';

const POINTS = [
  'Це звичайний JavaScript без сюрпризів: кожне мемне слово має точну JS-пару.',
  'Працює з npm-пакетами й Node: код перекладається на льоту, ваші залежності не чіпаються.',
  'Є розширення VS Code з підсвіткою, підказками й наведенням на ваші змінні та класи.',
] as const;

// Переклад звірено запуском: node bin/potuzhno.ts → [ 10, 20, 30 ]
const POTUZHNO_LINES: readonly (readonly CodeSegment[])[] = [
  [{ text: 'батон', isKeyword: true }, { text: ' ВІДКАТ = 0.1;' }],
  [{ text: 'потужно', isKeyword: true }, { text: ' бюджет = [100, 200, 300];' }],
  [
    { text: 'ОП.звернення', isKeyword: true },
    { text: '(бюджет.' },
    { text: 'розпил', isKeyword: true },
    { text: '(сума => сума * ВІДКАТ));' },
  ],
];

const JAVASCRIPT_LINES: readonly (readonly CodeSegment[])[] = [
  [{ text: 'const', isKeyword: true }, { text: ' VIDKAT = 0.1;' }],
  [{ text: 'let', isKeyword: true }, { text: ' biudzhet = [100, 200, 300];' }],
  [
    { text: 'console.log', isKeyword: true },
    { text: '(biudzhet.' },
    { text: 'map', isKeyword: true },
    { text: '(suma => suma * VIDKAT));' },
  ],
];

export function AboutSection() {
  return (
    <section id="pro" aria-labelledby="about-title" className="bg-paper">
      <div className="mx-auto max-w-6xl py-24 px-4 sm:px-6">
        <Reveal>
          <h2
            id="about-title"
            className="font-serif text-[clamp(2.25rem,6vw,4rem)] leading-[1.1] font-extrabold text-ink"
          >
            Що це
          </h2>
          <ul className="mt-8 grid max-w-[68ch] gap-4 text-lg">
            {POINTS.map((point) => (
              <li key={point} className="border-l-4 border-red pl-4">
                {point}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div className="grid items-start gap-4 md:grid-cols-[1fr_auto_1fr]">
            <CodePanel label=".potuzhno" lines={POTUZHNO_LINES} />
            <span
              aria-hidden="true"
              className="self-center text-center font-mono text-3xl text-blue md:rotate-0"
            >
              <span className="md:hidden">↓</span>
              <span className="hidden md:inline">→</span>
            </span>
            <CodePanel label="JavaScript" lines={JAVASCRIPT_LINES} />
          </div>
          <p className="mt-4 font-mono text-sm text-muted">Вивід: [ 10, 20, 30 ]</p>
        </Reveal>
      </div>
    </section>
  );
}
