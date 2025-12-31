import { Link } from 'waku';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  lang: 'en' | 'ja';
}

const homeLabels = {
  en: 'Home',
  ja: 'ホーム',
};

export const Breadcrumbs = ({ items, lang }: BreadcrumbsProps) => {
  // Prepend home
  const allItems: BreadcrumbItem[] = [
    { label: homeLabels[lang], href: `/${lang}` },
    ...items,
  ];

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-slate-400 dark:text-slate-500" aria-hidden="true">
                  /
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  className={isLast ? 'text-slate-900 dark:text-slate-100 font-medium' : ''}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href as `/${string}`}
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// Helper function to generate breadcrumb schema items
export const generateBreadcrumbItems = (
  items: BreadcrumbItem[],
  lang: 'en' | 'ja'
): { name: string; url: string }[] => {
  const homeItem = { name: homeLabels[lang], url: `/${lang}` };
  const schemaItems = items.map((item) => ({
    name: item.label,
    url: item.href || '',
  }));
  return [homeItem, ...schemaItems];
};
