import { Link } from "waku";
import { PageProps } from "waku/router";

import docsIndex_en from "@content/docs/en/_index.json";
import docsIndex_ja from "@content/docs/ja/_index.json";

// Import all doc files for title lookup
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

const docPages = {
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

export default async function DocsIndexPage({
  lang,
}: PageProps<"/[lang]/docs">) {
  const locale = (lang as keyof typeof docsIndexData) || "en";
  const data = docsIndexData[locale];
  const pages = docPages[locale];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <title>{`${data.title} - Rox`}</title>
      <meta name="description" content={data.description} />

      <header className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          {data.title}
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">
          {data.description}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.categories.map((category) => (
          <div
            key={category.category}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700"
          >
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              {category.category}
            </h2>
            <ul className="space-y-2">
              {category.items.map((slug) => {
                const page = pages[slug as keyof typeof pages];
                return (
                  <li key={slug}>
                    <Link
                      to={`/${lang}/docs/${slug}` as `/${string}`}
                      className="text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      {page?.title || slug}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
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
