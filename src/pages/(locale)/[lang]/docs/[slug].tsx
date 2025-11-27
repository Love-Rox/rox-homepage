import { PageProps } from "waku/router";
import { DocsSidebar } from "@/components/docs/sidebar";
import { loadMarkdownBySlug } from "@/lib/markdown-loader";

// Docs categories and structure
const docsStructure = {
  en: {
    title: "Documentation",
    categories: [
      {
        category: "Getting Started",
        items: [
          { slug: "introduction", title: "Introduction" },
          { slug: "getting-started", title: "Getting Started" },
        ],
      },
      {
        category: "Guides",
        items: [
          { slug: "architecture", title: "Architecture" },
          { slug: "deployment", title: "Deployment" },
          { slug: "configuration", title: "Configuration" },
          { slug: "authentication", title: "Authentication" },
          { slug: "federation", title: "Federation" },
          { slug: "contributing", title: "Contributing" },
        ],
      },
      {
        category: "API",
        items: [
          { slug: "api-overview", title: "API Reference" },
        ],
      },
    ],
  },
  ja: {
    title: "ドキュメント",
    categories: [
      {
        category: "はじめに",
        items: [
          { slug: "introduction", title: "Roxの紹介" },
          { slug: "getting-started", title: "はじめに" },
        ],
      },
      {
        category: "ガイド",
        items: [
          { slug: "architecture", title: "アーキテクチャ" },
          { slug: "deployment", title: "デプロイメント" },
          { slug: "configuration", title: "設定" },
          { slug: "authentication", title: "認証ガイド" },
          { slug: "federation", title: "連合ガイド" },
          { slug: "contributing", title: "コントリビューション" },
        ],
      },
      {
        category: "API",
        items: [
          { slug: "api-overview", title: "APIリファレンス" },
        ],
      },
    ],
  },
};

export default async function DocsPage({
  lang,
  slug,
}: PageProps<"/[lang]/docs/[slug]">) {
  const locale = (lang as 'en' | 'ja') || 'en';
  const content = await loadMarkdownBySlug('docs', slug, locale);
  const structure = docsStructure[locale];

  if (!content) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <title>Not Found - Rox</title>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Page Not Found
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          The requested documentation page could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
      <title>{`${content.metadata.title} - ${structure.title} - Rox`}</title>
      <meta name="description" content={content.metadata.description} />

      <div className="flex gap-8">
        <DocsSidebar
          categories={structure.categories}
          currentSlug={slug}
          lang={lang}
        />

        <article className="flex-1 prose prose-slate dark:prose-invert max-w-none">
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
