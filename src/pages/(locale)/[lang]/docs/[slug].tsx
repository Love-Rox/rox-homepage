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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Meta
          title="Not Found - Rox"
          description="The requested documentation page could not be found."
          url={`/${locale}/docs/${slug}`}
          lang={locale}
        />
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Page Not Found
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          The requested documentation page could not be found.
        </p>
      </div>
    );
  }

  const ogUrl = `/api/og?title=${encodeURIComponent(content.metadata.title)}`;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
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

      <div className="flex flex-col lg:flex-row gap-8">
        <DocsSidebar categories={structure.categories} currentSlug={slug} lang={locale} />

        <article className="flex-1 prose prose-slate dark:prose-invert max-w-none min-w-0">
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400 mb-4">
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
