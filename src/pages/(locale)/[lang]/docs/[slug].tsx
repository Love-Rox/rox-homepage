import { PageProps } from "waku/router";
import { DocsSidebar } from "@/components/docs/sidebar";
import { DocContent } from "@/components/docs/doc-content";

import docsIndex_en from "@content/docs/en/_index.json";
import docsIndex_ja from "@content/docs/ja/_index.json";

// Import all doc files
import introduction_en from "@content/docs/en/introduction.json";
import installation_en from "@content/docs/en/installation.json";
import configuration_en from "@content/docs/en/configuration.json";
import dockerSetup_en from "@content/docs/en/docker-setup.json";
import edgeDeployment_en from "@content/docs/en/edge-deployment.json";
import databaseSetup_en from "@content/docs/en/database-setup.json";
import apiOverview_en from "@content/docs/en/api-overview.json";
import authentication_en from "@content/docs/en/authentication.json";
import endpoints_en from "@content/docs/en/endpoints.json";

import introduction_ja from "@content/docs/ja/introduction.json";
import installation_ja from "@content/docs/ja/installation.json";
import configuration_ja from "@content/docs/ja/configuration.json";
import dockerSetup_ja from "@content/docs/ja/docker-setup.json";
import edgeDeployment_ja from "@content/docs/ja/edge-deployment.json";
import databaseSetup_ja from "@content/docs/ja/database-setup.json";
import apiOverview_ja from "@content/docs/ja/api-overview.json";
import authentication_ja from "@content/docs/ja/authentication.json";
import endpoints_ja from "@content/docs/ja/endpoints.json";

const docsIndexData = {
  en: docsIndex_en,
  ja: docsIndex_ja,
};

type DocPage = {
  slug: string;
  title: string;
  content: string;
  lastUpdated?: string;
};

const docPages: Record<string, Record<string, DocPage>> = {
  en: {
    introduction: introduction_en,
    installation: installation_en,
    configuration: configuration_en,
    "docker-setup": dockerSetup_en,
    "edge-deployment": edgeDeployment_en,
    "database-setup": databaseSetup_en,
    "api-overview": apiOverview_en,
    authentication: authentication_en,
    endpoints: endpoints_en,
  },
  ja: {
    introduction: introduction_ja,
    installation: installation_ja,
    configuration: configuration_ja,
    "docker-setup": dockerSetup_ja,
    "edge-deployment": edgeDeployment_ja,
    "database-setup": databaseSetup_ja,
    "api-overview": apiOverview_ja,
    authentication: authentication_ja,
    endpoints: endpoints_ja,
  },
};

// Build categories with titles for sidebar
function buildCategoriesWithTitles(
  indexData: typeof docsIndex_en,
  pages: Record<string, DocPage>,
) {
  return indexData.categories.map((cat) => ({
    category: cat.category,
    items: cat.items.map((slug) => ({
      slug,
      title: pages[slug]?.title || slug,
    })),
  }));
}

export default async function DocsPage({
  lang,
  slug,
}: PageProps<"/[lang]/docs/[slug]">) {
  const locale = (lang as keyof typeof docsIndexData) || "en";
  const indexData = docsIndexData[locale];
  const pages = docPages[locale] ?? docPages.en;
  const pageData = pages?.[slug];

  if (!pages || !pageData) {
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

  const categoriesWithTitles = buildCategoriesWithTitles(indexData, pages);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <title>{`${pageData.title} - ${indexData.title} - Rox`}</title>

      <div className="flex gap-8">
        <DocsSidebar
          categories={categoriesWithTitles}
          currentSlug={slug}
          lang={lang}
        />
        <DocContent
          title={pageData.title}
          content={pageData.content}
          lastUpdated={pageData.lastUpdated}
        />
      </div>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
