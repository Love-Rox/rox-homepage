import footerEn from "@private/lang/components/global/en/footer.json";
import footerJa from "@private/lang/components/global/ja/footer.json";

const footerData = {
  en: footerEn,
  ja: footerJa,
};

interface FooterProps {
  lang?: string;
}

/**
 * Hallmark Ft5 — Statement footer.
 *
 * One large display sentence (the brand tagline, which is also the hero
 * heading — the repetition is the point) over a flat link row and a meta bar.
 *
 * Replaces the previous 5-column grid, whose "Project" column held a heading
 * and a single line of text with no links and read as half-empty. Every
 * destination from that grid survives here in the flat row; nothing was cut.
 */
export const Footer = ({ lang = "en" }: FooterProps) => {
  const locale = (lang as keyof typeof footerData) || "en";
  const content = footerData[locale];
  const tcy = locale === "ja" ? "https://tcy.love-rox.cc/" : "https://tcy.love-rox.cc/en";
  const tcyDemo =
    locale === "ja" ? "https://tcy.love-rox.cc/demo" : "https://tcy.love-rox.cc/en/demo";

  const internal = [
    { label: content.links.docs, href: `/${locale}/docs` },
    { label: content.links.blog, href: `/${locale}/blog` },
    { label: content.links.assets, href: `/${locale}/assets` },
    { label: content.links.contact, href: `/${locale}/contact` },
  ];
  const external = [
    { label: content.links.tateChuYoko, href: tcy },
    { label: content.links.tateChuYokoDemo, href: tcyDemo },
  ];

  const linkClass =
    "text-ink-2 hover:text-accent inline-flex min-h-11 items-center text-sm whitespace-nowrap transition-colors";

  return (
    <footer className="border-rule bg-paper-2 mt-auto border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* — The statement. Same string as the hero heading; the refrain is
              deliberate. Roman only, never italic. — */}
        <p className="hallmark-display text-ink max-w-[28ch] text-[clamp(1.75rem,5vw,3.25rem)]">
          {content.branding.tagline}
        </p>
        <p className="text-ink-2 mt-4 max-w-[52ch] text-sm">{content.branding.description}</p>

        {/* — Flat link row. Every destination from the old 5-column grid.
              `whitespace-nowrap` on each link prevents two-line tap targets
              at 320px; the row wraps between links instead. — */}
        <nav
          aria-label="Footer"
          className="border-rule mt-10 flex flex-wrap items-center gap-x-6 gap-y-1 border-t pt-6"
        >
          {internal.map((l) => (
            <a key={l.href} href={l.href} className={linkClass}>
              {l.label}
            </a>
          ))}

          {/* Hairline divider marks the internal → external boundary, doing
              the job the old `lg:border-l` column separator did. */}
          <span aria-hidden="true" className="bg-rule hidden h-4 w-px sm:block" />

          {externalLinks(external, linkClass)}

          <span aria-hidden="true" className="bg-rule hidden h-4 w-px sm:block" />

          <a
            href="https://github.com/Love-Rox/rox"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            {content.links.github}
          </a>
          <a
            href="https://x.com/love_rox_cc"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            {content.links.twitter}
          </a>
        </nav>

        {/* — Meta bar. `madeWith` moves here from the old "Project" column;
              the mono colophon is preserved as-is. — */}
        <div className="border-rule mt-6 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-baseline sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-ink-2 text-sm">{content.copyright}</p>
            <p className="text-ink-2 text-xs">{content.madeWith}</p>
          </div>
          <p className="text-ink-2 font-mono text-[11px] tracking-wide">
            <span aria-hidden="true">{"// built with ❤️ on "}</span>
            <a
              href="https://waku.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              waku
            </a>
            <span aria-hidden="true">{" · cloudflare workers"}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

function externalLinks(links: { label: string; href: string }[], linkClass: string) {
  return links.map((l) => (
    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {l.label}
    </a>
  ));
}
