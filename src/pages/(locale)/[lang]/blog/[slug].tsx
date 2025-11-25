import { PageProps } from "waku/router";
import { BlogPost } from "@/components/blog/blog-post";

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

type BlogPostData = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
};

const blogPosts: Record<string, Record<string, BlogPostData>> = {
  en: {
    "welcome-to-rox": welcomeToRox_en,
    "tech-stack-overview": techStackOverview_en,
    "roadmap-2025": roadmap2025_en,
  },
  ja: {
    "welcome-to-rox": welcomeToRox_ja,
    "tech-stack-overview": techStackOverview_ja,
    "roadmap-2025": roadmap2025_ja,
  },
};

export default async function BlogPostPage({
  lang,
  slug,
}: PageProps<"/[lang]/blog/[slug]">) {
  const locale = (lang as keyof typeof blogIndexData) || "en";
  const indexData = blogIndexData[locale];
  const posts = blogPosts[locale] ?? blogPosts.en;
  const post = posts?.[slug];

  if (!posts || !post) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <title>Not Found - Rox</title>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Post Not Found
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          The requested blog post could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <title>{`${post.title} - ${indexData.title} - Rox`}</title>
      <meta name="description" content={post.excerpt} />

      <BlogPost
        title={post.title}
        content={post.content}
        date={post.date}
        author={post.author}
        lang={lang}
        backLabel={indexData.backToList}
      />
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
