import { PageProps } from "waku/router";
import { BlogCard } from "@/components/blog/blog-card";

import blogIndex_en from "@content/blog/en/_index.json";
import blogIndex_ja from "@content/blog/ja/_index.json";

// Import all blog posts
import welcomeToRox_en from "@content/blog/en/welcome-to-rox.json";
import techStackOverview_en from "@content/blog/en/tech-stack-overview.json";
import roadmap2025_en from "@content/blog/en/roadmap-2025.json";

import welcomeToRox_ja from "@content/blog/ja/welcome-to-rox.json";
import techStackOverview_ja from "@content/blog/ja/tech-stack-overview.json";
import roadmap2025_ja from "@content/blog/ja/roadmap-2025.json";

const blogIndexData = {
  en: blogIndex_en,
  ja: blogIndex_ja,
};

type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
};

// Posts ordered by date (newest first)
const blogPosts: Record<string, BlogPost[]> = {
  en: [welcomeToRox_en, techStackOverview_en, roadmap2025_en],
  ja: [welcomeToRox_ja, techStackOverview_ja, roadmap2025_ja],
};

export default async function BlogIndexPage({
  lang,
}: PageProps<"/[lang]/blog">) {
  const locale = (lang as keyof typeof blogIndexData) || "en";
  const indexData = blogIndexData[locale];
  const posts = blogPosts[locale] ?? blogPosts.en ?? [];

  // Sort by date descending
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <title>{`${indexData.title} - Rox`}</title>
      <meta name="description" content={indexData.description} />

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
          <BlogCard
            key={post.slug}
            slug={post.slug}
            title={post.title}
            excerpt={post.excerpt}
            date={post.date}
            author={post.author}
            lang={lang}
          />
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
