import { Link } from "waku";
import type { PageProps } from "waku/router";
import { Meta } from "@/components/global/meta";
import { Breadcrumbs, generateBreadcrumbItems } from "@/components/common/breadcrumbs";
import { BreadcrumbSchema } from "@/components/seo/structured-data";
import { Tcy } from "@love-rox/tcy-react";
import tcyLangJa from "@private/lang/pages/ja/packages/tate-chu-yoko.json";
import tcyLangEn from "@private/lang/pages/en/packages/tate-chu-yoko.json";

const langData = { en: tcyLangEn, ja: tcyLangJa };

const NPM_URL = "https://www.npmjs.com/package/@love-rox/tcy-react";
const GITHUB_URL = "https://github.com/Love-Rox/tate-chu-yoko";

const installCommands = [
  { manager: "bun", command: "bun add @love-rox/tcy-react" },
  { manager: "pnpm", command: "pnpm add @love-rox/tcy-react" },
  { manager: "npm", command: "npm i @love-rox/tcy-react" },
  { manager: "yarn", command: "yarn add @love-rox/tcy-react" },
];

const reactSnippet = `import { Tcy } from "@love-rox/tcy-react";

export function Chapter() {
  return (
    <p style={{ writingMode: "vertical-rl" }}>
      <Tcy>第1章 2026年4月、Webの縦書きは進化した。</Tcy>
    </p>
  );
}`;

const vueSnippet = `<script setup lang="ts">
import { Tcy } from "@love-rox/tcy-vue";
</script>

<template>
  <p style="writing-mode: vertical-rl">
    <Tcy>第1章 2026年4月、Webの縦書きは進化した。</Tcy>
  </p>
</template>`;

const coreSnippet = `import { tokenize } from "@love-rox/tcy-core";

tokenize("第1章 2026年4月");
// [
//   { type: "text", value: "第" },
//   { type: "tcy",  value: "1" },
//   { type: "text", value: "章 " },
//   { type: "tcy",  value: "2026" },
//   { type: "text", value: "年" },
//   { type: "tcy",  value: "4" },
//   { type: "text", value: "月" },
// ]`;

const cssSnippet = `.tcy {
  -webkit-text-combine: horizontal;
  text-combine-upright: all;
}`;

const PREVIEW_SAMPLE = "第1章 2026年4月、Webの縦書きは進化した。";

