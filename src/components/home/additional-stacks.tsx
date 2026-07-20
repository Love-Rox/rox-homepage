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

/**
 * Full-bleed marquee band — the one section that deliberately breaks the
 * Split Studio diptych rhythm, sitting between rows 2 and 3 as a palate
 * cleanser. Preserved from the pre-redesign site; this is genuine craft.
 *
 * Retheme only: the tiles lost their filled backgrounds and shadows in favour
 * of a T2 logo-wall register, so the band reads as a quiet strip rather than
 * a fourth grid of cards. The edge mask and the duplicated set (which is what
 * makes the loop seamless) are unchanged.
 *
 * `prefers-reduced-motion` stops the animation — handled in styles.css.
 */
export const AdditionalStacks = ({ title, tech }: AdditionalStacksProps) => {
  const tile = (stack: StackItem, key: string, hidden?: boolean) => (
    <a
      key={key}
      href={stack.href}
      target="_blank"
      rel="noopener noreferrer"
      title={stack.description}
      {...(hidden && { "aria-hidden": "true", tabIndex: -1 })}
      className="group mx-6 flex min-w-[120px] shrink-0 flex-col items-center justify-center gap-3 opacity-70 transition-opacity hover:opacity-100"
    >
      <img src={stack.src} alt="" aria-hidden="true" className="h-12 w-12 object-contain" />
      <span className="text-ink-2 group-hover:text-ink text-xs font-medium whitespace-nowrap transition-colors">
        {stack.name}
      </span>
    </a>
  );

  const sliderItems = useMemo(
    () => (
      <>
        {tech.map((stack, i) => tile(stack, `${stack.name}-${i}`))}
        {/* Duplicate set — this is what makes the -50% translate loop seamless. */}
        {tech.map((stack, i) => tile(stack, `${stack.name}-dup-${i}`, true))}
      </>
    ),
    [tech],
  );

  return (
    <section className="border-rule border-y py-14">
      <h2 className="text-ink-2 mb-8 px-4 text-center text-sm font-medium sm:px-6 lg:px-8">
        {title}
      </h2>

      <div
        className="relative overflow-x-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0, #000 5%, #000 95%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, #000 5%, #000 95%, transparent 100%)",
        }}
      >
        <div className="animate-marquee hover:pause-animation flex w-max">{sliderItems}</div>
      </div>
    </section>
  );
};
