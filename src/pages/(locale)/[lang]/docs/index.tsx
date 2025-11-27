import { PageProps } from "waku/router";
import { Link } from "waku";
import docsLangEn from '@private/lang/pages/en/docs.json';
import docsLangJa from '@private/lang/pages/ja/docs.json';

const docsLangData = {
  en: docsLangEn,
  ja: docsLangJa,
};

export default async function DocsIndexPage({ lang }: PageProps<"/[lang]/docs">) {
  const locale = (lang as keyof typeof docsLangData) || 'en';
  const content = docsLangData[locale];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
      <title>{`${content.title} - Rox`}</title>
      <meta name="description" content={content.subtitle} />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 break-words">
          {content.title}
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 mb-12">
          {content.subtitle}
        </p>

        <div className="space-y-12">
          {content.categories.map((category) => (
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
