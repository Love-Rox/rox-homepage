import { Hero } from '@/components/home/hero';
import hero_en from '@private/lang/components/home/en/hero.json';

const heroLangData = {
  en: hero_en,
};

export default async function HomePage() {
  const locale = 'en' as keyof typeof heroLangData;

  return (
    <div>
      <title>{heroLangData[locale].title}</title>
      <meta name="description" content={heroLangData[locale].description} />
      <Hero {...heroLangData[locale]} />
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
