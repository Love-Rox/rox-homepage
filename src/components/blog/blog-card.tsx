import { Link } from 'waku';

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  lang: string;
}

export const BlogCard = ({ slug, title, excerpt, date, author, lang }: BlogCardProps) => {
  return (
    <article className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
      <Link
        to={`/${lang}/blog/${slug}` as `/${string}`}
        className="block group"
      >
        <time className="text-sm text-slate-500 dark:text-slate-400">
          {date}
        </time>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-2 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {title}
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-3">
          {excerpt}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          By {author}
        </p>
      </Link>
    </article>
  );
};
