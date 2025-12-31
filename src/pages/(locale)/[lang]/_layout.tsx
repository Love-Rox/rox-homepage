import "@/styles.css";

import type { ReactNode } from "react";
import { Footer } from "@/components/global/footer";
import { Header } from "@/components/global/header";
import { unstable_getContext } from "waku/server";
import { WebSiteSchema, OrganizationSchema, SoftwareApplicationSchema } from "@/components/seo/structured-data";

import nav_en from "@private/lang/components/global/en/nav.json";
import nav_ja from "@private/lang/components/global/ja/nav.json";

const navData = {
  en: nav_en,
  ja: nav_ja,
};

interface LayoutProps {
  children: ReactNode;
  params?: { lang?: string };
}

export default async function RootLayout(props: LayoutProps) {
  const { children } = props;
  const data = await getData();

  // Extract language from URL using context
  const context = unstable_getContext();
  const req = context?.req as { url?: string } | undefined;
  const url = req?.url || "";
  const urlParts = url.split("/");
  const langFromUrl = urlParts.find(
    (part: string) => part === "en" || part === "ja",
  );
  const currentLang = (langFromUrl ||
    props.params?.lang ||
    "en") as keyof typeof navData;
  const navItems = navData[currentLang]?.items || navData.en.items;

  return (
    <html lang={currentLang}>
      <head>
        <meta name="description" content={data.description} />
        <link rel="icon" type="image/png" href={data.icon} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <WebSiteSchema lang={currentLang as 'en' | 'ja'} />
        <OrganizationSchema />
        <SoftwareApplicationSchema />
      </head>
      <body>
        <div className="font-m-plus-rounded-1c bg-primary-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 min-h-screen flex flex-col">
          <Header lang={currentLang} navItems={navItems} />
          <main className="*:min-h-64 lg:min-h-svh flex-1">{children}</main>
          <Footer lang={currentLang} />
        </div>
      </body>
    </html>
  );
}

const getData = async () => {
  const data = {
    description: "Rox Homepage",
    icon: "/images/favicon.png",
  };

  return data;
};

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
