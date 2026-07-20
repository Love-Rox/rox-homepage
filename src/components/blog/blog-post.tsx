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
    // Long Document family (design.md). Measure stays at max-w-3xl — this is
    // reading matter, and the 45–75 character rule governs it.
    <article className="mx-auto max-w-3xl">
      <Link
        to={`/${lang}/blog` as `/${string}`}
        className="text-ink-2 hover:text-accent mb-8 inline-flex min-h-11 items-center gap-2 text-sm whitespace-nowrap transition-colors"
      >
        <span aria-hidden="true">←</span>
        {backLabel}
      </Link>

      <header className="border-rule mb-10 border-b pb-6">
        <div className="text-ink-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
          <time dateTime={date}>{date}</time>
          <span aria-hidden="true" className="bg-rule h-3 w-px" />
          <span>{author}</span>
          {updatedDate && (
            <>
              <span aria-hidden="true" className="bg-rule h-3 w-px" />
              <span className="flex items-baseline gap-1">
                <span>Updated:</span>
                <time dateTime={updatedDate}>{updatedDate}</time>
              </span>
            </>
          )}
        </div>
      </header>

      <MermaidRenderer content={content} />
    </article>
  );
};
