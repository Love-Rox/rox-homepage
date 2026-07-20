import { Meta } from "@/components/global/meta";
import { PageProps } from "waku/router";
import { Link } from "waku";
import { getAllSlugs, loadMarkdownBySlug } from "@/lib/markdown-loader";
import { Breadcrumbs, generateBreadcrumbItems } from "@/components/common/breadcrumbs";
import { BreadcrumbSchema } from "@/components/seo/structured-data";

const blogIndexData = {
  en: {
    title: "Blog",
    description: "Latest updates and insights from the Rox team",
  },
  ja: {
    title: "ブログ",
    description: "Roxチームからの最新情報とインサイト",
  },
};

export default async function BlogIndexPage({ lang }: PageProps<"/[lang]/blog">) {
  const locale = (lang as "en" | "ja") || "en";
  const indexData = blogIndexData[locale];

  // Get all blog post slugs
  const slugs = await getAllSlugs("blog", locale);

  // Load metadata for all posts
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const content = await loadMarkdownBySlug("blog", slug, locale);
      return content
        ? {
            slug,
            title: content.metadata.title,
            excerpt: content.metadata.excerpt || content.metadata.description || "",
            date: content.metadata.date || "",
            author: content.metadata.author || "Rox Team",
          }
        : null;
    }),
  );

  // Filter out null values, filter future posts, and sort by date
  // Use Japan Standard Time (JST = UTC+9) for publication date comparison
  const now = new Date();
  const validPosts = posts
    .filter((post): post is NonNullable<typeof post> => post !== null)
    .filter((post) => {
      // If no date, show the post
      if (!post.date) return true;

      // Hide posts with future dates (scheduled posts)
      // Parse the date as JST (if date is "2024-12-11", treat it as "2024-12-11 00:00:00 JST")
      // This means the post becomes visible at midnight JST on the specified date
      const postDateInJST = new Date(`${post.date}T00:00:00+09:00`);

      // Check if valid date
      if (isNaN(postDateInJST.getTime())) return true;

      return postDateInJST <= now;
    });
  const sortedPosts = validPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    // Hallmark 13 Index-First (design.md § Macrostructure family): the page is
    // the list. Was a 3-column grid of shadowed cards; entries are now
    // hairline-ruled rows so the reader scans titles rather than boxes.
    <div className="mx-auto max-w-5xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
      <Meta
        title={`${indexData.title} - Rox`}
        description={indexData.description}
        image={`/api/og?title=${encodeURIComponent(indexData.title)}`}
        url={`/${locale}/blog`}
        lang={locale}
      />
      <BreadcrumbSchema
        items={generateBreadcrumbItems(
          [{ label: indexData.title, href: `/${locale}/blog` }],
          locale,
        )}
      />

      <Breadcrumbs items={[{ label: indexData.title }]} lang={locale} />

      <header className="border-rule mt-6 border-b pb-10">
        <h1 className="hallmark-display text-ink text-[length:var(--text-display-s)]">
          {indexData.title}
        </h1>
        <p className="text-ink-2 mt-4 max-w-[52ch] text-lg leading-relaxed">
          {indexData.description}
        </p>
      </header>

      <ul className="divide-rule divide-y">
        {sortedPosts.map((post) => (
          <li key={post.slug}>
            <Link
              to={`/${locale}/blog/${post.slug}` as `/${string}`}
              className="group hover:bg-paper-3 -mx-4 block rounded-[var(--radius-card)] px-4 py-8 transition-colors"
            >
              <div className="text-ink-2 flex flex-wrap items-baseline gap-x-3 text-sm">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span aria-hidden="true" className="bg-rule h-3 w-px" />
                <span>{post.author}</span>
              </div>
              <h2 className="hallmark-display text-ink group-hover:text-accent mt-2 text-2xl transition-colors">
                {post.title}
                <span
                  aria-hidden="true"
                  className="ml-2 inline-block transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </h2>
              <p className="text-ink-2 mt-2 max-w-[68ch] leading-relaxed">{post.excerpt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
