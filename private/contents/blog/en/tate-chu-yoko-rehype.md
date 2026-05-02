---
title: tate-chu-yoko meets rehype - drop tate-chu-yoko into your unified pipeline
date: 2026-05-03
author: Rox Team
tags: [Love-Rox, tate-chu-yoko, rehype, unified, npm, release, Japanese-typography]
description: A new fourth package — `@love-rox/tcy-rehype` — applies tate-chu-yoko inside any `unified` pipeline. Markdown → HTML, HTML → HTML, Astro, eleventy, MDX — wrap half-width runs at build time, no React or Vue runtime required.
excerpt: Until now, automatic tate-chu-yoko meant rendering through React or Vue. That works great inside an app, but it asks the wrong things of static sites and Markdown content pipelines. `@love-rox/tcy-rehype` is the fourth tate-chu-yoko package — a small `unified` plugin that drops the same wrapping into any HAST pipeline. No runtime cost, no framework dependency, same options.
---

# tate-chu-yoko meets rehype - drop tate-chu-yoko into your unified pipeline

We just shipped a fourth tate-chu-yoko package: **`@love-rox/tcy-rehype`** ✨

- 📦 [@love-rox/tcy-rehype@0.2.2](https://www.npmjs.com/package/@love-rox/tcy-rehype)
- 📦 [@love-rox/tcy-core@0.2.2](https://www.npmjs.com/package/@love-rox/tcy-core)
- 📦 [@love-rox/tcy-react@0.2.2](https://www.npmjs.com/package/@love-rox/tcy-react)
- 📦 [@love-rox/tcy-vue@0.2.2](https://www.npmjs.com/package/@love-rox/tcy-vue)
- 💾 GitHub: [Love-Rox/tate-chu-yoko](https://github.com/Love-Rox/tate-chu-yoko)
- 🎨 Package page: [/packages/tate-chu-yoko](/en/packages/tate-chu-yoko)

> The four packages are now released on a single shared version line, so they all move together.

## What it is

A [rehype](https://github.com/rehypejs/rehype) plugin built on top of `@love-rox/tcy-core`. It walks a HAST tree, finds half-width alphanumeric runs in text nodes, and wraps them in `<span class="tcy">` so CSS `text-combine-upright: all` can compose them as tate-chu-yoko.

If you have a `unified` pipeline — for Markdown, MDX, an Astro site, an eleventy build, or just plain HTML rewriting — you can now do tate-chu-yoko inside that pipeline at build time, with no React or Vue dependency on the client.

## The shape it makes possible

Until 0.2.2, the way to get automatic tate-chu-yoko was to render content through `<Tcy>` in React or Vue. That assumes a React/Vue runtime is in the page. Two situations push back on that:

- **Static sites that don't have a JS runtime.** A documentation site, a blog, a publication — the value of `text-combine-upright` is highest exactly there, and yet React or Vue often isn't.
- **Markdown content with a server-side pipeline.** When the canonical source is `.md` or MDX, we want the wrapping baked in at build time so the HTML on disk is already correct, not a hydration step.

A rehype plugin maps cleanly onto both. It runs once during the build, leaves a static HTML tree behind, and you ship zero extra JS for it.

## Markdown pipeline

```ts
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeTcy from "@love-rox/tcy-rehype";

const html = String(
  await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeTcy)
    .use(rehypeStringify)
    .process("第1章 2026年4月"),
);
// <p>第<span class="tcy">1</span>章 <span class="tcy">2026</span>年<span class="tcy">4</span>月</p>
```

Slot it in between `remark-rehype` and `rehype-stringify` (or wherever your pipeline finalizes HAST), and the output is wrapped before it ever leaves the build.

## HTML-only pipeline

If you don't have Markdown in the picture — just HTML in, HTML out — it's the same idea:

```ts
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import rehypeTcy from "@love-rox/tcy-rehype";

const html = String(
  await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeTcy)
    .use(rehypeStringify)
    .process("<p>第1章 2026年4月</p>"),
);
```

## All the same options as `<Tcy>`

The shared options work identically — `target`, `combine`, `include`, `exclude`, `maxLength`, `excludeWords`. So everything you can express with the React or Vue component, you can express in the rehype pipeline:

```ts
.use(rehypeTcy, {
  maxLength: 2,
  excludeWords: ["URL", "API", "2026"],
})
```

There are three plugin-only options:

- **`tagName`** (default `'span'`) — the wrapping element.
- **`className`** (default `'tcy'`) — class on the wrapping element. Pass an array for multiple classes.
- **`skipTags`** (default `['code', 'pre', 'script', 'style']`) — subtrees that the plugin won't touch.

Skipping `code` / `pre` / `script` / `style` matters more than it sounds: it's how the plugin avoids mangling code samples and embedded JSON.

## A note on idempotency

Running the plugin twice on the same HAST gives the exact same output as running it once. No re-wrapping, no doubled spans. So it's safe in pipelines where multiple stages might want to ensure tate-chu-yoko has been applied — last one in wins, no damage done.

## Where this fits in the family

```
@love-rox/tcy-core    — framework-agnostic tokenizer (the brain)
@love-rox/tcy-react   — `<Tcy>` for React (runtime wrapping)
@love-rox/tcy-vue     — `<Tcy>` for Vue 3 (runtime wrapping)
@love-rox/tcy-rehype  — `unified` plugin (build-time wrapping) ← new
```

All four use the same `core` tokenizer underneath, so they all share the same opinion of "what is a tcy-eligible run." The only difference is _where_ in your stack the wrapping happens.

If you've been using `<Tcy>` and it's working, nothing changes. If you've been wishing you could do this without React or Vue around — that's now `@love-rox/tcy-rehype`.

## Try it

```bash
bun add @love-rox/tcy-rehype
# or pnpm / npm / yarn
```

Drop it into your `unified` pipeline, set the same options you'd give to `<Tcy>`, and you're done. The full README and examples live in the [GitHub repository](https://github.com/Love-Rox/tate-chu-yoko/tree/main/packages/rehype#readme).

## Feedback welcome

If you're using tate-chu-yoko in a Markdown pipeline, an Astro site, an eleventy build, or anything else `unified` shows up in — we want to know what worked and what didn't. The judgment calls in vertical typesetting are not things a library can derive on its own; they come from people writing real text.

[Open an issue](https://github.com/Love-Rox/tate-chu-yoko/issues) if you have one. We're listening.

**The Love Rocks. Rox.**
