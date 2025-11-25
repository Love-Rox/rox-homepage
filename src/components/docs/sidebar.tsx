"use client";

import { Link } from "react-aria-components";

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
  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 dark:border-slate-700 pr-6">
      <nav className="sticky top-24 space-y-6">
        {categories.map((category) => (
          <div key={category.category}>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
              {category.category}
            </h3>
            <ul className="space-y-1">
              {category.items.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/${lang}/docs/${item.slug}`}
                    className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
                      currentSlug === item.slug
                        ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
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
  );
};
