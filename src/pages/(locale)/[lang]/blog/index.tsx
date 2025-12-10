import { Meta } from "@/components/global/meta";
import { PageProps } from "waku/router";
import { Link } from "waku";
import { getAllSlugs, loadMarkdownBySlug } from "@/lib/markdown-loader";

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

export default async function BlogIndexPage({
  lang,
}: PageProps<"/[lang]/blog">) {
  const locale = (lang as 'en' | 'ja') || 'en';
  const indexData = blogIndexData[locale];

  // Get all blog post slugs
  const slugs = await getAllSlugs('blog', locale);

  // Load metadata for all posts
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const content = await loadMarkdownBySlug('blog', slug, locale);
      return content ? {
        slug,
        title: content.metadata.title,
        excerpt: content.metadata.excerpt || content.metadata.description || '',
        date: content.metadata.date || '',
        author: content.metadata.author || 'Rox Team',
      } : null;
    })
  );

  // Filter out null values, filter future posts, and sort by date
  const now = new Date();
  const validPosts = posts
    .filter((post): post is NonNullable<typeof post> => post !== null)
    .filter((post) => {
      // Hide posts with future dates (scheduled posts)
      const postDate = new Date(post.date);
      return postDate <= now;
    });
  const sortedPosts = validPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
      <Meta
        title={`${indexData.title} - Rox`}
        description={indexData.description}
        image={`/api/og?title=${encodeURIComponent(indexData.title)}`}
      />

      <header className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          {indexData.title}
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">
          {indexData.description}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedPosts.map((post) => (
          <Link
            key={post.slug}
            to={`/${locale}/blog/${post.slug}` as `/${string}`}
            className="block bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-slate-200 dark:border-slate-700 group hover:border-primary-500 dark:hover:border-primary-400"
          >
            <time className="text-sm text-slate-500 dark:text-slate-400">
              {new Date(post.date).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {post.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              {post.excerpt}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              By {post.author}
            </p>
          </Link>
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
