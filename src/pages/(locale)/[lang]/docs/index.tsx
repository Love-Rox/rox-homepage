import { PageProps } from "waku/router";
import { Link } from "waku";

const docsIndex = {
  en: {
    title: "Documentation",
    subtitle: "Everything you need to know about Rox",
    categories: [
      {
        category: "Getting Started",
        description: "Learn the basics and get Rox running",
        items: [
          {
            slug: "introduction",
            title: "Introduction",
            description: "Learn about Rox and its features",
          },
          {
            slug: "getting-started",
            title: "Getting Started",
            description: "Set up Rox locally in minutes",
          },
        ],
      },
      {
        category: "Guides",
        description: "In-depth guides for deploying and configuring Rox",
        items: [
          {
            slug: "architecture",
            title: "Architecture",
            description: "Understand Rox's architecture and design patterns",
          },
          {
            slug: "deployment",
            title: "Deployment",
            description: "Deploy Rox to production environments",
          },
          {
            slug: "configuration",
            title: "Configuration",
            description: "Configure Rox for your needs",
          },
          {
            slug: "authentication",
            title: "Authentication",
            description: "Learn about Passkeys and Password support",
          },
          {
            slug: "federation",
            title: "Federation",
            description: "How Rox connects with the Fediverse",
          },
          {
            slug: "contributing",
            title: "Contributing",
            description: "How to contribute to Rox development",
          },
        ],
      },
      {
        category: "API",
        description: "API reference and integration guides",
        items: [
          {
            slug: "api-overview",
            title: "API Reference",
            description: "Complete Misskey-compatible API reference",
          },
        ],
      },
    ],
  },
  ja: {
    title: "ドキュメント",
    subtitle: "Roxについて知る必要のあるすべて",
    categories: [
      {
        category: "はじめに",
        description: "基本を学び、Roxを起動する",
        items: [
          {
            slug: "introduction",
            title: "Roxの紹介",
            description: "Roxとその機能について学ぶ",
          },
          {
            slug: "getting-started",
            title: "はじめに",
            description: "数分でRoxをローカルにセットアップ",
          },
        ],
      },
      {
        category: "ガイド",
        description: "Roxのデプロイと設定に関する詳細ガイド",
        items: [
          {
            slug: "architecture",
            title: "アーキテクチャ",
            description: "Roxのアーキテクチャと設計パターンを理解",
          },
          {
            slug: "deployment",
            title: "デプロイメント",
            description: "Roxを本番環境にデプロイ",
          },
          {
            slug: "configuration",
            title: "設定",
            description: "ニーズに合わせてRoxを設定",
          },
          {
            slug: "authentication",
            title: "認証ガイド",
            description: "パスキーとパスワードサポートについて学ぶ",
          },
          {
            slug: "federation",
            title: "連合ガイド",
            description: "RoxがFediverseとどのようにつながるか",
          },
          {
            slug: "contributing",
            title: "コントリビューション",
            description: "Roxの開発に貢献する方法",
          },
        ],
      },
      {
        category: "API",
        description: "APIリファレンスと統合ガイド",
        items: [
          {
            slug: "api-overview",
            title: "APIリファレンス",
            description: "完全なMisskey互換APIリファレンス",
          },
        ],
      },
    ],
  },
};

export default async function DocsIndexPage({ lang }: PageProps<"/[lang]/docs">) {
  const locale = (lang as 'en' | 'ja') || 'en';
  const index = docsIndex[locale];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
      <title>{`${index.title} - Rox`}</title>
      <meta name="description" content={index.subtitle} />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
          {index.title}
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 mb-12">
          {index.subtitle}
        </p>

        <div className="space-y-12">
          {index.categories.map((category) => (
            <div key={category.category}>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {category.category}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                {category.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {category.items.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/${lang}/docs/${item.slug}` as `/${string}`}
                    className="block bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-slate-200 dark:border-slate-700 group hover:border-primary-500 dark:hover:border-primary-400"
                  >
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
