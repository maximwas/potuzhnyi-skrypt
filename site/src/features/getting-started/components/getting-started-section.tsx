import { CodeBlock } from './code-block.tsx';
import { StepCard } from './step-card.tsx';

const codeInline =
  'rounded border-2 border-ink bg-yellow px-1.5 py-0.5 font-mono text-sm font-bold text-ink';

export function GettingStartedSection() {
  return (
    <section id="start" aria-labelledby="start-heading" className="halftone bg-paper scroll-mt-24">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <h2
          id="start-heading"
          className="font-display text-ink text-[clamp(2.25rem,7vw,5rem)] leading-[0.95] font-black uppercase"
        >
          Як <span className="bg-blue text-paper inline-block rotate-2 px-3 py-1">почати</span>
        </h2>
        <p className="text-ink mt-6 max-w-2xl text-lg">
          Поки що нічого не опубліковано ні в npm, ні в Marketplace. Тож усе збирається вручну з{' '}
          <a
            href="https://github.com/maximwas/potuzhnyi-skrypt"
            className="hover:bg-yellow font-bold underline decoration-2 underline-offset-4"
          >
            репозиторію на GitHub
          </a>
          .
        </p>

        <ol className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-12">
          <StepCard number="01" title="Командний рядок" tiltClassName="-rotate-3">
            <p>
              Потрібен Node.js не нижче <span className={codeInline}>26.2</span>: він сам прибирає
              типи з TypeScript, тож збірки немає. Склонуйте репозиторій потужного скрипта, зайдіть
              у його теку й запустіть приклад:
            </p>
            <CodeBlock
              label="термінал"
              lines={['npm ci', 'node bin/potuzhno.ts examples/бюджет.potuzhno']}
            />
          </StepCard>

          <StepCard number="02" title="Файли .potuzhno" tiltClassName="rotate-2">
            <p>
              Файли з мемними словами мають розширення <span className={codeInline}>.potuzhno</span>
              . Перекладач замінює мемні слова на JavaScript і одразу виконує файл.
            </p>
          </StepCard>

          <StepCard number="03" title="Розширення для VS Code" tiltClassName="-rotate-2">
            <p>
              Спершу виконайте <span className={codeInline}>npm ci</span> у корені репозиторію,
              потім зберіть і встановіть розширення:
            </p>
            <CodeBlock
              label="термінал"
              lines={[
                'cd editors/vscode',
                'npm ci',
                'npm run package',
                'code --install-extension potuzhno-syntax-0.1.0.vsix',
              ]}
            />
            <ul className="list-disc space-y-1 pl-5">
              <li>підсвітка мемних слів у файлах .potuzhno;</li>
              <li>зелена іконка «Зе» для таких файлів у провіднику;</li>
              <li>підказки мемних слів під час набору, з JS-відповідником;</li>
              <li>підказка при наведенні на ваші змінні, класи, методи й функції.</li>
            </ul>
          </StepCard>
        </ol>

        <div className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-4">
          <p className="font-display text-ink text-xl leading-tight font-black uppercase sm:text-2xl">
            Нічого ставити не хочеться?
          </p>
          <a
            href="#sprobuj"
            className="bg-yellow text-ink border-ink inline-flex min-h-11 items-center rounded-lg border-[3px] px-5 font-mono text-sm font-bold shadow-[5px_5px_0_var(--color-ink)] transition-[transform,box-shadow] duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_var(--color-ink)] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none motion-reduce:transition-none"
          >
            Спробуй у пісочниці
          </a>
        </div>
      </div>
    </section>
  );
}
