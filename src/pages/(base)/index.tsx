'use client';

import { useEffect } from 'react';

import { Meta } from '@/components/global/meta';

export default function HomePage() {
  useEffect(() => {
    // Detect user's preferred language from browser
    const userLang = navigator.language || navigator.languages?.[0] || 'en';
    const isJapanese = userLang.startsWith('ja');

    // Redirect to appropriate language homepage
    window.location.href = isJapanese ? '/ja' : '/en';
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <Meta
        title="Rox - The Lightweight ActivityPub Server"
        description="Rox is a ActivityPub server focused on performance and usability. Compatible with Misskey clients and services."
        image="/_api/og?title=Rox"
      />
      <p>Redirecting...</p>
      <p>
        <a href="/en">English</a> | <a href="/ja">日本語</a>
      </p>
    </div>
  );
}
