interface MetaProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  lang?: "en" | "ja";
}

const SITE_ORIGIN = "https://love-rox.cc";

// Strip the leading /en or /ja so we can build all locale variants and the
// common (lang-less) URL from one normalized path. Works for both common URLs
// like "/blog/foo" and locale URLs like "/en/blog/foo".
function commonPathFromUrl(url: string): string {
  return url.replace(/^\/(en|ja)(?=\/|$)/, "") || "/";
}

function localizedUrl(commonPath: string, locale: "en" | "ja"): string {
  return commonPath === "/" ? `/${locale}` : `/${locale}${commonPath}`;
}

export const Meta = ({ title, description, image, url, lang = "en" }: MetaProps) => {
  const siteName = "Rox";
  const defaultImage = "/assets/logos/png/rox-horizontal@2x.png";
  const ogImage = image || defaultImage;
  const absoluteOgImage = ogImage.startsWith("http") ? ogImage : `${SITE_ORIGIN}${ogImage}`;

  const absoluteUrl = url ? (url.startsWith("http") ? url : `${SITE_ORIGIN}${url}`) : undefined;

  const commonPath = url ? commonPathFromUrl(url) : null;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      {absoluteUrl && <link rel="canonical" href={absoluteUrl} />}

      {commonPath && (
        <>
          <link
            rel="alternate"
            hrefLang="en"
            href={`${SITE_ORIGIN}${localizedUrl(commonPath, "en")}`}
          />
          <link
            rel="alternate"
            hrefLang="ja"
            href={`${SITE_ORIGIN}${localizedUrl(commonPath, "ja")}`}
          />
          <link rel="alternate" hrefLang="x-default" href={`${SITE_ORIGIN}${commonPath}`} />
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
