"use client";

import { ClientRouterHelper } from "@/helper/ClientRouterHelper";

interface NavItem {
  name: string;
  href: string;
}

interface HeaderProps {
  lang: string;
  navItems?: NavItem[];
}

export const Header = ({ lang, navItems = [] }: HeaderProps) => {
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
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <ClientRouterHelper currentLang={lang || "en"} />
        </div>
      </nav>
    </header>
  );
};
