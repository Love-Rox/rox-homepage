'use client';

import { useEffect, useState } from 'react';

interface ReleaseInfo {
  stable: {
    version: string;
    name: string;
    url: string;
    publishedAt: string;
  } | null;
  prerelease: {
    version: string;
    name: string;
    url: string;
    publishedAt: string;
  } | null;
}

interface VersionBadgeProps {
  stableLabel: string;
  prereleaseLabel: string;
}

export const VersionBadge = ({ stableLabel, prereleaseLabel }: VersionBadgeProps) => {
  const [releaseInfo, setReleaseInfo] = useState<ReleaseInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/releases')
      .then((res) => res.json())
      .then((data) => {
        setReleaseInfo(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center gap-3 mb-6">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      </div>
    );
  }

  if (!releaseInfo || (!releaseInfo.stable && !releaseInfo.prerelease)) {
    return null;
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-6">
      {releaseInfo.stable && (
        <a
          href={releaseInfo.stable.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 hover:bg-primary-200 dark:hover:bg-primary-800 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path d="M8.75 1.5a.75.75 0 0 0-1.5 0v5.19L5.22 4.66a.75.75 0 0 0-1.06 1.06l2.97 2.97a.748.748 0 0 0 1.23-.24l.04-.08 2.97-2.97a.75.75 0 1 0-1.06-1.06L8.25 6.69V1.5ZM2.5 10.5a.75.75 0 0 0-1.5 0v2.75A1.75 1.75 0 0 0 2.75 15h10.5A1.75 1.75 0 0 0 15 13.25V10.5a.75.75 0 0 0-1.5 0v2.75a.25.25 0 0 1-.25.25H2.75a.25.25 0 0 1-.25-.25V10.5Z" />
          </svg>
          <span>{stableLabel}:</span>
          <span className="font-bold">{releaseInfo.stable.version}</span>
        </a>
      )}
      {releaseInfo.prerelease && (
        <a
          href={releaseInfo.prerelease.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800/50 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z" />
          </svg>
          <span>{prereleaseLabel}:</span>
          <span className="font-bold">{releaseInfo.prerelease.version}</span>
        </a>
      )}
    </div>
  );
};
