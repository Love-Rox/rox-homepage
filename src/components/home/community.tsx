"use client";

import { Link } from "react-aria-components";

interface CommunityLink {
  icon: string;
  title: string;
  description: string;
  url: string;
  label: string;
}

interface CommunityProps {
  title: string;
  subtitle: string;
  links: CommunityLink[];
}

/**
 * Split Studio row 5 — text-left / proof-right, closing the alternation.
 *
 * Was: a centered heading + subtitle over a 2-column grid of cards, each led
 * by a `text-4xl` emoji that scaled on hover — the same banned emoji-as-icon
 * pattern as the old Features section, and the third consecutive card grid on
 * the page.
 *
 * Now: cards survive (these are real destinations worth a hit target) but as
 * a single column of hover-lift panels, with the emoji at inline size in the
 * heading. Uses react-aria <Link> for press/keyboard behaviour.
 */
export const Community = ({ title, subtitle, links }: CommunityProps) => {
  return (
    <section className="bg-paper-3">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-x-12 gap-y-10 px-4 py-24 sm:px-6 lg:grid-cols-[5fr_7fr] lg:px-8">
        <div className="min-w-0 lg:sticky lg:top-28 lg:pt-4">
          <h2 className="hallmark-display text-ink text-[length:var(--text-display-s)]">{title}</h2>
          <p className="text-ink-2 mt-4 max-w-[40ch] text-lg leading-relaxed">{subtitle}</p>
        </div>

        <ul className="flex min-w-0 flex-col gap-4">
          {links.map((link) => (
            <li key={link.url} className="min-w-0">
              <Link
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hallmark-lift group border-rule bg-paper-2 hover:border-accent block min-w-0 rounded-[var(--radius-card)] border p-6 transition-colors"
              >
                <h3 className="text-ink group-hover:text-accent font-display flex items-baseline gap-2 text-lg font-bold transition-colors">
                  <span aria-hidden="true" className="text-base">
                    {link.icon}
                  </span>
                  <span className="min-w-0">{link.title}</span>
                </h3>
                <p className="text-ink-2 mt-2 leading-relaxed">{link.description}</p>
                <span className="text-accent mt-4 inline-flex items-center gap-1 text-sm font-bold whitespace-nowrap">
                  {link.label}
                  <span
                    aria-hidden="true"
                    className="transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
