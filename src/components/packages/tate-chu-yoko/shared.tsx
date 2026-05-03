import { Link } from "waku";

export type Locale = "en" | "ja";

export type AdapterKey = "core" | "react" | "vue" | "rehype" | "astro";

export interface AdapterMeta {
  key: AdapterKey;
  name: string;
  short: string;
  href: (locale: Locale) => string;
  isNew?: boolean;
}

export const ADAPTERS: AdapterMeta[] = [
  {
    key: "core",
    name: "@love-rox/tcy-core",
    short: "core",
    href: (l) => `/${l}/packages/tate-chu-yoko`,
  },
  {
    key: "react",
    name: "@love-rox/tcy-react",
    short: "react",
    href: (l) => `/${l}/packages/tate-chu-yoko/react`,
  },
  {
    key: "vue",
    name: "@love-rox/tcy-vue",
    short: "vue",
    href: (l) => `/${l}/packages/tate-chu-yoko/vue`,
  },
  {
    key: "rehype",
    name: "@love-rox/tcy-rehype",
    short: "rehype",
    href: (l) => `/${l}/packages/tate-chu-yoko/rehype`,
  },
  {
    key: "astro",
    name: "@love-rox/tcy-astro",
    short: "astro",
    href: (l) => `/${l}/packages/tate-chu-yoko/astro`,
    isNew: true,
  },
];

