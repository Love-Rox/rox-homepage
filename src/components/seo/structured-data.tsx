const SITE_URL = "https://love-rox.cc";
const SITE_NAME = "Rox";

interface WebSiteSchemaProps {
  lang: "en" | "ja";
}

export const WebSiteSchema = ({ lang }: WebSiteSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "Rox ActivityPub Server",
    url: SITE_URL,
    inLanguage: lang,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/${lang}/docs?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/assets/logos/png/rox-horizontal@2x.png`,
    sameAs: ["https://github.com/Love-Rox"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbSchema = ({ items }: BreadcrumbSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}

export const ArticleSchema = ({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author = "Rox Team",
}: ArticleSchemaProps) => {
  const isRoxTeam = author === "Rox Team" || author === "sasapiyo" || author === "Rox";
  const authorSchema = isRoxTeam ? {
    "@type": "Person",
    name: author,
    url: "https://github.com/sasapiyo",
    jobTitle: "Main Developer",
    worksFor: {
      "@type": "Organization",
      name: "Rox",
    }
  } : {
    "@type": "Person",
    name: author,
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: url.startsWith("http") ? url : `${SITE_URL}${url}`,
    image: image
      ? image.startsWith("http")
        ? image
        : `${SITE_URL}${image}`
      : `${SITE_URL}/assets/logos/png/rox-horizontal@2x.png`,
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified: dateModified || datePublished }),
    author: authorSchema,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/assets/logos/png/rox-horizontal@2x.png`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface TechArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  dateModified?: string;
}

export const TechArticleSchema = ({
  title,
  description,
  url,
  dateModified,
}: TechArticleSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description,
    url: url.startsWith("http") ? url : `${SITE_URL}${url}`,
    ...(dateModified && { dateModified }),
    author: {
      "@type": "Person",
      name: "Rox Team",
      url: "https://love-rox.cc",
      worksFor: {
        "@type": "Organization",
        name: "Rox",
      }
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/assets/logos/png/rox-horizontal@2x.png`,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// SoftwareApplication schema for the homepage
export const SoftwareApplicationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Rox",
    applicationCategory: "SocialNetworkingApplication",
    operatingSystem: "Linux, Docker",
    description: "A lightweight ActivityPub server written in Rust",
    url: SITE_URL,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    license: "https://opensource.org/licenses/AGPL-3.0",
    programmingLanguage: "Rust",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export interface FAQPageSchemaProps {
  faq: { question: string; answer: string }[];
}

export const FAQPageSchema = ({ faq }: FAQPageSchemaProps) => {
  if (!faq || faq.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export interface HowToSchemaProps {
  howto: {
    name: string;
    description?: string;
    supply?: string[];
    tool?: string[];
    step: { name: string; text: string; url?: string; image?: string }[];
    totalTime?: string;
  };
}

export const HowToSchema = ({ howto }: HowToSchemaProps) => {
  if (!howto) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: howto.name,
    ...(howto.description && { description: howto.description }),
    ...(howto.totalTime && { totalTime: howto.totalTime }),
    ...(howto.supply && {
      supply: howto.supply.map((s) => ({ "@type": "HowToSupply", name: s })),
    }),
    ...(howto.tool && {
      tool: howto.tool.map((t) => ({ "@type": "HowToTool", name: t })),
    }),
    step: howto.step.map((s) => ({
      "@type": "HowToStep",
      name: s.name,
      text: s.text,
      ...(s.url && { url: s.url }),
      ...(s.image && { image: s.image }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
