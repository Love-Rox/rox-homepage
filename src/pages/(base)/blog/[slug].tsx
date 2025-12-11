import { LanguageRedirect } from '@/components/common/LanguageRedirect';

interface BlogSlugRedirectPageProps {
  slug?: string;
}

export default function BlogSlugRedirectPage({ slug }: BlogSlugRedirectPageProps) {
  const targetPath = slug ? `/blog/${slug}` : '/blog';

  return (
    <LanguageRedirect
      targetPath={targetPath}
      title="Blog - Rox"
      description="Latest updates and insights from the Rox team"
      ogTitle="Blog"
    />
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const;
};
