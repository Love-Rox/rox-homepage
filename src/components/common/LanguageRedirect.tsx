'use client';

import { useEffect } from 'react';
import { Meta } from '@/components/global/meta';

interface RedirectProps {
  targetPath: string;
  title: string;
  description: string;
  ogTitle: string;
}

export function LanguageRedirect({ targetPath, title, description, ogTitle }: RedirectProps) {
  useEffect(() => {
    const userLang = navigator.language || navigator.languages?.[0] || 'en';
    const isJapanese = userLang.startsWith('ja');
    window.location.href = isJapanese ? `/ja${targetPath}` : `/en${targetPath}`;
  }, [targetPath]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <Meta
        title={title}
        description={description}
        image={`/api/og?title=${encodeURIComponent(ogTitle)}`}
      />
      <p>Redirecting...</p>
      <p>
        <a href={`/en${targetPath}`}>English</a> | <a href={`/ja${targetPath}`}>日本語</a>
      </p>
    </div>
  );
}
