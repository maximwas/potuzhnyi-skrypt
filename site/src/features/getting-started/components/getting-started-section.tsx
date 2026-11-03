import { Reveal } from '@/components/ui/reveal';

import { CodeBlock } from './code-block.tsx';

const cardClass = 'flex flex-col gap-4 rounded-lg border border-ink/20 bg-paper-2 p-6';
const codeInline = 'rounded bg-paper px-1.5 py-0.5 font-mono text-sm text-ink';

export function GettingStartedSection() {
  return (
    <section id="start" aria-labelledby="start-heading" className="scroll-mt-20 bg-paper py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="start-heading" className="font-serif text-4xl font-extrabold text-ink sm:text-5xl">
          Як почати
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Поки що нічого не опубліковано ні в npm, ні в Marketplace, а репозиторій приватний. Тож
          усе збирається з репозиторію потужного скрипта вручну.
        </p>

        <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2">
          <Reveal>
            <article className={cardClass}>
              <h3 className="font-serif text-2xl font-bold text-ink">Командний рядок</h3>
              <p>
                Потрібен Node.js не нижче <span className={codeInline}>26.2</span>: він сам прибирає
                типи з TypeScript, тож збірки немає. Склонуйте репозиторій потужного скрипта,
                зайдіть у його теку й запустіть приклад:
              </p>
              <CodeBlock
                label="термінал"
                lines={['npm ci', 'node bin/potuzhno.ts examples/бюджет.potuzhno']}
              />
              <p className="text-muted">
                Файли з мемними словами мають розширення{' '}
                <span className={codeInline}>.potuzhno</span>. Перекладач замінює мемні слова на
                JavaScript і одразу виконує файл.
              </p>
            </article>
          </Reveal>

          <Reveal delay={0.1}>
            <article className={cardClass}>
              <h3 className="font-serif text-2xl font-bold text-ink">Розширення для VS Code</h3>
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
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
