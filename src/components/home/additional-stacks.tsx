"use client";

import { useMemo } from "react";

interface StackItem {
  name: string;
  src: string;
  href: string;
  description: string;
}

interface AdditionalStacksProps {
  title: string;
  tech: StackItem[];
}

export const AdditionalStacks = ({ title, tech }: AdditionalStacksProps) => {
  const sliderItems = useMemo(
    () => (
      <>
        {/* First set of items */}
        {tech.map((stack, index) => (
          <a
            key={`${stack.name}-${index}`}
            href={stack.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center bg-slate-950/15 dark:bg-slate-200/15 p-8 rounded-lg shadow-sm hover:shadow-md hover:bg-slate-950/20 dark:hover:bg-slate-200/20 transition-all group shrink-0 mx-4 min-w-[140px]"
            title={stack.description}
          >
            <img
              src={stack.src}
              alt={stack.name}
              className="h-16 w-16 object-contain mb-3 group-hover:scale-110 transition-transform"
            />
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 text-center whitespace-nowrap">
              {stack.name}
            </div>
          </a>
        ))}
        {/* Duplicate set for seamless loop */}
        {tech.map((stack, index) => (
          <a
            key={`${stack.name}-duplicate-${index}`}
            href={stack.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center bg-slate-950/15 dark:bg-slate-200/15 p-8 rounded-lg shadow-sm hover:shadow-md hover:bg-slate-950/20 dark:hover:bg-slate-200/20 transition-all group shrink-0 mx-4 min-w-[140px]"
            title={stack.description}
            aria-hidden="true"
          >
            <img
              src={stack.src}
              alt={stack.name}
              className="h-16 w-16 object-contain mb-3 group-hover:scale-110 transition-transform"
            />
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 text-center whitespace-nowrap">
              {stack.name}
            </div>
          </a>
        ))}
      </>
    ),
    [tech],
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-surface-muted py-12 rounded-lg mt-8 overflow-hidden">
      <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-8 text-center">
        {title}
      </h2>

      {/* Infinite Slider Container with edge fade.
          The mask-image clips the marquee on both edges so items fade in/out
          instead of popping at the container border. */}
      <div
        className="relative overflow-x-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0, #000 5%, #000 95%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, #000 5%, #000 95%, transparent 100%)",
        }}
      >
        <div className="flex w-max animate-marquee hover:pause-animation">{sliderItems}</div>
      </div>
    </div>
  );
};
