import { Link } from 'waku';
import { MermaidRenderer } from '@/components/common/mermaid-renderer';

interface BlogPostProps {
  content: string;
  date: string;
  author: string;
  lang: string;
  backLabel: string;
}

export const BlogPost = ({ content, date, author, lang, backLabel }: BlogPostProps) => {
  return (
    <article className="max-w-3xl mx-auto">
      <Link
        to={`/${lang}/blog` as `/${string}`}
        className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline mb-8"
      >
        {backLabel}
      </Link>

      <header className="mb-8">
        <time className="text-sm text-slate-500 dark:text-slate-400">
          {date}
        </time>
        <p className="text-slate-600 dark:text-slate-300 mt-2">
          By {author}
        </p>
      </header>

      <MermaidRenderer content={content} />
    </article>
  );
};
