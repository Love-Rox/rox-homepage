import { Meta } from "@/components/global/meta";
import { Button } from "@/components/common/button";
import type { PageProps } from "waku/router";

const notFoundData = {
  en: {
    title: "Page Not Found",
    heading: "404",
    message: "Oops! The page you're looking for doesn't exist.",
    description: "The page you're looking for might have been moved or deleted.",
    homeLink: "Back to Home",
    blogLink: "View Blog",
  },
  ja: {
    title: "ページが見つかりません",
    heading: "404",
    message: "お探しのページは見つかりませんでした。",
    description: "お探しのページは移動または削除された可能性があります。",
    homeLink: "ホームに戻る",
    blogLink: "ブログを見る",
  },
};

export default async function NotFoundPage({ lang }: PageProps<"/[lang]/404">) {
  const locale = (lang as "en" | "ja") || "en";
  const data = notFoundData[locale];

  return (
    // Utility page — inherits the system, no macrostructure family
    // (design.md § Macrostructure family). Centring is right here: there is
    // no content to establish a reading axis against.
    <div className="hallmark-dotgrid flex min-h-[60vh] flex-col items-center justify-center px-4 pt-32 pb-24 text-center sm:px-6 lg:px-8">
      <Meta
        title={`${data.title} - Rox`}
        description={data.description}
        url={`/${locale}/404`}
        lang={locale}
      />

      <p aria-hidden="true" className="hallmark-display text-accent text-[clamp(4rem,18vw,9rem)]">
        {data.heading}
      </p>

      <h1 className="hallmark-display text-ink mt-2 text-2xl md:text-3xl">{data.message}</h1>

      <p className="text-ink-2 mt-4 max-w-[46ch] text-lg leading-relaxed">{data.description}</p>

      {/* Was two hand-rolled Tailwind chains; now the shared Button, so the
          CTA voice matches every other action on the site. */}
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Button href={`/${locale}`} variant="primary" size="lg">
          {data.homeLink}
        </Button>
        <Button href={`/${locale}/blog`} variant="secondary" size="lg">
          {data.blogLink}
        </Button>
      </div>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
    staticPaths: ["en", "ja"],
  } as const;
};
