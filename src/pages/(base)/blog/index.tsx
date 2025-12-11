'use client';

import { useEffect } from 'react';
import { Meta } from '@/components/global/meta';

export default function BlogRedirectPage() {
  useEffect(() => {
    const userLang = navigator.language || navigator.languages?.[0] || 'en';
    const isJapanese = userLang.startsWith('ja');
    window.location.href = isJapanese ? '/ja/blog' : '/en/blog';
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <Meta
        title="Blog - Rox"
        description="Latest updates and insights from the Rox team"
        image="/api/og?title=Blog"
      />
      <p>Redirecting...</p>
      <p>
        <a href="/en/blog">English</a> | <a href="/ja/blog">日本語</a>
      </p>
    </div>
  );
}
