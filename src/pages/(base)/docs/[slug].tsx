import { Meta } from "@/components/global/meta";
import {
  ClientLanguageRedirect,
  LanguageRedirectFallback,
} from "@/components/common/LanguageRedirect";
import { loadMarkdownBySlug } from "@/lib/markdown-loader";

interface CommonDocsPageProps {
  slug?: string;
}

export default async function DocsSlugRedirectPage({ slug }: CommonDocsPageProps) {
  const targetPath = slug ? `/docs/${slug}` : "/docs";

  const content = slug
    ? ((await loadMarkdownBySlug("docs", slug, "en")) ??
      (await loadMarkdownBySlug("docs", slug, "ja")))
    : null;

  const title = content?.metadata.title
    ? `${content.metadata.title} - Docs - Rox`
    : "Documentation - Rox";
  const description =
    content?.metadata.excerpt ||
    content?.metadata.description ||
    "Everything you need to know about Rox";

  const ogParams = new URLSearchParams();
  ogParams.set("title", content?.metadata.title || "Documentation");
  ogParams.set("eyebrow", "Rox Docs");
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
