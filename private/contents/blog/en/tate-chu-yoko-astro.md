---
title: tate-chu-yoko meets Astro - one line in astro.config.mjs, automatic tate-chu-yoko everywhere
date: 2026-05-03
author: Rox Team
tags: [Love-Rox, tate-chu-yoko, Astro, MDX, npm, release, Japanese-typography]
description: A fifth tate-chu-yoko package — `@love-rox/tcy-astro` — wires the rehype plugin into Astro 4+'s Markdown and MDX pipelines and ships a `<Tcy>` component for `.astro` files. Add one line to `astro.config.mjs` and half-width alphanumerics in your vertical Japanese content get wrapped at build time.
excerpt: Since shipping the rehype plugin, the most common follow-up has been "what about Astro?". `@love-rox/tcy-astro` is the answer — register the integration and `.md` / `.mdx` content gets tate-chu-yoko automatically; for `.astro` files, the `<Tcy>` component is in the same package. All five packages are now released on the same shared version line at `0.3.0`.
---

# tate-chu-yoko meets Astro - one line in astro.config.mjs, automatic tate-chu-yoko everywhere

We just shipped a fifth tate-chu-yoko package: **`@love-rox/tcy-astro`** ✨

- 📦 [@love-rox/tcy-astro@0.3.0](https://www.npmjs.com/package/@love-rox/tcy-astro)
- 📦 [@love-rox/tcy-rehype@0.3.0](https://www.npmjs.com/package/@love-rox/tcy-rehype)
- 📦 [@love-rox/tcy-react@0.3.0](https://www.npmjs.com/package/@love-rox/tcy-react)
- 📦 [@love-rox/tcy-vue@0.3.0](https://www.npmjs.com/package/@love-rox/tcy-vue)
- 📦 [@love-rox/tcy-core@0.3.0](https://www.npmjs.com/package/@love-rox/tcy-core)
- 💾 GitHub: [Love-Rox/tate-chu-yoko](https://github.com/Love-Rox/tate-chu-yoko)
- 🎨 Package page: [/packages/tate-chu-yoko](/en/packages/tate-chu-yoko)
- 🎨 Astro-specific page: [/packages/tate-chu-yoko/astro](/en/packages/tate-chu-yoko/astro)

> The five packages are on a shared version line — whenever any of them changes, the others move to the same number. Adding the Astro package this round bumped all five to `0.3.0`.

## Why an Astro-specific package

As we wrote when [`@love-rox/tcy-rehype` shipped](/en/blog/tate-chu-yoko-rehype), the rehype plugin is designed to drop into any `unified` pipeline. Astro uses `unified` under the hood, so in principle you can wire `tcy-rehype` into Astro by hand.

In practice, though, you end up writing the same setup over and over:

- Add the plugin to `markdown.rehypePlugins` in `astro.config.mjs`.
- Configure `.mdx` separately, since MDX has its own integration entry.
- And `.astro` content authored directly (no Markdown in the picture) needs a different mechanism altogether — there's no `<Tcy>` equivalent.

The fifth package exists to take all of that off your plate.

## One line in `astro.config.mjs`

```ts
import { defineConfig } from "astro/config";
import tcy from "@love-rox/tcy-astro";

export default defineConfig({
  integrations: [tcy()],
});
```

That's it. After that, half-width alphanumeric runs in `.md` and `.mdx` content get wrapped in `<span class="tcy">` at build time. The integration hooks into both the Markdown configuration and the MDX configuration internally.

There's zero client-side runtime. Astro is SSG-first, so by the time the page reaches the browser the wrapping is already in the HTML — no React, no Vue, no extra JS.

## Same options as `tcy-rehype`

```ts
integrations: [
  tcy({
    maxLength: 2,
    excludeWords: ["URL", "API", "2026"],
  }),
],
```

Anything you can pass to `@love-rox/tcy-rehype` (`target`, `combine`, `include`, `exclude`, `maxLength`, `excludeWords`, `tagName`, `className`, `skipTags`) flows straight through.

The integration adds exactly one option of its own:

- **`markdown`** (default `true`) — whether to register `rehype-tcy` on the Markdown / MDX pipeline. Set to `false` if you only want the `<Tcy>` component and want to opt out of the Markdown wiring.

## `<Tcy>` for `.astro` files

Sometimes the body content is authored directly in an `.astro` file rather than coming from Markdown. The same package ships a component for that:

```astro
---
import Tcy from "@love-rox/tcy-astro/Tcy.astro";
---

<p style="writing-mode: vertical-rl">
  <Tcy>第1章 2026年4月、Webの縦書きは進化した。</Tcy>
</p>
```

Internally the component delegates to the same `tcy-rehype`, so behavior between Markdown and `.astro`-authored content lines up exactly.

## Where this fits in the family

```
@love-rox/tcy-core    — framework-agnostic tokenizer (the brain)
@love-rox/tcy-react   — `<Tcy>` for React (runtime wrapping)
@love-rox/tcy-vue     — `<Tcy>` for Vue 3 (runtime wrapping)
@love-rox/tcy-rehype  — `unified` plugin (build-time wrapping)
@love-rox/tcy-astro   — Astro integration + `<Tcy>` component ← new
```

`tcy-astro` calls into `tcy-rehype`, which calls into `tcy-core`. All five share the exact same opinion of "what is a tcy-eligible run." The only difference is _where_ in your stack the wrapping happens.

## We also restructured the docs

Five packages on a single page was getting hard to skim, so we rebuilt [`/packages/tate-chu-yoko`](/en/packages/tate-chu-yoko) as a core-focused landing and split each adapter onto its own page:

- [/packages/tate-chu-yoko/react](/en/packages/tate-chu-yoko/react)
- [/packages/tate-chu-yoko/vue](/en/packages/tate-chu-yoko/vue)
- [/packages/tate-chu-yoko/rehype](/en/packages/tate-chu-yoko/rehype)
- [/packages/tate-chu-yoko/astro](/en/packages/tate-chu-yoko/astro)

A nav across the top of each page lets you hop between adapters in one click.

## Try it

```bash
bun add @love-rox/tcy-astro
# or pnpm / npm / yarn
```

Add one line to `astro.config.mjs`, drop the CSS in:

```css
.tcy {
  -webkit-text-combine: horizontal;
  text-combine-upright: all;
}
```

That's the whole setup. Full docs live on the [Astro package page](/en/packages/tate-chu-yoko/astro) and the [README on GitHub](https://github.com/Love-Rox/tate-chu-yoko/tree/main/packages/astro#readme).

## Feedback welcome

Vertical Japanese typography in Astro is still pretty new ground in practice. If you hit something — an unexpected wrap, a word you wanted left as-is, an MDX edge case — that kind of feedback is the most useful input we get for tuning the defaults.

[Open an issue](https://github.com/Love-Rox/tate-chu-yoko/issues) and we'll dig in.

**The Love Rocks. Rox.**
