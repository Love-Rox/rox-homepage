'use client';

import { useEffect } from 'react';
import { Meta } from '@/components/global/meta';

export default function DocsRedirectPage() {
  useEffect(() => {
    const userLang = navigator.language || navigator.languages?.[0] || 'en';
    const isJapanese = userLang.startsWith('ja');
    window.location.href = isJapanese ? '/ja/docs' : '/en/docs';
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <Meta
        title="Documentation - Rox"
        description="Everything you need to know about Rox"
        image="/api/og?title=Documentation"
      />
      <p>Redirecting...</p>
      <p>
        <a href="/en/docs">English</a> | <a href="/ja/docs">日本語</a>
      </p>
    </div>
  );
}
