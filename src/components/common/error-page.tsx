'use client';

import { Meta } from "@/components/global/meta";
import { Link } from "waku";

const errorData = {
  en: {
    title: "Something Went Wrong",
    heading: "Error",
    message: "An unexpected error occurred.",
    description: "We're sorry, but something went wrong. Please try again later.",
    homeLink: "Back to Home",
    retryLabel: "Try Again",
  },
  ja: {
    title: "エラーが発生しました",
    heading: "エラー",
    message: "予期しないエラーが発生しました。",
    description: "申し訳ありませんが、問題が発生しました。後ほど再度お試しください。",
    homeLink: "ホームに戻る",
    retryLabel: "再試行",
  },
};

interface ErrorPageProps {
  lang?: string;
  error?: Error;
  reset?: () => void;
}

export default function ErrorPage({ lang = "en", error, reset }: ErrorPageProps) {
  const locale = (lang as "en" | "ja") || "en";
  const data = errorData[locale];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <Meta title={`${data.title} - Rox`} description={data.description} />

      <div className="mb-8">
        <svg
          className="w-24 h-24 text-primary-500 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
        {data.heading}
      </h1>

      <h2 className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-4">
        {data.message}
      </h2>

      <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md">
        {data.description}
      </p>

      {error && (
        <pre className="mb-8 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-left overflow-auto max-w-full">
          <code className="text-red-600 dark:text-red-400">{error.message}</code>
        </pre>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        {reset && (
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
          >
            {data.retryLabel}
          </button>
        )}
        <Link
          to={`/${locale}` as `/${string}`}
          className="inline-flex items-center justify-center px-6 py-3 border border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-medium rounded-lg transition-colors"
        >
          {data.homeLink}
        </Link>
      </div>
    </div>
  );
}
