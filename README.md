# Rox Homepage

**The Love Rocks. Rox.**

Official website and documentation for [Rox](https://github.com/Love-Rox/rox) - A lightweight ActivityPub server with Misskey API compatibility.

## 🌟 About

This is the official homepage for the Rox project, built with modern web technologies to provide documentation, blog posts, and information about Rox in both Japanese and English.

## 🚀 Tech Stack

- **Framework**: [Waku](https://waku.gg/) - React Server Components framework
- **Runtime**: Bun
- **Styling**: Tailwind CSS v4 with OKLCH color space
- **Language**: TypeScript
- **UI Components**: React Aria Components
- **Content**: Markdown with frontmatter (gray-matter)
- **Syntax Highlighting**: rehype-highlight
- **Contact form delivery**: Discord webhook (Workers-runtime friendly)
- **Bot Protection**: Cloudflare Turnstile

## 📁 Project Structure

```
rox-homepage/
├── src/
│   ├── components/      # React components
│   │   ├── home/       # Homepage components
│   │   ├── docs/       # Documentation components
│   │   ├── blog/       # Blog components
│   │   └── contact/    # Contact form components
│   ├── pages/          # Waku pages
│   │   ├── (base)/     # Base layout pages
│   │   └── (locale)/   # Localized pages
│   └── styles.css      # Global styles
├── private/
│   ├── content/        # Markdown content
│   │   ├── docs/       # Documentation (ja/en)
│   │   └── blog/       # Blog posts (ja/en)
│   └── lang/           # i18n JSON files
└── public/             # Static assets
```

## 🛠️ Development

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+

### Setup

```bash
# Clone the repository
git clone https://github.com/Love-Rox/rox-homepage.git
cd rox-homepage

# Install dependencies
bun install

# Start development server
bun run dev
```

The site will be available at `http://localhost:3000`.

### Port Configuration

You can specify a custom port using the `PORT` environment variable:

**Using .env file** (recommended):

```bash
# .env
PORT=8080
```

**Using command line**:

```bash
# Run on port 8080
PORT=8080 bun run dev

# Run on port 5000
PORT=5000 bun run start
```

The `.env` file is automatically loaded by Waku. Command line variables override `.env` settings.

### Available Scripts

- `bun run dev` - Start the Waku/Vite dev server
- `bun run build` - Build for Cloudflare Workers (auto-invokes the Cloudflare adapter when `CLOUDFLARE=1` or in CI; otherwise emits the standard Node output)
- `bun run start` - Run the built Worker locally with `wrangler dev`
- `bun run deploy` - Deploy to Cloudflare Workers (`wrangler deploy`)
- `bun run cf-typegen` - Regenerate `worker-configuration.d.ts` from `wrangler.jsonc`
- `bun run generate-seo` - Generate sitemap.xml and robots.txt

### SEO Files

The `sitemap.xml` and `robots.txt` files are automatically generated from your content:

```bash
# Manually generate SEO files
bun run generate-seo
```

These files are automatically generated before each build (`prebuild` script). The generator:

- Scans all blog posts in `private/contents/blog/`
- Scans all documentation pages in `private/contents/docs/`
- Creates sitemap with hreflang tags for multi-language support
- Generates robots.txt with sitemap reference

## 📝 Content Management

### Blog Posts

Blog posts are written in Markdown with frontmatter and stored in:

- Japanese: `private/contents/blog/ja/`
- English: `private/contents/blog/en/`

Example frontmatter:

```markdown
---
title: Post Title
description: Post description
date: 2025-11-27
author: Rox Team
tags: [tag1, tag2]
excerpt: Brief excerpt
---
```

### Documentation

Documentation is organized in:

- Japanese: `private/contents/docs/ja/`
- English: `private/contents/docs/en/`

### Internationalization

UI translations are stored in `private/lang/` as JSON files, organized by component and language.

## 🌐 Localization

The site supports:

- 🇯🇵 Japanese (ja) - Primary language
- 🇬🇧 English (en)

Japanese is the primary development language, with English also supported for broader accessibility.

## 📧 Contact Form

The contact form delivers submissions to a Discord channel via webhook (no SMTP / no email-sending dependency, so it runs cleanly on Cloudflare Pages / Workers). The flow is:

- Cloudflare Turnstile verifies the submission server-side.
- A main embed is posted to the configured webhook. If the target is a **Forum channel**, `thread_name` creates a new thread per submission; a copy-paste-ready reply template is then posted as a follow-up message inside that thread. A regular text channel also works — the reply template is posted as a follow-up top-level message instead.
- The submitting user **does not receive an automatic confirmation email**. The success screen instead displays the submitted content so they can take a screenshot for their records.

To set this up, create a webhook on the Discord channel (Server Settings → Integrations → Webhooks → New Webhook) and put the URL into `DISCORD_CONTACT_WEBHOOK_URL`.

## 🔧 Environment Variables

Create a `.env` file in the root directory (see `env.example.txt`):

```bash
# Server Configuration
PORT=3000

# Cloudflare Turnstile
VITE_TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key

# Discord webhook for contact-form delivery (Forum channel recommended)
DISCORD_CONTACT_WEBHOOK_URL=https://discord.com/api/webhooks/your_id/your_token
```

## ☁️ Deployment (Cloudflare Workers + Static Assets)

The site is deployed to Cloudflare Workers using the [Workers Static Assets](https://developers.cloudflare.com/workers/static-assets/) architecture (Pages' successor). Waku's official `waku/adapters/cloudflare` builds a Hono-based Worker handler that fronts the static `dist/public/` bundle.

### One-time setup

1. Install dependencies: `bun install`
2. Authenticate wrangler: `bunx wrangler login`
3. Set runtime secrets (these are NOT in `.env` — they live in Cloudflare's secret store):
   ```bash
   bunx wrangler secret put TURNSTILE_SECRET_KEY
   bunx wrangler secret put DISCORD_CONTACT_WEBHOOK_URL
   ```
4. Set the build-time public Turnstile site key (this is baked into the client bundle, so it's fine to keep in `.env` / Cloudflare environment variables):
   ```
   VITE_TURNSTILE_SITE_KEY=...
   ```

### Deploy

```bash
CLOUDFLARE=1 bun run build
bun run deploy
```

`waku build` with `CLOUDFLARE=1` (or detected `WORKERS_CI`) emits `dist/server/index.js` (the Worker entry) and `dist/server/wrangler.json` (the deploy config). `wrangler deploy` reads those automatically.

### Local testing of the built Worker

```bash
CLOUDFLARE=1 bun run build
bun run start    # wraps `wrangler dev`
```

This runs the Worker against Miniflare (Cloudflare's local emulator), with the ASSETS binding wired to `dist/public/`. Routes that depend on secrets need a `.dev.vars` file at the project root.

### Known limitations

- **Dynamic OG image generation is currently disabled.** `src/pages/_api/api/og.tsx` previously used `satori` + `@resvg/resvg-wasm` to render per-title cards, but the wasm-bindgen-generated init path inside `@resvg/resvg-wasm` calls `WebAssembly.instantiate(bytes)` at runtime, which the Workers runtime blocks (CSP-style "Wasm code generation disallowed by embedder"). The route now serves the Rox horizontal logo as a static fallback. Re-enabling dynamic OG cards is tracked as a follow-up — `workers-og` is the most likely Workers-compatible replacement.

## 🤝 Contributing

We welcome contributions! Whether you're:

- Fixing typos or improving documentation
- Adding new features
- Translating content
- Reporting bugs

Please feel free to open an issue or submit a pull request.

### Development Language

- **Primary**: Japanese (日本語)
- **Also welcome**: English

We encourage Japanese developers to contribute in Japanese, while also welcoming contributions in English.

## 📄 License

This project is part of the Rox ecosystem. Please see the main [Rox repository](https://github.com/Love-Rox/rox) for license information.

## 🔗 Links

- **Main Project**: [Love-Rox/rox](https://github.com/Love-Rox/rox)
- **Website**: [love-rox.cc](https://love-rox.cc)
- **Documentation**: [love-rox.cc/docs](https://love-rox.cc/docs)

## 💝 Acknowledgments

Built with love using wonderful Japanese technologies:

- [Waku](https://waku.gg/) by Daishi Kato
- Inspired by the Japanese developer community

---

**愛がロックする。Rox。** / **The Love Rocks. Rox.**
