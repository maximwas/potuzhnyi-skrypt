import { HeroPhoto } from '@/features/hero/components/hero-photo';
import { ParallaxLayer } from '@/features/hero/components/parallax-layer';

const BUTTON_BASE =
  'inline-flex min-h-12 items-center justify-center rounded-md px-6 font-mono text-base font-semibold focus-visible:outline-yellow';

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="bg-deep text-paper">
      <div className="mx-auto max-w-6xl py-16 px-4 sm:px-6 lg:py-24">
        <h1
          id="hero-title"
          className="font-serif text-[clamp(2rem,8.5vw,6.5rem)] leading-[1.05] font-extrabold text-yellow"
        >
          ПотужнийСкрипт
        </h1>
        <div className="mt-10 grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div>
            <p className="max-w-[34ch] text-xl leading-snug">
              JavaScript, у якому <code className="font-mono text-yellow">let</code> зветься
              «потужно», а код читається як вечірні новини.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="#sprobuj" className={`${BUTTON_BASE} bg-yellow text-ink hover:bg-paper`}>
                Спробувати в браузері
              </a>
              <a
                href="#start"
                className={`${BUTTON_BASE} border-2 border-paper text-paper hover:bg-paper hover:text-deep`}
              >
                Як почати
              </a>
            </div>
          </div>

          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-16 lg:mx-0 lg:grid lg:grid-cols-6 lg:overflow-visible lg:px-0">
            <ParallaxLayer
              speed={30}
              className="w-[80%] shrink-0 snap-start lg:col-span-4 lg:w-auto"
            >
              <HeroPhoto file="kyiv-dnipro-dawn.jpg" aspectClassName="aspect-[3/2]" isPriority />
            </ParallaxLayer>
            <ParallaxLayer
              speed={70}
              className="w-[80%] shrink-0 snap-start lg:col-span-2 lg:w-auto"
            >
              <HeroPhoto file="kyiv-sophia.jpg" aspectClassName="aspect-[3/4]" />
            </ParallaxLayer>
            <ParallaxLayer
              speed={45}
              className="w-[60%] shrink-0 snap-start lg:col-span-2 lg:w-auto"
            >
              <HeroPhoto file="zelensky-portrait-1.jpg" aspectClassName="aspect-[3/4]" />
            </ParallaxLayer>
            <ParallaxLayer
              speed={20}
              className="w-[60%] shrink-0 snap-start lg:col-span-2 lg:w-auto"
            >
              <HeroPhoto file="politician-klitschko.jpg" aspectClassName="aspect-[3/4]" />
            </ParallaxLayer>
            <ParallaxLayer
              speed={60}
              className="w-[60%] shrink-0 snap-start lg:col-span-2 lg:w-auto"
            >
              <HeroPhoto file="politician-poroshenko.jpg" aspectClassName="aspect-[3/4]" />
            </ParallaxLayer>
          </div>
        </div>
      </div>
    </section>
  );
}
