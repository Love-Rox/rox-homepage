'use client';

import { useState } from 'react';
import './asset-card.css';

interface AssetCardProps {
  name: string;
  title: string;
  formats: {
    svg?: string;
    png?: string;
    png2x?: string;
    jpg?: string;
    jpg2x?: string;
  };
  formatLabels: {
    svg: string;
    png: string;
    png2x: string;
    jpg: string;
    jpg2x: string;
  };
  previewLabel: string;
  lightLabel: string;
  darkLabel: string;
}

export function AssetCard({
  name,
  title,
  formats,
  formatLabels,
  previewLabel,
  lightLabel,
  darkLabel,
}: AssetCardProps) {
  const [bgMode, setBgMode] = useState<'light' | 'dark'>('light');

  // Use SVG for preview if available, otherwise PNG
  const previewSrc = formats.svg || formats.png || '';

  return (
    <div className="asset-card">
      <div className="asset-card-header">
        <h3 className="asset-card-title">{title}</h3>
      </div>

      <div className="asset-card-preview-container">
        <div className={`asset-card-preview asset-card-preview-${bgMode}`}>
          <img src={previewSrc} alt={title} className="asset-card-image" />
        </div>
        <div className="asset-card-bg-toggle">
          <span className="asset-card-bg-label">{previewLabel}:</span>
          <button
            onClick={() => setBgMode('light')}
            className={`asset-card-bg-btn ${bgMode === 'light' ? 'active' : ''}`}
            aria-label={lightLabel}
          >
            {lightLabel}
          </button>
          <button
            onClick={() => setBgMode('dark')}
            className={`asset-card-bg-btn ${bgMode === 'dark' ? 'active' : ''}`}
            aria-label={darkLabel}
          >
            {darkLabel}
          </button>
        </div>
      </div>

      <div className="asset-card-downloads">
        {formats.svg && (
          <a
            href={formats.svg}
            download={`${name}.svg`}
            className="asset-card-download-btn"
          >
            {formatLabels.svg}
          </a>
        )}
        {formats.png && (
          <a
            href={formats.png}
            download={`${name}.png`}
            className="asset-card-download-btn"
          >
            {formatLabels.png}
          </a>
        )}
        {formats.png2x && (
          <a
            href={formats.png2x}
            download={`${name}@2x.png`}
            className="asset-card-download-btn"
          >
            {formatLabels.png2x}
          </a>
        )}
        {formats.jpg && (
          <a
            href={formats.jpg}
            download={`${name}.jpg`}
            className="asset-card-download-btn"
          >
            {formatLabels.jpg}
          </a>
        )}
        {formats.jpg2x && (
          <a
            href={formats.jpg2x}
            download={`${name}@2x.jpg`}
            className="asset-card-download-btn"
          >
            {formatLabels.jpg2x}
          </a>
        )}
      </div>
    </div>
  );
}
