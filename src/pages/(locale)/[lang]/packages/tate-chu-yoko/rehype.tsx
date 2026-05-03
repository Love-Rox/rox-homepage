import { Link } from "waku";
import type { PageProps } from "waku/router";
import { Meta } from "@/components/global/meta";
import { Breadcrumbs, generateBreadcrumbItems } from "@/components/common/breadcrumbs";
import { BreadcrumbSchema } from "@/components/seo/structured-data";
import {
  AdapterNav,
  Badge,
  InlineMd,
  InstallCommands,
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
import langJa from "@private/lang/pages/ja/packages/tate-chu-yoko/rehype.json";
import langEn from "@private/lang/pages/en/packages/tate-chu-yoko/rehype.json";
import landingJa from "@private/lang/pages/ja/packages/tate-chu-yoko.json";
import landingEn from "@private/lang/pages/en/packages/tate-chu-yoko.json";

const langData = { en: langEn, ja: langJa };
const landingData = { en: landingEn, ja: landingJa };

const PKG = "@love-rox/tcy-rehype";

const markdownSnippet = `import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeTcy from "@love-rox/tcy-rehype";

const html = String(
  await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeTcy)
    .use(rehypeStringify)
    .process("第1章 2026年4月"),
);
// <p>第<span class="tcy">1</span>章 <span class="tcy">2026</span>年<span class="tcy">4</span>月</p>`;

const htmlOnlySnippet = `import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import rehypeTcy from "@love-rox/tcy-rehype";

const html = String(
  await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeTcy)
    .use(rehypeStringify)
    .process("<p>第1章 2026年4月</p>"),
);`;

export default async function TateChuYokoRehypePage({
  lang,
}: PageProps<"/[lang]/packages/tate-chu-yoko/rehype">) {
  const locale = (lang as Locale) || "en";
  const content = langData[locale];
  const landing = landingData[locale];
  const url = `/${locale}/packages/tate-chu-yoko/rehype`;
  const familyUrl = `/${locale}/packages/tate-chu-yoko`;
  const demoUrl = `/${locale}/packages/tate-chu-yoko/demo`;

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
        <AdapterNav current="rehype" locale={locale} />

        <section className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-3">
            {content.hero.eyebrow}
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-5 font-mono break-all">
            {content.hero.heading}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            {content.hero.tagline}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            <Badge>{content.hero.version}</Badge>
            <Badge>MIT</Badge>
            <Badge>build-time</Badge>
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
              href={githubPackageUrl("rehype")}
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

        <Section heading={content.usage.heading}>
          <Prose>{content.usage.description}</Prose>
          <SnippetBlock label={content.usage.snippetLabel} code={markdownSnippet} language="ts" />

          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-3">
            {content.usage.htmlOnlyHeading}
          </h3>
          <Prose>{content.usage.htmlOnlyDescription}</Prose>
          <SnippetBlock label={content.usage.htmlOnlyLabel} code={htmlOnlySnippet} language="ts" />
        </Section>

        <Section heading={content.options.heading}>
          <Prose>{content.options.description}</Prose>

          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3">
            {content.options.sharedLabel}
          </h3>
          <OptionsTable columns={content.options.columns} rows={SHARED_OPTIONS[locale]} />

          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-3">
            {content.options.pluginLabel}
          </h3>
          <OptionsTable columns={content.options.columns} rows={REHYPE_OPTIONS[locale]} />
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
