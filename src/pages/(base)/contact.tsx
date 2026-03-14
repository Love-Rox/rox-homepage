"use client";

import { useEffect } from "react";
import { Meta } from "@/components/global/meta";

export default function ContactRedirectPage() {
  useEffect(() => {
    const userLang = navigator.language || navigator.languages?.[0] || "en";
    const isJapanese = userLang.startsWith("ja");
    window.location.href = isJapanese ? "/ja/contact" : "/en/contact";
  }, []);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <Meta
        title="Contact - Rox"
        description="Get in touch with the Rox team"
        image="/api/og?title=Contact"
      />
      <p>Redirecting...</p>
      <p>
        <a href="/en/contact">English</a> | <a href="/ja/contact">日本語</a>
      </p>
    </div>
  );
}