export default async function TateChuYokoPackagePage({
  lang,
}: PageProps<"/[lang]/packages/tate-chu-yoko">) {
  const locale = (lang as keyof typeof langData) || "en";
  const content = langData[locale];
  const url = `/${locale}/packages/tate-chu-yoko`;
  const demoUrl = `/${locale}/packages/tate-chu-yoko/demo`;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
      <Meta
        title={`${content.hero.heading} - ${content.hero.eyebrow} - Rox`}
        description={content.hero.tagline}
        url={url}
        lang={locale}
      />
      <BreadcrumbSchema
        items={generateBreadcrumbItems([{ label: content.hero.heading, href: url }], locale)}
      />
      <Breadcrumbs items={[{ label: content.hero.heading }]} lang={locale} />

      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <section className="mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-3">
            {content.hero.eyebrow}
          </p>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-slate-100 mb-5 font-mono">
            {content.hero.heading}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            {content.hero.tagline}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            <Badge>{content.hero.badges.version}</Badge>
            <Badge>{content.hero.badges.license}</Badge>
            <Badge>{content.hero.badges.ssr}</Badge>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to={demoUrl as `/${string}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors"
            >
              {content.hero.ctaDemo}
            </Link>
            <a
              href={NPM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors"
            >
              {content.hero.ctaNpm}
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors"
            >
              {content.hero.ctaGithub}
            </a>
          </div>
        </section>

        {/* Static preview (actually uses <Tcy> to render SSR output) */}
        <section className="mb-16">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8">
            <style>{`
              .tcy-preview-scope .tcy {
                -webkit-text-combine: horizontal;
                text-combine-upright: all;
              }
              .tcy-preview-vertical {
                writing-mode: vertical-rl;
                font-size: 1.75rem;
                line-height: 2;
                height: 18rem;
                font-family: "Noto Serif JP", "Yu Mincho", serif;
              }
            `}</style>
            <div className="tcy-preview-scope flex justify-center">
              <p className="tcy-preview-vertical text-slate-900 dark:text-slate-100">
                <Tcy>{PREVIEW_SAMPLE}</Tcy>
              </p>
            </div>
          </div>
        </section>

        {/* Problem */}
        <Section heading={content.problem.heading}>
          <Prose>{content.problem.body}</Prose>
        </Section>

        {/* Three packages */}
        <Section heading={content.packages.heading}>
          <Prose>{content.packages.description}</Prose>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {content.packages.items.map((pkg) => (
              <div
                key={pkg.name}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5"
              >
                <p className="font-mono text-sm text-primary-700 dark:text-primary-300 mb-1 break-all">
                  {pkg.name}
                </p>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  {pkg.role}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  <InlineMd text={pkg.description} />
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* Install */}
        <Section heading={content.install.heading}>
          <Prose>{content.install.description}</Prose>
          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            {installCommands.map(({ manager, command }) => (
              <div
                key={manager}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4"
              >
                <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  {manager}
                </p>
                <code className="font-mono text-sm text-slate-900 dark:text-slate-100 break-all">
                  {command}
                </code>
              </div>
            ))}
          </div>
        </Section>

        {/* Usage */}
        <Section heading={content.usage.heading}>
          <Prose>{content.usage.description}</Prose>

          <SnippetBlock label={content.usage.reactLabel} code={reactSnippet} language="tsx" />
          <SnippetBlock label={content.usage.vueLabel} code={vueSnippet} language="vue" />
          <SnippetBlock label={content.usage.coreLabel} code={coreSnippet} language="ts" />

          <div className="mt-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {content.usage.css.heading}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-3">
              <InlineMd text={content.usage.css.description} />
            </p>
            <SnippetBlock label="CSS" code={cssSnippet} language="css" />
          </div>
        </Section>

        {/* Options */}
        <Section heading={content.options.heading}>
          <Prose>{content.options.description}</Prose>

          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-6 mb-3">
            {content.options.sharedLabel}
          </h3>
          <OptionsTable columns={content.options.columns} rows={content.options.shared} />

          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-8 mb-3">
            {content.options.componentLabel}
          </h3>
          <OptionsTable columns={content.options.columns} rows={content.options.component} />
        </Section>

        {/* Behavior */}
        <Section heading={content.behavior.heading}>
          <ul className="space-y-2 list-disc list-inside text-slate-700 dark:text-slate-300">
            {content.behavior.items.map((item, i) => (
              <li key={i} className="leading-relaxed">
                <InlineMd text={item} />
              </li>
            ))}
          </ul>
        </Section>

        {/* Browser support */}
        <Section heading={content.browser.heading}>
          <Prose>{content.browser.body}</Prose>
        </Section>

        {/* License */}
        <Section heading={content.license.heading}>
          <Prose>{content.license.body}</Prose>
        </Section>

        {/* CTA */}
        <section className="mt-16 mb-8 rounded-xl border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-950 p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {content.cta.heading}
          </h2>
          <p className="text-slate-700 dark:text-slate-300 mb-5">
            <InlineMd text={content.cta.body} />
          </p>
          <Link
            to={demoUrl as `/${string}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors"
          >
            {content.cta.button}
          </Link>
        </section>
      </div>
    </div>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">{heading}</h2>
      {children}
    </section>
  );
}

function Prose({ children }: { children: string }) {
  return (
    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
      <InlineMd text={children} />
    </p>
  );
}

function InlineMd({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("`") && part.endsWith("`") && part.length >= 2 ? (
          <code
            key={i}
            className="font-mono text-[0.9em] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-primary-700 dark:text-primary-300"
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
      {children}
    </span>
  );
}

function SnippetBlock({
  label,
  code,
  language,
}: {
  label: string;
  code: string;
  language: string;
}) {
  return (
    <div className="mt-4 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{label}</span>
        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{language}</span>
      </div>
      <pre className="bg-slate-950 text-slate-100 text-sm leading-relaxed p-4 overflow-x-auto m-0">
        <code>{code}</code>
      </pre>
    </div>
  );
}

interface OptionRow {
  name: string;
  type: string;
  default: string;
  description: string;
}

function OptionsTable({
  columns,
  rows,
}: {
  columns: { name: string; type: string; default: string; description: string };
  rows: OptionRow[];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
      <table className="w-full text-sm">
        <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
          <tr>
            <th className="text-left font-semibold px-4 py-3">{columns.name}</th>
            <th className="text-left font-semibold px-4 py-3">{columns.type}</th>
            <th className="text-left font-semibold px-4 py-3">{columns.default}</th>
            <th className="text-left font-semibold px-4 py-3">{columns.description}</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-slate-900">
          {rows.map((row) => (
            <tr
              key={row.name}
              className="border-t border-slate-200 dark:border-slate-700 align-top"
            >
              <td className="px-4 py-3 font-mono text-slate-900 dark:text-slate-100 whitespace-nowrap">
                {row.name}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-slate-700 dark:text-slate-300">
                {row.type}
              </td>
              <td className="px-4 py-3 font-mono text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">
                {row.default}
              </td>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300 leading-relaxed">
                <InlineMd text={row.description} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: "static",
    staticPaths: ["en", "ja"],
  } as const;
};
