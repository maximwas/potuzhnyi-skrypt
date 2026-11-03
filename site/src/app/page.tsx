import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { KalynaDivider } from '@/components/ornaments/kalyna-divider';
import { TowelDivider } from '@/components/ornaments/towel-divider';
import { AboutSection } from '@/features/about/components/about-section';
import { DictionarySection } from '@/features/dictionary/components/dictionary-section';
import { GettingStartedSection } from '@/features/getting-started/components/getting-started-section';
import { Hero } from '@/features/hero/components/hero';
import { PlaygroundSection } from '@/features/playground/components/playground-section';

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <TowelDivider tone="dark" className="bg-deep" />
        <AboutSection />
        <KalynaDivider className="bg-yellow" />
        <PlaygroundSection />
        <TowelDivider tone="dark" className="bg-blue" />
        <DictionarySection />
        <KalynaDivider tone="dark" className="bg-deep" />
        <GettingStartedSection />
      </main>
      <SiteFooter />
    </>
  );
}
