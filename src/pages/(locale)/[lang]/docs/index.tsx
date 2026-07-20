import { Meta } from "@/components/global/meta";
import { PageProps } from "waku/router";
import { Link } from "waku";

import docs_en from "@private/lang/pages/en/docs.json";
import docs_ja from "@private/lang/pages/ja/docs.json";
import { Breadcrumbs, generateBreadcrumbItems } from "@/components/common/breadcrumbs";
import { BreadcrumbSchema } from "@/components/seo/structured-data";

const docsLangData = {
  en: docs_en,
  ja: docs_ja,
};

export default async function DocsIndexPage({ lang }: PageProps<"/[lang]/docs">) {
  const locale = (lang as keyof typeof docsLangData) || "en";
  const content = docsLangData[locale];

  return (
    // Hallmark 13 Index-First (design.md § Macrostructure family). Was a
    // 2-column grid of shadowed cards per category; now hairline-ruled rows,
    // which is also the shape a docs hub actually wants — scannable titles.
    <div className="mx-auto max-w-5xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
      <Meta
        title={`${content.title} - Rox`}
        description={content.subtitle}
        image={`/api/og?title=${encodeURIComponent(content.title)}`}
        url={`/${locale}/docs`}
        lang={locale}
      />
      <BreadcrumbSchema
        items={generateBreadcrumbItems([{ label: content.title, href: `/${locale}/docs` }], locale)}
      />

      <Breadcrumbs items={[{ label: content.title }]} lang={locale} />

      <header className="border-rule mt-6 border-b pb-10">
        <h1 className="hallmark-display text-ink text-[length:var(--text-display-s)]">
          {content.title}
        </h1>
        <p className="text-ink-2 mt-4 max-w-[52ch] text-lg leading-relaxed">{content.subtitle}</p>
      </header>

      <div className="flex flex-col gap-16 pt-12">
        {content.categories.map((category) => (
          <section key={category.category}>
            <h2 className="hallmark-display text-ink text-xl">{category.category}</h2>
            <p className="text-ink-2 mt-2 max-w-[62ch] leading-relaxed">{category.description}</p>

            <ul className="divide-rule border-rule mt-6 divide-y border-t">
              {category.items.map((item) => (
                <li key={item.slug}>
                  <Link
                    to={`/${lang}/docs/${item.slug}` as `/${string}`}
                    className="group hover:bg-paper-3 -mx-4 block rounded-[var(--radius-card)] px-4 py-5 transition-colors"
                  >
                    <h3 className="text-ink group-hover:text-accent font-display font-bold transition-colors">
                      {item.title}
                      <span
                        aria-hidden="true"
                        className="ml-2 inline-block transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </h3>
                    <p className="text-ink-2 mt-1 max-w-[68ch] text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
