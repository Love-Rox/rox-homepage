import { Link } from "waku";
import { MermaidRenderer } from "@/components/common/mermaid-renderer";

interface BlogPostProps {
  content: string;
  date: string;
  updatedDate?: string | undefined;
  author: string;
  lang: string;
  backLabel: string;
}

export const BlogPost = ({
  content,
  date,
  updatedDate,
  author,
  lang,
  backLabel,
}: BlogPostProps) => {
  return (
    <article className="max-w-3xl mx-auto">
      <Link
        to={`/${lang}/blog` as `/${string}`}
        className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline mb-8"
      >
        {backLabel}
      </Link>

      <header className="mb-8">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
          <time dateTime={date}>{date}</time>
          {updatedDate && (
            <span className="flex items-center gap-1">
              <span>•</span>
              <span>Updated:</span>
              <time dateTime={updatedDate}>{updatedDate}</time>
            </span>
          )}
        </div>
        <p className="text-slate-600 dark:text-slate-300 mt-2">By {author}</p>
      </header>

      <MermaidRenderer content={content} />
    </article>
  );
};
