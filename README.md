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
- **Email**: Nodemailer (for contact form)
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

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run start` - Start production server
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

The contact form uses:

- Cloudflare Turnstile for bot protection
- Nodemailer for sending emails
- Environment variables for configuration

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```bash
# Server Configuration
PORT=3000

# Contact Form Settings
VITE_TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
CONTACT_EMAIL=dev@example.com
```

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
