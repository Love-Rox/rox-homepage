import { PageProps } from "waku/router";
import { ContactForm } from "@/components/contact/ContactForm";
import contactLangEn from "@private/lang/pages/en/contact.json";
import contactLangJa from "@private/lang/pages/ja/contact.json";
import { Breadcrumbs, generateBreadcrumbItems } from "@/components/common/breadcrumbs";
import { BreadcrumbSchema } from "@/components/seo/structured-data";

const contactLang = {
  en: contactLangEn,
  ja: contactLangJa,
};

export default async function ContactPage({ lang }: PageProps<"/[lang]/contact">) {
  const locale = (lang as "en" | "ja") || "en";
  const content = contactLang[locale];

  return (
    <div className="mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
      <title>{content.title}</title>
      <meta name="description" content={content.subtitle} />
      <BreadcrumbSchema
        items={generateBreadcrumbItems(
          [{ label: content.heading, href: `/${locale}/contact` }],
          locale,
        )}
      />

      <div className="mx-auto max-w-4xl">
        <Breadcrumbs items={[{ label: content.heading }]} lang={locale} />

        <header className="border-rule mt-6 border-b pb-10">
          <h1 className="hallmark-display text-ink text-[length:var(--text-display-s)]">
            {content.heading}
          </h1>
          <p className="text-ink-2 mt-4 max-w-[52ch] text-lg leading-relaxed">{content.subtitle}</p>
        </header>

        <div className="pt-12">
          <ContactForm lang={content} />
        </div>
      </div>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "dynamic",
  } as const;
};
