import { Meta } from "@/components/global/meta";

import { PageProps } from "waku/router";
import { loadMarkdownBySlug } from "@/lib/markdown-loader";
import { DocsSidebar } from "@/components/docs/sidebar";
import docs_en from "@private/lang/pages/en/docs.json";
import docs_ja from "@private/lang/pages/ja/docs.json";
import { Breadcrumbs, generateBreadcrumbItems } from "@/components/common/breadcrumbs";
import {
  BreadcrumbSchema,
  TechArticleSchema,
  FAQPageSchema,
  HowToSchema,
} from "@/components/seo/structured-data";

const docsStructure = {
  en: docs_en,
  ja: docs_ja,
};

export default async function DocsPage({ lang, slug }: PageProps<"/[lang]/docs/[slug]">) {
  const locale = (lang as "en" | "ja") || "en";
  const content = await loadMarkdownBySlug("docs", slug || "", locale);
  const structure = docsStructure[locale];

  if (!content) {
    return (
      // pt-32 clears the fixed header — this fallback was missing the top
      // padding the success branch had, so it rendered under the nav.
      <div className="mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
        <Meta
          title="Not Found - Rox"
          description="The requested documentation page could not be found."
          url={`/${locale}/docs/${slug}`}
          lang={locale}
        />
        <h1 className="hallmark-display text-ink text-[length:var(--text-display-s)]">
          Page Not Found
        </h1>
        <p className="text-ink-2 mt-4 max-w-[52ch] text-lg leading-relaxed">
          The requested documentation page could not be found.
        </p>
      </div>
    );
  }

  const ogParams = new URLSearchParams({ title: content.metadata.title });
  ogParams.set("eyebrow", `${structure.title} · ${locale.toUpperCase()}`);
  if (content.metadata.author) ogParams.set("author", content.metadata.author);
  const ogUrl = `/api/og?${ogParams.toString()}`;

  return (
    <div className="mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
      <Meta
        title={`${content.metadata.title} - ${structure.title} - Rox`}
        description={content.metadata.description || ""}
        image={ogUrl}
        url={`/${locale}/docs/${slug}`}
        lang={locale}
      />
      <BreadcrumbSchema
        items={generateBreadcrumbItems(
          [
            { label: structure.title, href: `/${locale}/docs` },
            { label: content.metadata.title, href: `/${locale}/docs/${slug}` },
          ],
          locale,
        )}
      />
      <TechArticleSchema
        title={content.metadata.title}
        description={content.metadata.description || ""}
        url={`/${locale}/docs/${slug}`}
        {...(content.metadata.date && { datePublished: content.metadata.date })}
        {...(content.metadata.updated && { dateModified: content.metadata.updated })}
      />
      {content.metadata.faq && <FAQPageSchema faq={content.metadata.faq} />}
      {content.metadata.howto && <HowToSchema howto={content.metadata.howto} />}

      <Breadcrumbs
        items={[
          { label: structure.title, href: `/${locale}/docs` },
          { label: content.metadata.title },
        ]}
        lang={locale}
      />

      <div className="mt-6 flex flex-col gap-10 lg:flex-row">
        <DocsSidebar categories={structure.categories} currentSlug={slug} lang={locale} />

        {/* Long Document family (design.md). `prose-slate` dropped — the
            prose palette is bound to the design tokens in styles.css, so the
            article body no longer renders in cool greys on warm paper. */}
        <article className="prose dark:prose-invert min-w-0 max-w-none flex-1">
          <div className="text-ink-2 border-rule mb-8 flex flex-wrap gap-x-4 gap-y-1 border-b pb-4 text-sm">
            {content.metadata.date && (
              <time dateTime={content.metadata.date}>
                {new Date(content.metadata.date).toLocaleDateString(locale, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
            {content.metadata.updated && (
              <span className="flex items-center gap-1">
                <span>•</span>
                <span>Updated:</span>
                <time dateTime={content.metadata.updated}>
                  {new Date(content.metadata.updated).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </span>
            )}
          </div>
          <div dangerouslySetInnerHTML={{ __html: content.html }} />
        </article>
      </div>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
