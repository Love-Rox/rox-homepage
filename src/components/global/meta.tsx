interface MetaProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

export const Meta = ({ title, description, image, url }: MetaProps) => {
  const siteName = 'Rox';
  const defaultImage = '/assets/logos/png/rox-horizontal@2x.png';
  const ogImage = image || defaultImage;
  // Ensure absolute URL for image if it starts with /
  const absoluteOgImage = ogImage.startsWith('http')
    ? ogImage
    : `https://love-rox.cc${ogImage}`; // Assuming domain, should be configurable or env var ideally

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteOgImage} />
      {url && <meta property="og:url" content={url} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteOgImage} />
    </>
  );
};
