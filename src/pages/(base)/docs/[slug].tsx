import { LanguageRedirect } from '@/components/common/LanguageRedirect';

interface DocsSlugRedirectPageProps {
  slug?: string;
}

export default function DocsSlugRedirectPage({ slug }: DocsSlugRedirectPageProps) {
  const targetPath = slug ? `/docs/${slug}` : '/docs';

  return (
    <LanguageRedirect
      targetPath={targetPath}
      title="Documentation - Rox"
      description="Everything you need to know about Rox"
      ogTitle="Documentation"
    />
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const;
};
