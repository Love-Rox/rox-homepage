// Redirect layer for paths that have moved to tcy.love-rox.cc.
//
// Mapping rules:
//   /packages/tate-chu-yoko[/X]            → https://tcy.love-rox.cc[/X]
//   /(en|ja)/packages/tate-chu-yoko[/X]    → https://tcy.love-rox.cc[/en or "" for ja][/X]
//   /blog/tate-chu-yoko-<slug>             → https://tcy.love-rox.cc/blog/tate-chu-yoko-<slug>
//   /(en|ja)/blog/tate-chu-yoko-<slug>     → https://tcy.love-rox.cc[/en or ""]/blog/tate-chu-yoko-<slug>
//
// tcy.love-rox.cc uses ja as the default (no /ja prefix). So /ja/X → /X on the new site,
// /en/X → /en/X, and language-less /X → /X (treated as ja).

const TCY_BASE = "https://tcy.love-rox.cc";

function tcyPrefix(lang: "en" | "ja"): string {
  return lang === "en" ? "/en" : "";
}

export function rewriteToTcy(url: URL): string | null {
  const p = url.pathname;
  const search = url.search;
  let m: RegExpMatchArray | null;

  // /(en|ja)/packages/tate-chu-yoko[/X] → tcy[/en or ""][/X]
  if ((m = p.match(/^\/(en|ja)\/packages\/tate-chu-yoko(\/.*)?$/))) {
    const lang = m[1] as "en" | "ja";
    const tail = m[2] ?? "";
    const prefix = tcyPrefix(lang);
    const target = prefix === "" ? tail || "/" : `${prefix}${tail}`;
    return `${TCY_BASE}${target}${search}`;
  }

  // /packages/tate-chu-yoko[/X] (lang-less) → tcy[/X], default ja
  if ((m = p.match(/^\/packages\/tate-chu-yoko(\/.*)?$/))) {
    const tail = m[1] ?? "/";
    return `${TCY_BASE}${tail}${search}`;
  }

  // /(en|ja)/blog/tate-chu-yoko-<slug>
  if ((m = p.match(/^\/(en|ja)\/blog\/(tate-chu-yoko-[A-Za-z0-9-]+)$/))) {
    const lang = m[1] as "en" | "ja";
    const slug = m[2];
    return `${TCY_BASE}${tcyPrefix(lang)}/blog/${slug}${search}`;
  }

  // /blog/tate-chu-yoko-<slug> (lang-less, default ja)
  if ((m = p.match(/^\/blog\/(tate-chu-yoko-[A-Za-z0-9-]+)$/))) {
    const slug = m[1];
    return `${TCY_BASE}/blog/${slug}${search}`;
  }

  return null;
}
