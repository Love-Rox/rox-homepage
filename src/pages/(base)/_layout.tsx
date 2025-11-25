import "@/styles.css";

import type { ReactNode } from "react";
import { Footer } from "@/components/global/footer";
import { Header } from "@/components/global/header";
import nav_en from "@private/lang/components/global/en/nav.json";

type RootLayoutProps = { children: ReactNode };

export default async function RootLayout({ children }: RootLayoutProps) {
  const data = await getData();

  return (
    <html lang="en">
      <head>
        <meta name="description" content={data.description} />
        <link rel="icon" type="image/png" href={data.icon} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
      </head>
      <body>
        <div className="font-m-plus-rounded-1c bg-primary-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 min-h-screen">
          <Header lang="en" navItems={nav_en.items} />
          <main className="*:min-h-64 lg:min-h-svh pb-32">{children}</main>
          <Footer />
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
    render: "static",
  } as const;
};
