---
title: Welcome to Rox
description: Introducing Rox - A lightweight ActivityPub server with Misskey API compatibility
date: 2025-11-27
author: Rox Team
tags: [announcement, introduction, activitypub]
excerpt: We're excited to introduce Rox, a lightweight ActivityPub server and client with Misskey API compatibility, designed for modern deployment scenarios.
---

# Welcome to Rox

We're excited to introduce **Rox**, a lightweight ActivityPub server and client with Misskey API compatibility, designed for modern deployment scenarios.

## What is Rox?

Rox is a next-generation federated social media platform that combines the best of modern web technologies with the open standards of the Fediverse. Built with Bun, Hono, and Waku, Rox offers:

- **Lightweight & Fast**: Built with modern web standards for exceptional performance
- **Infrastructure Agnostic**: Deploy on traditional VPS or edge environments
- **Misskey Compatible**: Seamless migration for existing Misskey users
- **Developer Friendly**: Clean architecture with TypeScript throughout

## Key Features

### Modern Tech Stack

Rox leverages cutting-edge technologies:

- **Backend**: Bun runtime, Hono framework, Drizzle ORM
- **Frontend**: Waku (React Server Components), Jotai, React Aria Components
- **Styling**: Tailwind CSS v4 with OKLCH color space
- **Internationalization**: Lingui with English and Japanese support

### ActivityPub Federation

Full ActivityPub support means Rox can federate with:

- Mastodon
- Misskey
- GoToSocial
- And any other ActivityPub-compatible server

### Flexible Deployment

Choose how you want to deploy:

```bash
# Bare Metal deployment (recommended)
bun run build && bun run start

# Docker deployment (alternative)
docker compose up -d
```

## Getting Started

Getting started with Rox is easy:

```bash
# Clone the repository
git clone https://github.com/Love-rox/rox.git
cd rox

# Install dependencies
bun install

# Start development
bun run dev
```

Visit our [Getting Started guide](/docs/getting-started) for detailed instructions.

## What's Next?

We're actively working on:

- **Plugin System**: Extensible architecture for custom functionality
- **Enhanced Moderation**: Advanced tools for instance administrators
- **Performance Optimizations**: Making Rox even faster
- **More Documentation**: Comprehensive guides and tutorials

## Join the Community

We'd love to have you join us:

- **GitHub**: [Love-Rox/rox](https://github.com/Love-Rox/rox)
- **Documentation**: [Rox Docs](/docs)
- **Contributing**: Check out our [Contributing Guide](https://github.com/Love-Rox/rox/blob/main/CONTRIBUTING.md)

## Conclusion

Rox represents a new approach to federated social media - lightweight, modern, and developer-friendly. We're excited to see what you build with it!

Stay tuned for more updates, and happy federating! 🚀
