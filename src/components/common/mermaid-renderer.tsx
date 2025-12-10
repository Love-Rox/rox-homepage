'use client';

import { useEffect, useRef } from 'react';

interface MermaidRendererProps {
  content: string;
}

export const MermaidRenderer = ({ content }: MermaidRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const renderMermaid = async () => {
      if (!containerRef.current) return;

      // Find all mermaid code blocks
      const codeBlocks = containerRef.current.querySelectorAll('pre code.language-mermaid');

      if (codeBlocks.length === 0) return;

      // Dynamically import mermaid
      const mermaid = (await import('mermaid')).default;

      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          primaryColor: '#ff5b11',
          primaryTextColor: '#1e293b',
          primaryBorderColor: '#ff5b11',
          lineColor: '#64748b',
          secondaryColor: '#f8fafc',
          tertiaryColor: '#fff7ed',
          nodeTextColor: '#1e293b',
          clusterBkg: '#fff7ed',
          clusterBorder: '#ff5b11',
          edgeLabelBackground: '#ffffff',
        },
      });

      // Process each code block
      for (let i = 0; i < codeBlocks.length; i++) {
        const codeBlock = codeBlocks[i];
        if (!codeBlock) continue;

        const pre = codeBlock.parentElement;
        if (!pre) continue;

        const code = codeBlock.textContent || '';

        try {
          const { svg } = await mermaid.render(`mermaid-${i}`, code);
          const wrapper = document.createElement('div');
          wrapper.className = 'mermaid-diagram my-4 flex justify-center';
          wrapper.innerHTML = svg;
          pre.replaceWith(wrapper);
        } catch (error) {
          console.error('Mermaid rendering error:', error);
        }
      }
    };

    renderMermaid();
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="prose prose-slate dark:prose-invert max-w-none prose-sm sm:prose-base lg:prose-lg"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
