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

// Community uses react-aria <Link> for keyboard / press-state behavior, so it
// renders the Card visuals inline rather than wrapping with the <Card>
// component (which renders a plain <div>). Keep the class chain identical to
// the Card "interactive" variant so the visual stays unified.
const cardCls =
  "block bg-surface-card dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl hover:border-primary-500 dark:hover:border-primary-400 border border-slate-200 dark:border-slate-700 transition-shadow transition-colors group";

export const Community = ({ title, subtitle, links }: CommunityProps) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-slate-50 dark:bg-slate-900/50">
      <h2 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-4 text-center">
        {title}
      </h2>
      <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 text-center max-w-2xl mx-auto">
        {subtitle}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cardCls}
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl group-hover:scale-110 transition-transform">{link.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {link.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-3">{link.description}</p>
                <span className="text-primary-600 dark:text-primary-400 font-semibold inline-flex items-center gap-1">
                  {link.label}
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