export function AdapterNav({ current, locale }: { current: AdapterKey; locale: Locale }) {
  return (
    <nav aria-label="tate-chu-yoko packages" className="mb-10">
      <ul className="flex flex-wrap gap-2">
        {ADAPTERS.map((a) => {
          const active = a.key === current;
          return (
            <li key={a.key}>
              <Link
                to={a.href(locale) as `/${string}`}
                className={[
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs border transition-colors",
                  active
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-500",
                ].join(" ")}
              >
                <span>{a.short}</span>
                {a.isNew ? (
                  <span
                    className={[
                      "ml-0.5 inline-flex items-center px-1.5 rounded-sm text-[10px] font-sans font-bold uppercase tracking-wider",
                      active
                        ? "bg-white/25 text-white"
                        : "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200",
                    ].join(" ")}
                  >
                    new
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">{heading}</h2>
      {children}
    </section>
  );
}

export function Prose({ children }: { children: string }) {
  return (
    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
      <InlineMd text={children} />
    </p>
  );
}

export function InlineMd({ text }: { text: string }) {
  // Tokenize: handle **bold** and `code` segments without nesting.
  // Pattern keeps each match as its own segment; bold wins outside backticks.
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
          return (
            <code
              key={i}
              className="font-mono text-[0.9em] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-primary-700 dark:text-primary-300"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
          return (
            <strong key={i} className="font-semibold text-slate-900 dark:text-slate-100">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
      {children}
    </span>
  );
}

export function NewBadge({ label = "NEW" }: { label?: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-primary-600 text-white">
      {label}
    </span>
  );
}

export function SnippetBlock({
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

export interface OptionRow {
  name: string;
  type: string;
  default: string;
  description: string;
}

export function OptionsTable({
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

export function InstallCommands({ pkg }: { pkg: string }) {
  const commands = [
    { manager: "bun", command: `bun add ${pkg}` },
    { manager: "pnpm", command: `pnpm add ${pkg}` },
    { manager: "npm", command: `npm i ${pkg}` },
    { manager: "yarn", command: `yarn add ${pkg}` },
  ];
  return (
    <div className="grid sm:grid-cols-2 gap-3 mt-4">
      {commands.map(({ manager, command }) => (
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
  );
}

export const SHARED_OPTIONS = {
  ja: [
    {
      name: "target",
      type: "'alphanumeric' | 'alpha' | 'digit' | 'ascii' | RegExp",
      default: "'alphanumeric'",
      description:
        "縦中横対象として扱う文字種。`alphanumeric` は `[0-9A-Za-z]`、`ascii` は印字可能な ASCII 全般。任意の RegExp も指定可能。",
    },
    {
      name: "combine",
      type: "boolean",
      default: "true",
      description:
        "連続した対象文字を1つのスパンにまとめるか。`false` にすると1文字ずつ別々のスパンで包みます。",
    },
    {
      name: "include",
      type: "string | string[]",
      default: "undefined",
      description: "`target` に含まれなくても対象として扱う追加の文字。",
    },
    {
      name: "exclude",
      type: "string | string[]",
      default: "undefined",
      description: "対象から外したい文字。`include` より優先されます。",
    },
    {
      name: "maxLength",
      type: "number",
      default: "undefined",
      description:
        "縦中横セグメントの最大文字数。これを超える長さの英数字 run はプレーンテキストに戻ります。たとえば `maxLength: 2` にすると `2026` のような4桁年は寝かせ、`1` や `19` の短い run のみを縦中横にできます。",
    },
    {
      name: "excludeWords",
      type: "string[]",
      default: "undefined",
      description:
        "縦中横にしたくない語を完全一致で指定（部分一致ではなくセグメント値全体のマッチ）。`URL` `API` のような固有の略号や、特定の年号だけを横倒しのまま残したいときに便利。",
    },
  ] as OptionRow[],
  en: [
    {
      name: "target",
      type: "'alphanumeric' | 'alpha' | 'digit' | 'ascii' | RegExp",
      default: "'alphanumeric'",
      description:
        "What counts as a tate-chu-yoko target. `alphanumeric` matches `[0-9A-Za-z]`; `ascii` covers printable ASCII. A custom RegExp is accepted.",
    },
    {
      name: "combine",
      type: "boolean",
      default: "true",
      description:
        "Merge consecutive target characters into a single span. Set to `false` to wrap each character individually.",
    },
    {
      name: "include",
      type: "string | string[]",
      default: "undefined",
      description: "Extra characters to treat as targets regardless of `target`.",
    },
    {
      name: "exclude",
      type: "string | string[]",
      default: "undefined",
      description: "Characters to exclude. Takes precedence over `include`.",
    },
    {
      name: "maxLength",
      type: "number",
      default: "undefined",
      description:
        "Maximum length for a tcy segment. Runs longer than this are demoted back to plain text — for example `maxLength: 2` keeps single digits and pairs uprighted while leaving four-digit years like `2026` lying on their side.",
    },
    {
      name: "excludeWords",
      type: "string[]",
      default: "undefined",
      description:
        "Exact words to exclude from tcy wrapping. Matched against the whole segment value (not a substring) — useful for keeping acronyms like `URL` / `API` or specific years out of the upright treatment.",
    },
  ] as OptionRow[],
};

export const COMPONENT_OPTIONS = {
  ja: [
    {
      name: "className",
      type: "string",
      default: "'tcy'",
      description: "生成される span に付与するクラス名。",
    },
    {
      name: "as",
      type: "keyof JSX.IntrinsicElements",
      default: "'span'",
      description: "ラップに使用するタグ名。",
    },
  ] as OptionRow[],
  en: [
    {
      name: "className",
      type: "string",
      default: "'tcy'",
      description: "Class applied to each generated span.",
    },
    {
      name: "as",
      type: "keyof JSX.IntrinsicElements",
      default: "'span'",
      description: "Tag name used for wrapping.",
    },
  ] as OptionRow[],
};

export const REHYPE_OPTIONS = {
  ja: [
    {
      name: "tagName",
      type: "string",
      default: "'span'",
      description: "ラップに使用するタグ名。",
    },
    {
      name: "className",
      type: "string | string[]",
      default: "'tcy'",
      description: "ラップ要素に付与するクラス名（配列で複数指定可）。",
    },
    {
      name: "skipTags",
      type: "string[]",
      default: "['code', 'pre', 'script', 'style']",
      description:
        "走査をスキップするタグ。`<code>` `<pre>` などコード表示中のテキストはデフォルトで処理されません。",
    },
  ] as OptionRow[],
  en: [
    {
      name: "tagName",
      type: "string",
      default: "'span'",
      description: "Tag name used for wrapping.",
    },
    {
      name: "className",
      type: "string | string[]",
      default: "'tcy'",
      description:
        "Class name(s) applied to the wrapping element. Pass an array for multiple classes.",
    },
    {
      name: "skipTags",
      type: "string[]",
      default: "['code', 'pre', 'script', 'style']",
      description:
        "Tags whose subtrees are left untouched. Code/pre/script/style content is skipped by default.",
    },
  ] as OptionRow[],
};

export const ASTRO_INTEGRATION_OPTIONS = {
  ja: [
    {
      name: "markdown",
      type: "boolean",
      default: "true",
      description:
        "Markdown / MDX パイプラインに `rehype-tcy` を登録するか。`false` にするとインテグレーションは何もしません（`<Tcy>` コンポーネントだけ使う構成にできます）。",
    },
  ] as OptionRow[],
  en: [
    {
      name: "markdown",
      type: "boolean",
      default: "true",
      description:
        "Whether to register `rehype-tcy` on the Markdown / MDX pipeline. Set to `false` to opt out (e.g. if you only want the `<Tcy>` component).",
    },
  ] as OptionRow[],
};

export const RECOMMENDED_CSS = `.tcy {
  -webkit-text-combine: horizontal;
  text-combine-upright: all;
}`;

export const NPM_BASE = "https://www.npmjs.com/package/";
export const GITHUB_ROOT = "https://github.com/Love-Rox/tate-chu-yoko";

export function npmUrl(pkg: string) {
  return `${NPM_BASE}${pkg}`;
}

export function githubPackageUrl(folder: string) {
  return `${GITHUB_ROOT}/tree/main/packages/${folder}#readme`;
}
