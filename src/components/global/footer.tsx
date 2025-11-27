import footerEn from '@private/lang/components/global/en/footer.json';
import footerJa from '@private/lang/components/global/ja/footer.json';

const footerData = {
  en: footerEn,
  ja: footerJa,
};

interface FooterProps {
  lang?: string;
}

export const Footer = ({ lang = 'en' }: FooterProps) => {
  const locale = (lang as keyof typeof footerData) || 'en';
  const content = footerData[locale];

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Branding */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <img
                src="/images/rox-horizontal.svg"
                alt="Rox"
                className="h-8 w-auto dark:hidden"
              />
              <img
                src="/images/rox-horizontal-white.svg"
                alt="Rox"
                className="h-8 w-auto hidden dark:block"
              />
            </div>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              {content.branding.tagline}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {content.branding.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
              {content.sections.quickLinks}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`/${locale}/docs`}
                  className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {content.links.docs}
                </a>
              </li>
              <li>
                <a
                  href={`/${locale}/blog`}
                  className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {content.links.blog}
                </a>
              </li>
              <li>
                <a
                  href={`/${locale}/assets`}
                  className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {content.links.assets}
                </a>
              </li>
              <li>
                <a
                  href={`/${locale}/contact`}
                  className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {content.links.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
              {content.sections.community}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://github.com/Love-Rox/rox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  {content.links.github}
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/love_rox_cc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  {content.links.twitter}
                </a>
              </li>
            </ul>
          </div>

          {/* Project Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
              {content.sections.project}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              {content.madeWith}
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            {content.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};
