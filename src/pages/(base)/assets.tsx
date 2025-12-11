'use client';

import { useEffect } from 'react';
import { Meta } from '@/components/global/meta';

export default function AssetsRedirectPage() {
  useEffect(() => {
    const userLang = navigator.language || navigator.languages?.[0] || 'en';
    const isJapanese = userLang.startsWith('ja');
    window.location.href = isJapanese ? '/ja/assets' : '/en/assets';
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <Meta
        title="Brand Assets - Rox"
        description="Download Rox logos and brand assets"
        image="/api/og?title=Brand%20Assets"
      />
      <p>Redirecting...</p>
      <p>
        <a href="/en/assets">English</a> | <a href="/ja/assets">日本語</a>
      </p>
    </div>
  );
}
