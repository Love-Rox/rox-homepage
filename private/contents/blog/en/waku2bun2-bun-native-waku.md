---
title: waku2bun2 - Migrating to Bun-Native Waku
description: A challenge to make everything Bun-native. Testing the Waku fork "waku2bun2"
date: 2026-01-14
author: Rox Team
tags: [Rox, Waku, Bun, Development, Infrastructure]
excerpt: "If we're using Bun, why not make everything native?" — With this challenge in mind, we've started testing the Bun-native Waku fork "waku2bun2" on the Rox homepage. If successful, we aim to contribute these changes to upstream Waku.
---

# waku2bun2 - Migrating to Bun-Native Waku

## The "Make Everything Bun-Native" Challenge

**"If we're using Bun, why not make everything native?"** — With this challenge in mind, we've started testing the Bun-native Waku fork "**waku2bun2**" on the Rox homepage 🚀

> [!NOTE]
> This is currently only being tested on rox-homepage and has not yet been applied to the main Rox project.

## What is waku2bun2?

[waku2bun2](https://github.com/Love-Rox/waku2bun2) is a fork of [Waku](https://waku.gg/), a React Server Components (RSC) framework, modified to run natively on the Bun runtime.

### Key Features

- **Bun-Native Support** - Runs directly on Bun instead of Node.js
- **Fast Startup Time** - Benefits from Bun's fast JavaScript/TypeScript runtime
- **Maintained Compatibility** - Easy migration from existing Waku projects

## Why Migrate to Bun?

### Performance Improvements

Bun has extremely fast startup times, which can provide significant improvements especially for hot reloading during development and cold starts in production.

### Improved Developer Experience

Bun is an all-in-one toolkit that integrates a package manager, test runner, bundler, and more. It simplifies the entire toolchain.

### Ecosystem Evolution

As Bun adoption grows, the Rox project is moving forward with support for this new runtime.

## Current Status

We have experimentally introduced the `@love-rox/waku` package on rox-homepage.

```json
{
  "dependencies": {
    "waku": "npm:@love-rox/waku@1.0.0-alpha.2"
  }
}
```

## Future Plans

1. **Testing on rox-homepage** - Verifying each page and feature
2. **Performance Measurement** - Comparing with Node.js version
3. **Stability Verification** - Long-term production testing
4. **Consideration for Main Rox** - Decision based on verification results
5. **Upstream Integration** - If successful, contribute to the main Waku project

## Related Links

- [waku2bun2 Repository](https://github.com/Love-Rox/waku2bun2)
- [Waku Official Website](https://waku.gg/)
- [Bun Official Website](https://bun.sh/)

We will keep you updated as testing progresses.

**Love rocks. Rox.** 💜
