"use client";

import { useEffect } from "react";
import { Meta } from "@/components/global/meta";

// Side-effect-only client island. Crawlers (no JS) see the surrounding
// server-rendered HTML — including the page's <Meta> — which is what we want
// for OGP on shareable common URLs. Real browsers run this and bounce the
// user to their preferred locale.
export function ClientLanguageRedirect({ targetPath }: { targetPath: string }) {
  useEffect(() => {
    const userLang = navigator.language || navigator.languages?.[0] || "en";
    const isJapanese = userLang.startsWith("ja");
    window.location.href = isJapanese ? `/ja${targetPath}` : `/en${targetPath}`;
  }, [targetPath]);
  return null;
}

// Visible fallback for crawlers and users without JS. Use alongside any
// custom <Meta> you render on the page.
export function LanguageRedirectFallback({ targetPath }: { targetPath: string }) {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <p>Redirecting...</p>
      <p>
        <a href={`/en${targetPath}`}>English</a> | <a href={`/ja${targetPath}`}>日本語</a>
      </p>
    </div>
  );
}

interface SimpleRedirectProps {
  targetPath: string;
  title: string;
  description: string;
  ogTitle: string;
}

// Simple all-in-one redirect with a generic <Meta>. Use when the common URL
// has no resource-specific content to surface in OGP (e.g. demo pages,
// landing pages without a frontmatter to read).
export function LanguageRedirect({ targetPath, title, description, ogTitle }: SimpleRedirectProps) {
  return (
    <>
      <Meta
        title={title}
        description={description}
        image={`/api/og?title=${encodeURIComponent(ogTitle)}`}
        url={targetPath}
      />
      <ClientLanguageRedirect targetPath={targetPath} />
      <LanguageRedirectFallback targetPath={targetPath} />
    </>
  );
}
