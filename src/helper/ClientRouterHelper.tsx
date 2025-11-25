'use client';

import { useEffect, useState } from 'react';
import { useRouter } from "waku/router/client";
import { LanguageSelector } from '@/components/global/language-selector';

export function ClientRouterHelper({ currentLang: initialLang }: { currentLang: string }) {
  const router = useRouter();

  // Use lazy initialization to read from URL on first render
  const [currentLang, setCurrentLang] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const parts = path.split('/');
      if (parts[1] === 'en' || parts[1] === 'ja') {
        return parts[1];
      }
    }
    return initialLang;
  });

  useEffect(() => {
    const updateLangFromPath = () => {
      const path = window.location.pathname;
      const parts = path.split('/');
      if (parts[1] === 'en' || parts[1] === 'ja') {
        setCurrentLang(parts[1]);
      }
    };

    // Update on mount
    updateLangFromPath();

    // Listen for navigation events
    window.addEventListener('popstate', updateLangFromPath);

    return () => {
      window.removeEventListener('popstate', updateLangFromPath);
    };
  }, []);


  const handleLangChange = (newLang: string) => {
    const currentPath = window.location.pathname;
    let newPath = currentPath;
    if (currentPath === '/' || currentPath === `/${currentLang}`) {
      newPath = `/${newLang}`;
    } else if (currentPath.startsWith(`/${currentLang}/`)) {
      newPath = currentPath.replace(`/${currentLang}/`, `/${newLang}/`);
    } else {
      // Fallback if currentLang state doesn't match path (e.g. /ja but state is en)
      // Try to detect from path again or just prepend
      if (currentPath.startsWith('/en/') || currentPath === '/en') {
        newPath = currentPath.replace('/en', '/' + newLang);
      } else if (currentPath.startsWith('/ja/') || currentPath === '/ja') {
        newPath = currentPath.replace('/ja', '/' + newLang);
      } else {
        newPath = `/${newLang}${currentPath === '/' ? '' : currentPath}`;
      }
    }

    router.push(newPath as `/${string}`);

    // Update state immediately with the new language
    setCurrentLang(newLang);
  };

  return (
    <LanguageSelector
      currentLang={currentLang}
      onLanguageChange={handleLangChange}
    />
  );
}