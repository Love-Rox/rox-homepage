import "@/styles.css";

import type { ReactNode } from "react";
import { Footer } from "@/components/global/footer";
import { Header } from "@/components/global/header";
import { unstable_getRequest } from "waku/router/server";
import {
  WebSiteSchema,
  OrganizationSchema,
  SoftwareApplicationSchema,
} from "@/components/seo/structured-data";

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

  // Resolve the active locale.
  //
  // The route param is the primary source: fsRouter derives it from the
  // [lang] segment, so it is always present and needs no request scope.
  //
  // The URL sniff is a fallback only. waku 1.0.0-beta.2 replaced the
  // context-storage API with handler interceptors (wakujs/waku#2118) —
  // `unstable_getContext()` from "waku/server" became
  // `unstable_getRequest()` from "waku/router/server" — but *both* throw
  // rather than returning undefined when called outside a request-scoped
  // render, which is the case for this layout under `waku dev`. Hence the
  // guard: an unguarded call 500s every locale route locally.
  const currentLang = (props.params?.lang ||
    sniffLangFromRequest() ||
    "en") as keyof typeof navData;
  const navItems = navData[currentLang]?.items || navData.en.items;

  return (
    <html lang={currentLang}>
      <head>
        <meta name="description" content={data.description} />
        <link rel="icon" type="image/png" href={data.icon} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <WebSiteSchema lang={currentLang as "en" | "ja"} />
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

/** Locale from the request URL, or undefined when no request scope exists. */
const sniffLangFromRequest = (): "en" | "ja" | undefined => {
  try {
    return unstable_getRequest()
      .url.split("/")
      .find((part) => part === "en" || part === "ja") as "en" | "ja" | undefined;
  } catch {
    return undefined;
  }
};

const getData = async () => {
  const data = {
    description:
      "Rox Homepage. A lightweight, high-performance ActivityPub server and client built in Rust.",
    icon: "/images/favicon.png",
  };

  return data;
};

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
