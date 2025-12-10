"use client";

import { useState } from "react";
import { ClientRouterHelper } from "@/helper/ClientRouterHelper";
import { DarkModeToggle } from "@/components/common/dark-mode-toggle";

interface NavItem {
  name: string;
  href: string;
}

interface HeaderProps {
  lang: string;
  navItems?: NavItem[];
}

export const Header = ({ lang, navItems = [] }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <a href={`/${lang}`} className="-m-1.5 p-1.5">
            <span className="sr-only">Rox</span>
            <img
              alt=""
              src="/images/rox-horizontal.svg"
              className="block h-10 w-auto dark:hidden"
            />
            <img
              alt=""
              src="/images/rox-horizontal-white.svg"
              className="hidden h-10 w-auto dark:block"
            />
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 dark:text-gray-200"
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

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Desktop language switcher and dark mode toggle */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4">
          <DarkModeToggle />
          <ClientRouterHelper currentLang={lang || "en"} />
        </div>
      </nav>

      {/* Mobile menu dialog */}
      {mobileMenuOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          {/* Background backdrop */}
          <div className="fixed inset-0 z-50" />

          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white dark:bg-slate-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:sm:ring-gray-100/10 shadow-xl">
            <div className="flex items-center justify-between">
              <a href={`/${lang}`} className="-m-1.5 p-1.5">
                <span className="sr-only">Rox</span>
                <img
                  alt=""
                  src="/images/rox-horizontal.svg"
                  className="block h-8 w-auto dark:hidden"
                />
                <img
                  alt=""
                  src="/images/rox-horizontal-white.svg"
                  className="hidden h-8 w-auto dark:block"
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-200"
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10 dark:divide-gray-500/20">
                <div className="space-y-2 py-6">
                  {navItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <div className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
                    <div className="flex items-center justify-between">
                      <span>Language</span>
                      <ClientRouterHelper currentLang={lang || "en"} />
                    </div>
                  </div>
                  <div className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
                    <div className="flex items-center justify-between">
                      <span>Theme</span>
                      <DarkModeToggle />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
