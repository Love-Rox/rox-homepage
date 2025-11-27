"use client";

import { useState } from "react";
import { Link } from "waku";

interface DocLink {
  slug: string;
  title: string;
}

interface DocCategory {
  category: string;
  items: DocLink[];
}

interface SidebarProps {
  categories: DocCategory[];
  currentSlug?: string;
  lang: string;
}

export const DocsSidebar = ({
  categories,
  currentSlug,
  lang,
}: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <div className="lg:hidden mb-6">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
          Menu
        </button>
      </div>

      {/* Mobile drawer backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar content */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 px-6 py-6 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 lg:shadow-none lg:bg-transparent lg:dark:bg-transparent lg:p-0 lg:w-64 lg:shrink-0 lg:border-r lg:border-slate-200 lg:dark:border-slate-700 lg:pr-6
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between lg:hidden mb-6">
          <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Menu
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="-m-2.5 rounded-md p-2.5 text-slate-700 dark:text-slate-200"
          >
            <span className="sr-only">Close menu</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="sticky top-24 space-y-6 overflow-y-auto max-h-[calc(100vh-6rem)] lg:max-h-[calc(100vh-8rem)]">
          {categories.map((category) => (
            <div key={category.category}>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {category.category}
              </h3>
              <ul className="space-y-1">
                {category.items.map((item) => (
                  <li key={item.slug}>
                    <Link
                      to={`/${lang}/docs/${item.slug}` as `/${string}`}
                      className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${currentSlug === item.slug
                          ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};
