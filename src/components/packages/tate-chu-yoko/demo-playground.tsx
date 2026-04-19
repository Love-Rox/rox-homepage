"use client";

import { useMemo, useState } from "react";
import { Tcy } from "@love-rox/tcy-react";
import { tokenize, type TargetPreset } from "@love-rox/tcy-core";

type Lang = "en" | "ja";

const copy = {
  en: {
    input: "Input text",
    target: "Target",
    combine: "Combine consecutive targets",
    include: "Extra characters to include",
    includePlaceholder: "e.g. .",
    exclude: "Characters to exclude",
    excludePlaceholder: "e.g. -",
    raw: "Without <Tcy> (plain vertical)",
    processed: "With <Tcy> (uprighted)",
    html: "Generated HTML",
    note: "Vertical-writing support and `text-combine-upright` work in all modern browsers. If the uprighted side looks identical to the raw side, check that your browser has `text-combine-upright: all` enabled.",
    targetLabels: {
      alphanumeric: "alphanumeric (A–Z, a–z, 0–9)",
      alpha: "alpha (A–Z, a–z)",
      digit: "digit (0–9)",
      ascii: "ascii (printable ASCII)",
    },
  },
  ja: {
    input: "入力テキスト",
    target: "対象 (target)",
    combine: "連続した対象文字を1つのスパンにまとめる",
    include: "追加で対象に含める文字 (include)",
    includePlaceholder: "例: .",
    exclude: "対象から外す文字 (exclude)",
    excludePlaceholder: "例: -",
    raw: "<Tcy> なし（素の縦組み）",
    processed: "<Tcy> あり（縦中横）",
    html: "生成されたHTML",
    note: "縦書きと `text-combine-upright` はモダンブラウザで動作します。右側と左側で見た目が変わらない場合、お使いのブラウザで `text-combine-upright: all` が有効かご確認ください。",
    targetLabels: {
      alphanumeric: "alphanumeric（英数字）",
      alpha: "alpha（英字のみ）",
      digit: "digit（数字のみ）",
      ascii: "ascii（印字可能なASCII）",
    },
  },
} as const;

const DEFAULT_TEXT = "第1章 2026年4月19日、Webの縦書きはAPIレベルから進化した。";
const TARGETS: TargetPreset[] = ["alphanumeric", "alpha", "digit", "ascii"];

function renderHtml(text: string, options: Parameters<typeof tokenize>[1]): string {
  const segments = tokenize(text, options);
  return segments
    .map((s) => {
      if (s.type === "tcy") {
        return `<span class="tcy">${escape(s.value)}</span>`;
      }
      return escape(s.value);
    })
    .join("");
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function InlineMd({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("`") && part.endsWith("`") && part.length >= 2 ? (
          <code
            key={i}
            className="font-mono text-[0.9em] px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-primary-700 dark:text-primary-300"
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

export function DemoPlayground({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const [text, setText] = useState(DEFAULT_TEXT);
  const [target, setTarget] = useState<TargetPreset>("alphanumeric");
  const [combine, setCombine] = useState(true);
  const [include, setInclude] = useState("");
  const [exclude, setExclude] = useState("");

  const options = useMemo(
    () => ({
      target,
      combine,
      ...(include ? { include } : {}),
      ...(exclude ? { exclude } : {}),
    }),
    [target, combine, include, exclude],
  );

  const html = useMemo(() => renderHtml(text, options), [text, options]);

  return (
    <div className="tcy-demo-scope">
      <style>{`
        .tcy-demo-scope .tcy-preview .tcy {
          -webkit-text-combine: horizontal;
          text-combine-upright: all;
        }
        .tcy-demo-scope .tcy-vertical {
          writing-mode: vertical-rl;
          font-family: "Noto Serif JP", "Yu Mincho", serif;
          font-size: 1.35rem;
          line-height: 2.1;
          height: 20rem;
          overflow-x: auto;
          padding: 1rem 0.5rem;
        }
      `}</style>

      {/* Controls */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <label className="flex flex-col gap-2 md:col-span-2">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {t.input}
          </span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2 font-mono text-sm"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {t.target}
          </span>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value as TargetPreset)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm"
          >
            {TARGETS.map((val) => (
              <option key={val} value={val}>
                {t.targetLabels[val]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 justify-end">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <input
              type="checkbox"
              checked={combine}
              onChange={(e) => setCombine(e.target.checked)}
              className="h-4 w-4"
            />
            {t.combine}
          </span>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {t.include}
          </span>
          <input
            value={include}
            onChange={(e) => setInclude(e.target.value)}
            placeholder={t.includePlaceholder}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2 font-mono text-sm"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            {t.exclude}
          </span>
          <input
            value={exclude}
            onChange={(e) => setExclude(e.target.value)}
            placeholder={t.excludePlaceholder}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 px-3 py-2 font-mono text-sm"
          />
        </label>
      </div>

      {/* Previews */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">{t.raw}</p>
          <div className="tcy-preview flex justify-center">
            <p className="tcy-vertical text-slate-900 dark:text-slate-100">{text}</p>
          </div>
        </div>

        <div className="rounded-xl border-2 border-primary-400 dark:border-primary-600 bg-white dark:bg-slate-900 p-4">
          <p className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-3">
            {t.processed}
          </p>
          <div className="tcy-preview flex justify-center">
            <p className="tcy-vertical text-slate-900 dark:text-slate-100">
              <Tcy {...options}>{text}</Tcy>
            </p>
          </div>
        </div>
      </div>

      {/* HTML output */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden mb-4">
        <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{t.html}</span>
        </div>
        <pre className="bg-slate-950 text-slate-100 text-xs leading-relaxed p-4 overflow-x-auto m-0 whitespace-pre-wrap break-all">
          <code>{html}</code>
        </pre>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        <InlineMd text={t.note} />
      </p>
    </div>
  );
}
