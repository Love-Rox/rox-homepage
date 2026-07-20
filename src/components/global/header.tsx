"use client";

import { useEffect, useState } from "react";
import { ClientRouterHelper } from "@/helper/ClientRouterHelper";
import { DarkModeToggle } from "@/components/common/dark-mode-toggle";

interface NavItem {
  name: string;
  href: string;
}

interface HeaderProps {
  lang: string;
  navItems?: NavItem[];
  cta?: NavItem;
}

/**
 * Hallmark N1b — canonical three-section nav.
 *
 * Wordmark hard-left · centred link cluster · utilities + primary CTA
 * hard-right. Transparent at rest over the hero, frosts past 24px of scroll.
 *
 * Replaces the previous transparent `absolute` overlay bar, which scrolled
 * away with the page and carried no CTA. Stays `fixed` (not `sticky`) so the
 * `pt-24` every page already applies still lines up — switching to `sticky`
 * would double the top spacing on all nine routes.
 */
export const Header = ({ lang, navItems = [], cta }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // rAF-throttled: scroll fires far more often than we need to flip one class.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const logo = (heightClass: string) => (
    <>
      <img
        alt="Rox Logo"
        src="/images/rox-horizontal.svg"
        className={`block ${heightClass} w-auto dark:hidden`}
      />
      <img
        alt="Rox Logo White"
        src="/images/rox-horizontal-white.svg"
        className={`hidden ${heightClass} w-auto dark:block`}
      />
    </>
  );

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
        scrolled
          ? "border-rule bg-paper/70 shadow-[var(--shadow-nav)] backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-transparent",
      ].join(" ")}
      style={{ transitionTimingFunction: "var(--ease-out)" }}
    >
      <nav
        aria-label="Global"
        className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8"
      >
        {/* — Brand (hard-left) — */}
        <div className="justify-self-start">
          <a href={`/${lang}`} className="group relative -m-1.5 inline-block p-1.5">
            <span className="sr-only">Rox</span>
            {logo("h-9 sm:h-10")}
            {/* Decorative ♥ — breathes once every ~6s, lights up on logo hover.
                Reduced-motion handled in styles.css. */}
            <span
              aria-hidden="true"
              className="rox-heart-pulse text-accent absolute -top-0.5 -right-2 text-[11px] leading-none select-none group-hover:!scale-110 group-hover:!opacity-100"
            >
              ♥
            </span>
          </a>
        </div>

        {/* — Centre cluster (desktop only) — */}
        <div className="hidden lg:flex lg:justify-self-center lg:gap-x-1">
          {navItems.map((item) => {
            const external = item.href.startsWith("http");
            return (
              <a
                key={item.name}
                href={item.href}
                {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                className="text-ink-2 hover:text-ink hover:bg-paper-3 rounded-[var(--radius-input)] px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors"
              >
                {item.name}
              </a>
            );
          })}
        </div>

        {/* — Utilities + primary CTA (hard-right) — */}
        <div className="flex items-center justify-self-end gap-x-2 sm:gap-x-3">
          <div className="hidden items-center gap-x-2 lg:flex">
            <DarkModeToggle />
            <ClientRouterHelper currentLang={lang || "en"} />
          </div>

          {/* The site's single primary action. Kept in the bar at every width —
              "利用開始を促す" is the page's stated job, so it must never be a
              tap deeper than the logo. `whitespace-nowrap` keeps it one line. */}
          {cta && (
            <a
              href={cta.href}
              className="bg-accent text-accent-ink hover:bg-accent/90 inline-flex min-h-11 items-center rounded-[var(--radius-pill)] px-4 text-sm font-bold whitespace-nowrap transition-colors sm:px-5"
            >
              {cta.name}
            </a>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="text-ink -m-2.5 inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-input)] p-2.5 lg:hidden"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* — Mobile drawer — */}
      {mobileMenuOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-50 cursor-default bg-black/20"
          />

          <div className="bg-paper-2 ring-rule fixed inset-y-0 right-0 z-50 w-full overflow-y-auto px-6 py-4 shadow-xl sm:max-w-sm sm:ring-1">
            <div className="flex items-center justify-between">
              <a href={`/${lang}`} className="-m-1.5 p-1.5">
                <span className="sr-only">Rox</span>
                {logo("h-8")}
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="text-ink -m-2.5 inline-flex min-h-11 min-w-11 items-center justify-center rounded-[var(--radius-input)] p-2.5"
              >
                <span className="sr-only">Close menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="divide-rule mt-6 flex flex-col divide-y">
              <div className="flex flex-col gap-1 pb-6">
                {navItems.map((item) => {
                  const external = item.href.startsWith("http");
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                      className="text-ink hover:bg-paper-3 -mx-3 flex min-h-11 items-center rounded-[var(--radius-input)] px-3 text-base font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  );
                })}
              </div>
              <div className="flex flex-col gap-2 py-6">
                <div className="text-ink -mx-3 flex min-h-11 items-center justify-between px-3 text-base font-medium">
                  <span>Language</span>
                  <ClientRouterHelper currentLang={lang || "en"} />
                </div>
                <div className="text-ink -mx-3 flex min-h-11 items-center justify-between px-3 text-base font-medium">
                  <span>Theme</span>
                  <DarkModeToggle />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
