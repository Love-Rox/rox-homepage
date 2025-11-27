import { AssetCard } from '@/components/assets/AssetCard';
import assetsLangJa from '@private/lang/pages/ja/assets.json';
import assetsLangEn from '@private/lang/pages/en/assets.json';
import { PageProps } from 'waku/router';

const assetsLangData = {
  en: assetsLangEn,
  ja: assetsLangJa,
};

export default async function AssetsPage({ lang }: PageProps<'/[lang]/assets'>) {
  const locale = (lang as keyof typeof assetsLangData) || 'en';
  const content = assetsLangData[locale];

  const assets = [
    {
      name: 'rox-horizontal',
      title: content.logoTypes.horizontal,
      formats: {
        svg: '/assets/logos/svg/rox-horizontal.svg',
        png: '/assets/logos/png/rox-horizontal.png',
        png2x: '/assets/logos/png/rox-horizontal@2x.png',
        jpg: '/assets/logos/jpg/rox-horizontal.jpg',
        jpg2x: '/assets/logos/jpg/rox-horizontal@2x.jpg',
      },
    },
    {
      name: 'rox-horizontal-white',
      title: content.logoTypes.horizontalWhite,
      formats: {
        svg: '/assets/logos/svg/rox-horizontal-white.svg',
        png: '/assets/logos/png/rox-horizontal-white.png',
        png2x: '/assets/logos/png/rox-horizontal-white@2x.png',
        jpg: '/assets/logos/jpg/rox-horizontal-white.jpg',
        jpg2x: '/assets/logos/jpg/rox-horizontal-white@2x.jpg',
      },
    },
    {
      name: 'rox-icon',
      title: content.logoTypes.icon,
      formats: {
        svg: '/assets/logos/svg/rox-icon.svg',
        png: '/assets/logos/png/rox-icon.png',
        png2x: '/assets/logos/png/rox-icon@2x.png',
        jpg: '/assets/logos/jpg/rox-icon.jpg',
        jpg2x: '/assets/logos/jpg/rox-icon@2x.jpg',
      },
    },
    {
      name: 'rox-icon-full',
      title: content.logoTypes.iconFull,
      formats: {
        svg: '/assets/logos/svg/rox-icon-full.svg',
        png: '/assets/logos/png/rox-icon-full.png',
        png2x: '/assets/logos/png/rox-icon-full@2x.png',
        jpg: '/assets/logos/jpg/rox-icon-full.jpg',
        jpg2x: '/assets/logos/jpg/rox-icon-full@2x.jpg',
      },
    },
    {
      name: 'rox-icon-sq',
      title: content.logoTypes.iconSq,
      formats: {
        svg: '/assets/logos/svg/rox-icon-sq.svg',
        png: '/assets/logos/png/rox-icon-sq.png',
        png2x: '/assets/logos/png/rox-icon-sq@2x.png',
        jpg: '/assets/logos/jpg/rox-icon-sq.jpg',
        jpg2x: '/assets/logos/jpg/rox-icon-sq@2x.jpg',
      },
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
      <title>{content.title}</title>
      <meta name="description" content={content.subtitle} />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
            {content.heading}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-2">
            {content.subtitle}
          </p>
          <p className="text-slate-600 dark:text-slate-400">
            {content.description}
          </p>
        </div>

        {/* Logos Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">
            {content.sections.logos}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assets.map((asset) => (
              <AssetCard
                key={asset.name}
                name={asset.name}
                title={asset.title}
                formats={asset.formats}
                formatLabels={content.formats}
                previewLabel={content.preview}
                lightLabel={content.lightBg}
                darkLabel={content.darkBg}
              />
            ))}
          </div>
        </section>

        {/* Usage Guidelines Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-8">
            {content.sections.usage}
          </h2>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              {content.usageGuidelines.intro}
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Do's */}
              <div>
                <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-4">
                  ✓ {content.usageGuidelines.dos.title}
                </h3>
                <ul className="space-y-2">
                  {content.usageGuidelines.dos.items.map((item, index) => (
                    <li
                      key={index}
                      className="text-slate-600 dark:text-slate-300 flex items-start"
                    >
                      <span className="text-green-600 dark:text-green-400 mr-2">
                        •
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Don'ts */}
              <div>
                <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
                  ✗ {content.usageGuidelines.donts.title}
                </h3>
                <ul className="space-y-2">
                  {content.usageGuidelines.donts.items.map((item, index) => (
                    <li
                      key={index}
                      className="text-slate-600 dark:text-slate-300 flex items-start"
                    >
                      <span className="text-red-600 dark:text-red-400 mr-2">
                        •
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const;
};
