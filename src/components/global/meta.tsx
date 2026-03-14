interface MetaProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  lang?: "en" | "ja";
}

export const Meta = ({ title, description, image, url, lang = "en" }: MetaProps) => {
  const siteName = "Rox";
  const defaultImage = "/assets/logos/png/rox-horizontal@2x.png";
  const ogImage = image || defaultImage;
  // Ensure absolute URL for image if it starts with /
  const absoluteOgImage = ogImage.startsWith("http") ? ogImage : `https://love-rox.cc${ogImage}`; // Assuming domain, should be configurable or env var ideally

  const absoluteUrl = url
    ? url.startsWith("http")
      ? url
      : `https://love-rox.cc${url}`
    : undefined;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      {absoluteUrl && <link rel="canonical" href={absoluteUrl} />}

      {/* hreflang tags if we know the current URL path. Assuming url is the path like /ja/blog */}
      {url && (
        <>
          <link
            rel="alternate"
            hrefLang="en"
            href={`https://love-rox.cc${url.replace(/^\/(ja|en)/, "/en")}`}
          />
          <link
            rel="alternate"
            hrefLang="ja"
            href={`https://love-rox.cc${url.replace(/^\/(ja|en)/, "/ja")}`}
          />
          <link
            rel="alternate"
            hrefLang="x-default"
            href={`https://love-rox.cc${url.replace(/^\/(ja|en)/, "/en")}`}
          />
        </>
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteOgImage} />
      <meta property="og:locale" content={lang === "ja" ? "ja_JP" : "en_US"} />
      {absoluteUrl && <meta property="og:url" content={absoluteUrl} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@Love_Rox_cc" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteOgImage} />
    </>
  );
};
