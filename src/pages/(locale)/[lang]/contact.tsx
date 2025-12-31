import { PageProps } from 'waku/router';
import { ContactForm } from '@/components/contact/ContactForm';
import contactLangEn from '@private/lang/pages/en/contact.json';
import contactLangJa from '@private/lang/pages/ja/contact.json';
import { Breadcrumbs, generateBreadcrumbItems } from '@/components/common/breadcrumbs';
import { BreadcrumbSchema } from '@/components/seo/structured-data';

const contactLang = {
  en: contactLangEn,
  ja: contactLangJa,
};

export default async function ContactPage({ lang }: PageProps<'/[lang]/contact'>) {
  const locale = (lang as 'en' | 'ja') || 'en';
  const content = contactLang[locale];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
      <title>{content.title}</title>
      <meta name="description" content={content.subtitle} />
      <BreadcrumbSchema items={generateBreadcrumbItems([{ label: content.heading, href: `/${locale}/contact` }], locale)} />

      <div className="max-w-4xl mx-auto">
        <Breadcrumbs items={[{ label: content.heading }]} lang={locale} />

        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-4">
            {content.heading}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            {content.subtitle}
          </p>
        </div>

        <ContactForm lang={content} />
      </div>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: 'dynamic',
  } as const;
};
