import { Link } from "waku";
import type { PageProps } from "waku/router";
import { Meta } from "@/components/global/meta";
import { Breadcrumbs, generateBreadcrumbItems } from "@/components/common/breadcrumbs";
import { BreadcrumbSchema } from "@/components/seo/structured-data";
import {
  AdapterNav,
  ASTRO_INTEGRATION_OPTIONS,
  Badge,
  InlineMd,
  InstallCommands,
  NewBadge,
  npmUrl,
  githubPackageUrl,
  OptionsTable,
  Prose,
  REHYPE_OPTIONS,
  Section,
  SHARED_OPTIONS,
  SnippetBlock,
  type Locale,
} from "@/components/packages/tate-chu-yoko/shared";
import langJa from "@private/lang/pages/ja/packages/tate-chu-yoko/astro.json";
import langEn from "@private/lang/pages/en/packages/tate-chu-yoko/astro.json";
import landingJa from "@private/lang/pages/ja/packages/tate-chu-yoko.json";
import landingEn from "@private/lang/pages/en/packages/tate-chu-yoko.json";

const langData = { en: langEn, ja: langJa };
const landingData = { en: landingEn, ja: landingJa };

const PKG = "@love-rox/tcy-astro";

const integrationSnippet = `// astro.config.mjs
import { defineConfig } from "astro/config";
import tcy from "@love-rox/tcy-astro";

export default defineConfig({
  integrations: [tcy()],
});`;

const integrationWithOptionsSnippet = `// astro.config.mjs
import { defineConfig } from "astro/config";
import tcy from "@love-rox/tcy-astro";

export default defineConfig({
  integrations: [
    tcy({
      maxLength: 2,
      excludeWords: ["URL", "API", "2026"],
    }),
  ],
});`;

const componentSnippet = `---
import Tcy from "@love-rox/tcy-astro/Tcy.astro";
---

<p style="writing-mode: vertical-rl">
  <Tcy>第1章 2026年4月、Webの縦書きは進化した。</Tcy>
</p>`;

export default async function TateChuYokoAstroPage({
  lang,
}: PageProps<"/[lang]/packages/tate-chu-yoko/astro">) {
  const locale = (lang as Locale) || "en";
  const content = langData[locale];
  const landing = landingData[locale];
  const url = `/${locale}/packages/tate-chu-yoko/astro`;
  const familyUrl = `/${locale}/packages/tate-chu-yoko`;
  const demoUrl = `/${locale}/packages/tate-chu-yoko/demo`;

  // Combine shared + rehype-passthrough options into one table for the Astro page.
  const sharedAndRehype = [...SHARED_OPTIONS[locale], ...REHYPE_OPTIONS[locale]];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
      <Meta
        title={`${content.hero.heading} - ${content.hero.eyebrow} - Rox`}
        description={content.hero.tagline}
        image={`/api/og?title=${encodeURIComponent(content.hero.heading)}&eyebrow=${encodeURIComponent(content.hero.eyebrow)}`}
        url={url}
        lang={locale}
      />
      <BreadcrumbSchema
        items={generateBreadcrumbItems(
          [
            { label: landing.hero.heading, href: familyUrl },
            { label: content.hero.eyebrow, href: url },
          ],
          locale,
        )}
      />
      <Breadcrumbs
        items={[{ label: landing.hero.heading, href: familyUrl }, { label: content.hero.eyebrow }]}
        lang={locale}
      />

      <div className="max-w-5xl mx-auto">
        <AdapterNav current="astro" locale={locale} />

        <section className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              {content.hero.eyebrow}
            </p>
            {content.hero.isNew ? <NewBadge /> : null}
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-5 font-mono break-all">
            {content.hero.heading}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            {content.hero.tagline}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge>{content.hero.version}</Badge>
            <Badge>MIT</Badge>
            <Badge>astro &gt;= 4</Badge>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to={demoUrl as `/${string}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors"
            >
              {content.hero.ctaDemo}
            </Link>
            <a
              href={npmUrl(PKG)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors"
            >
              {content.hero.ctaNpm}
            </a>
            <a
              href={githubPackageUrl("astro")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors"
            >
              {content.hero.ctaGithub}
            </a>
          </div>
        </section>

        <Section heading={content.install.heading}>
          <Prose>{content.install.description}</Prose>
          <InstallCommands pkg={PKG} />
        </Section>

        <Section heading={content.twoPieces.heading}>
          <div className="grid sm:grid-cols-2 gap-4 mt-2">
            {content.twoPieces.items.map((piece) => (
              <div
                key={piece.name}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5"
              >
                <p className="font-mono text-sm text-primary-700 dark:text-primary-300 mb-2">
                  {piece.name}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <InlineMd text={piece.description} />
                </p>
              </div>
            ))}
          </div>
        </Section>

        <Section heading={content.usage.heading}>
          <Prose>{content.usage.description}</Prose>
          <SnippetBlock
            label={content.usage.integrationLabel}
            code={integrationSnippet}
            language="ts"
          />

          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-3">
            {content.usage.withOptionsHeading}
          </h3>
          <Prose>{content.usage.withOptionsDescription}</Prose>
          <SnippetBlock
            label={content.usage.withOptionsLabel}
            code={integrationWithOptionsSnippet}
            language="ts"
          />

          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-3">
            {content.usage.componentHeading}
          </h3>
          <Prose>{content.usage.componentDescription}</Prose>
          <SnippetBlock
            label={content.usage.componentLabel}
            code={componentSnippet}
            language="astro"
          />
        </Section>

        <Section heading={content.options.heading}>
          <Prose>{content.options.description}</Prose>

          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3">
            {content.options.sharedLabel}
          </h3>
          <OptionsTable columns={content.options.columns} rows={sharedAndRehype} />

          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-3">
            {content.options.integrationLabel}
          </h3>
          <OptionsTable
            columns={content.options.columns}
            rows={ASTRO_INTEGRATION_OPTIONS[locale]}
          />
        </Section>

        <Section heading={content.behavior.heading}>
          <ul className="space-y-2 list-disc list-inside text-slate-700 dark:text-slate-300">
            {content.behavior.items.map((item, i) => (
              <li key={i} className="leading-relaxed">
                <InlineMd text={item} />
              </li>
            ))}
          </ul>
        </Section>

        <Section heading={content.related.heading}>
          <Prose>{content.related.description}</Prose>
        </Section>

        <div className="mt-12 mb-8">
          <Link
            to={familyUrl as `/${string}`}
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            {content.hero.backToFamily}
          </Link>
        </div>
      </div>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
    staticPaths: ["en", "ja"],
  } as const;
};
