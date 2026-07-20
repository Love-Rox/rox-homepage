import { AssetCard } from "@/components/assets/AssetCard";
import assetsLangJa from "@private/lang/pages/ja/assets.json";
import assetsLangEn from "@private/lang/pages/en/assets.json";
import { PageProps } from "waku/router";
import { Breadcrumbs, generateBreadcrumbItems } from "@/components/common/breadcrumbs";
import { BreadcrumbSchema } from "@/components/seo/structured-data";

const assetsLangData = {
  en: assetsLangEn,
  ja: assetsLangJa,
};

export default async function AssetsPage({ lang }: PageProps<"/[lang]/assets">) {
  const locale = (lang as keyof typeof assetsLangData) || "en";
  const content = assetsLangData[locale];

  const assets = [
    {
      name: "rox-horizontal",
      title: content.logoTypes.horizontal,
      formats: {
        svg: "/assets/logos/svg/rox-horizontal.svg",
        png: "/assets/logos/png/rox-horizontal.png",
        png2x: "/assets/logos/png/rox-horizontal@2x.png",
        jpg: "/assets/logos/jpg/rox-horizontal.jpg",
        jpg2x: "/assets/logos/jpg/rox-horizontal@2x.jpg",
      },
    },
    {
      name: "rox-horizontal-white",
      title: content.logoTypes.horizontalWhite,
      formats: {
        svg: "/assets/logos/svg/rox-horizontal-white.svg",
        png: "/assets/logos/png/rox-horizontal-white.png",
        png2x: "/assets/logos/png/rox-horizontal-white@2x.png",
        jpg: "/assets/logos/jpg/rox-horizontal-white.jpg",
        jpg2x: "/assets/logos/jpg/rox-horizontal-white@2x.jpg",
      },
    },
    {
      name: "rox-icon",
      title: content.logoTypes.icon,
      formats: {
        svg: "/assets/logos/svg/rox-icon.svg",
        png: "/assets/logos/png/rox-icon.png",
        png2x: "/assets/logos/png/rox-icon@2x.png",
        jpg: "/assets/logos/jpg/rox-icon.jpg",
        jpg2x: "/assets/logos/jpg/rox-icon@2x.jpg",
      },
    },
    {
      name: "rox-icon-full",
      title: content.logoTypes.iconFull,
      formats: {
        svg: "/assets/logos/svg/rox-icon-full.svg",
        png: "/assets/logos/png/rox-icon-full.png",
        png2x: "/assets/logos/png/rox-icon-full@2x.png",
        jpg: "/assets/logos/jpg/rox-icon-full.jpg",
        jpg2x: "/assets/logos/jpg/rox-icon-full@2x.jpg",
      },
    },
    {
      name: "rox-icon-sq",
      title: content.logoTypes.iconSq,
      formats: {
        svg: "/assets/logos/svg/rox-icon-sq.svg",
        png: "/assets/logos/png/rox-icon-sq.png",
        png2x: "/assets/logos/png/rox-icon-sq@2x.png",
        jpg: "/assets/logos/jpg/rox-icon-sq.jpg",
        jpg2x: "/assets/logos/jpg/rox-icon-sq@2x.jpg",
      },
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 pt-32 pb-8 sm:px-6 lg:px-8">
      <title>{content.title}</title>
      <meta name="description" content={content.subtitle} />
      <BreadcrumbSchema
        items={generateBreadcrumbItems(
          [{ label: content.heading, href: `/${locale}/assets` }],
          locale,
        )}
      />

      <div className="mx-auto max-w-6xl">
        <Breadcrumbs items={[{ label: content.heading }]} lang={locale} />

        {/* Header — left-aligned. A brand-asset page is a reference index, and
            centred headers gave it a marketing voice it doesn't want. */}
        <header className="border-rule mt-6 border-b pb-10">
          <h1 className="hallmark-display text-ink text-[length:var(--text-display-s)]">
            {content.heading}
          </h1>
          <p className="text-ink-2 mt-4 max-w-[52ch] text-lg leading-relaxed">{content.subtitle}</p>
          <p className="text-ink-2 mt-2 max-w-[62ch] text-sm leading-relaxed">
            {content.description}
          </p>
        </header>

        {/* Logos Section */}
        <section className="pt-12 pb-16">
          <h2 className="hallmark-display text-ink mb-8 text-xl">{content.sections.logos}</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[repeat(2,minmax(0,1fr))]">
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

        {/* Usage Guidelines Section.
            The ✓/✗ glyphs matter: green/red alone would make this the only
            place on the site where colour is the sole carrier of meaning,
            which fails for red-green colour blindness. Keep both signals. */}
        <section className="pb-16">
          <h2 className="hallmark-display text-ink mb-8 text-xl">{content.sections.usage}</h2>
          <div className="border-rule bg-paper-2 rounded-[var(--radius-card)] border p-8">
            <p className="text-ink-2 mb-8 max-w-[68ch] leading-relaxed">
              {content.usageGuidelines.intro}
            </p>

            <div className="grid gap-10 md:grid-cols-[repeat(2,minmax(0,1fr))]">
              {[
                {
                  glyph: "✓",
                  tone: "text-green-700 dark:text-green-400",
                  group: content.usageGuidelines.dos,
                },
                {
                  glyph: "✗",
                  tone: "text-red-700 dark:text-red-400",
                  group: content.usageGuidelines.donts,
                },
              ].map(({ glyph, tone, group }) => (
                <div key={group.title} className="min-w-0">
                  <h3 className={`font-display flex items-baseline gap-2 font-bold ${tone}`}>
                    <span aria-hidden="true">{glyph}</span>
                    <span className="min-w-0">{group.title}</span>
                  </h3>
                  <ul className="divide-rule border-rule mt-4 divide-y border-t">
                    {group.items.map((item) => (
                      <li key={item} className="text-ink-2 flex gap-2 py-3 text-sm leading-relaxed">
                        <span aria-hidden="true" className={`shrink-0 ${tone}`}>
                          {glyph}
                        </span>
                        <span className="min-w-0">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
