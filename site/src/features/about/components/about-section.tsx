import { FeatureStickers } from '@/features/about/components/feature-stickers';
import { ScrollTranslator } from '@/features/about/components/scroll-translator';

export function AboutSection() {
  return (
    <section id="pro" aria-labelledby="about-title" className="halftone bg-yellow scroll-mt-24">
      <ScrollTranslator />
      <FeatureStickers />
    </section>
  );
}
