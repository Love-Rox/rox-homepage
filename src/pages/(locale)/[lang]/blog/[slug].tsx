import { PageProps } from "waku/router";
import { loadMarkdownBySlug } from "@/lib/markdown-loader";
import { BlogPost } from "@/components/blog/blog-post";

// Blog index data
const blogIndexData = {
  en: {
    title: "Blog",
    backToList: "← Back to all posts",
  },
  ja: {
    title: "ブログ",
    backToList: "← すべての投稿に戻る",
  },
};

export default async function BlogPostPage({
  lang,
  slug,
}: PageProps<"/[lang]/blog/[slug]">) {
  const locale = (lang as 'en' | 'ja') || 'en';
  const indexData = blogIndexData[locale];
  const content = await loadMarkdownBySlug('blog', slug, locale);

  if (!content) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
      <title>{`${content.metadata.title} - ${indexData.title} - Rox`}</title>
      <meta name="description" content={content.metadata.excerpt || content.metadata.description} />

      <BlogPost
        content={content.html}
        date={content.metadata.date ? new Date(content.metadata.date).toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : ''}
        author={content.metadata.author || 'Rox Team'}
        lang={locale}
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
