import { Reveal } from '@/components/ui/reveal';

const FEATURES = [
  {
    tag: 'потужно = let',
    title: 'Точна пара',
    text: 'Це звичайний JavaScript без сюрпризів: кожне мемне слово має точну JS-пару.',
    className: '-rotate-2 bg-paper text-ink',
    titleClassName: 'text-red',
  },
  {
    tag: 'node + npm',
    title: 'Ваш Node',
    text: 'Працює з npm-пакетами й Node: код перекладається на льоту, ваші залежності не чіпаються.',
    className: 'rotate-1 bg-blue text-paper',
    titleClassName: 'text-yellow',
  },
  {
    tag: '.potuzhno',
    title: 'VS Code',
    text: 'Є розширення VS Code з підсвіткою, підказками й наведенням на ваші змінні та класи.',
    className: '-rotate-1 bg-paper text-ink',
    titleClassName: 'text-green',
  },
] as const;

export function FeatureStickers() {
  return (
    <ul className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-7 px-4 pt-6 pb-20 sm:px-6 md:grid-cols-3 md:pb-28">
      {FEATURES.map((feature, index) => (
        <li key={feature.title} className="min-w-0">
          <Reveal delay={index * 0.1} className="h-full">
            <article
              className={`sticker flex h-full flex-col gap-3 p-5 transition-transform duration-200 hover:rotate-0 motion-reduce:transition-none ${feature.className}`}
            >
              <p className="font-mono text-xs font-bold opacity-80">{feature.tag}</p>
              <h3
                className={`font-display text-2xl leading-none font-black uppercase ${feature.titleClassName}`}
              >
                {feature.title}
              </h3>
              <p className="text-base leading-snug">{feature.text}</p>
            </article>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
