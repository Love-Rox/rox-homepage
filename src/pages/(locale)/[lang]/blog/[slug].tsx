import { Meta } from "@/components/global/meta";
import { PageProps } from "waku/router";
import { loadMarkdownBySlug } from "@/lib/markdown-loader";
import { BlogPost } from "@/components/blog/blog-post";
import { Breadcrumbs, generateBreadcrumbItems } from "@/components/common/breadcrumbs";
import { BreadcrumbSchema, ArticleSchema } from "@/components/seo/structured-data";

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
        <Meta
          title="Not Found - Rox"
          description="The requested blog post could not be found."
        />
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Post Not Found
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          The requested blog post could not be found.
        </p>
      </div>
    );
  }

  const ogUrl = `/api/og?title=${encodeURIComponent(content.metadata.title)}`;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
      <Meta
        title={`${content.metadata.title} - ${indexData.title} - Rox`}
        description={content.metadata.excerpt || content.metadata.description}
        image={ogUrl}
      />
      <BreadcrumbSchema
        items={generateBreadcrumbItems([
          { label: indexData.title, href: `/${locale}/blog` },
          { label: content.metadata.title, href: `/${locale}/blog/${slug}` },
        ], locale)}
      />
      <ArticleSchema
        title={content.metadata.title}
        description={content.metadata.excerpt || content.metadata.description || ''}
        url={`/${locale}/blog/${slug}`}
        image={ogUrl}
        {...(content.metadata.date && { datePublished: content.metadata.date })}
        author={content.metadata.author || 'Rox Team'}
      />

      <Breadcrumbs
        items={[
          { label: indexData.title, href: `/${locale}/blog` },
          { label: content.metadata.title },
        ]}
        lang={locale}
      />

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
