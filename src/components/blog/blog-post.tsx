import { Link } from 'waku';

interface BlogPostProps {
  title: string;
  content: string;
  date: string;
  author: string;
  lang: string;
  backLabel: string;
}

export const BlogPost = ({ title, content, date, author, lang, backLabel }: BlogPostProps) => {
  return (
    <article className="max-w-3xl mx-auto">
      <Link
        to={`/${lang}/blog` as `/${string}`}
        className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline mb-8"
      >
        <span className="mr-1">&larr;</span>
        {backLabel}
      </Link>

      <header className="mb-8">
        <time className="text-sm text-slate-500 dark:text-slate-400">
          {date}
        </time>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mt-2 mb-4">
          {title}
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          By {author}
        </p>
      </header>

      {/* TODO: Replace with proper markdown rendering */}
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            This is a placeholder page. Blog content will be added here.
          </p>
        </div>
        <div className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </article>
  );
};
