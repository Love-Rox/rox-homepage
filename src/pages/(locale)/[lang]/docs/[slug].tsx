import { Meta } from "@/components/global/meta";

import { PageProps } from "waku/router";
import { loadMarkdownBySlug } from "@/lib/markdown-loader";
import { DocsSidebar } from "@/components/docs/sidebar";
import docs_en from "@private/lang/pages/en/docs.json";
import docs_ja from "@private/lang/pages/ja/docs.json";

const docsStructure = {
  en: docs_en,
  ja: docs_ja,
};

export default async function DocsPage({
  lang,
  slug,
}: PageProps<"/[lang]/docs/[slug]">) {
  const locale = (lang as 'en' | 'ja') || 'en';
  const content = await loadMarkdownBySlug('docs', slug || '', locale);
  const structure = docsStructure[locale];

  if (!content) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Meta
          title="Not Found - Rox"
          description="The requested documentation page could not be found."
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
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <DocsSidebar
          categories={structure.categories}
          currentSlug={slug}
          lang={locale}
        />

        <article className="flex-1 prose prose-slate dark:prose-invert max-w-none min-w-0">
          {content.metadata.date && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              {new Date(content.metadata.date).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
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
