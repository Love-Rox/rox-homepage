import { Meta } from "@/components/global/meta";
import {
  ClientLanguageRedirect,
  LanguageRedirectFallback,
} from "@/components/common/LanguageRedirect";
import { loadMarkdownBySlug } from "@/lib/markdown-loader";

interface CommonBlogPageProps {
  slug?: string;
}

export default async function BlogSlugRedirectPage({ slug }: CommonBlogPageProps) {
  const targetPath = slug ? `/blog/${slug}` : "/blog";

  // Read the post from EN first, fall back to JA, so the shareable common URL
  // emits OGP that reflects the actual post regardless of which locale wrote it.
  const content = slug
    ? ((await loadMarkdownBySlug("blog", slug, "en")) ??
      (await loadMarkdownBySlug("blog", slug, "ja")))
    : null;

  const title = content?.metadata.title ? `${content.metadata.title} - Blog - Rox` : "Blog - Rox";
  const description =
    content?.metadata.excerpt ||
    content?.metadata.description ||
    "Latest updates and insights from the Rox team";

  const ogParams = new URLSearchParams();
  ogParams.set("title", content?.metadata.title || "Blog");
  ogParams.set("eyebrow", "Love-Rox Journal");
  if (content?.metadata.author) ogParams.set("author", content.metadata.author);
  const ogImage = `/api/og?${ogParams.toString()}`;

  return (
    <>
      <Meta title={title} description={description} image={ogImage} url={targetPath} />
      <ClientLanguageRedirect targetPath={targetPath} />
      <LanguageRedirectFallback targetPath={targetPath} />
    </>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
