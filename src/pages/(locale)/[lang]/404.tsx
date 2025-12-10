import { Meta } from "@/components/global/meta";
import { Link } from "waku";
import type { PageProps } from "waku/router";

const notFoundData = {
  en: {
    title: "Page Not Found",
    heading: "404",
    message: "Oops! The page you're looking for doesn't exist.",
    description: "The page you're looking for might have been moved or deleted.",
    homeLink: "Back to Home",
    blogLink: "View Blog",
  },
  ja: {
    title: "ページが見つかりません",
    heading: "404",
    message: "お探しのページは見つかりませんでした。",
    description: "お探しのページは移動または削除された可能性があります。",
    homeLink: "ホームに戻る",
    blogLink: "ブログを見る",
  },
};

export default async function NotFoundPage({
  lang,
}: PageProps<"/[lang]/404">) {
  const locale = (lang as "en" | "ja") || "en";
  const data = notFoundData[locale];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <Meta title={`${data.title} - Rox`} description={data.description} />

      <h1 className="text-9xl font-bold text-primary-500 mb-4">
        {data.heading}
      </h1>

      <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
        {data.message}
      </h2>

      <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-md">
        {data.description}
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to={`/${locale}` as `/${string}`}
          className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
        >
          {data.homeLink}
        </Link>
        <Link
          to={`/${locale}/blog` as `/${string}`}
          className="inline-flex items-center justify-center px-6 py-3 border border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-medium rounded-lg transition-colors"
        >
          {data.blogLink}
        </Link>
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
