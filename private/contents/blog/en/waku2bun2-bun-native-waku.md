---
title: waku2bun2 - Working Toward Bun-Native Waku
description: A fork project aiming for Bun-native support in Waku
date: 2026-01-14
author: Rox Team
tags: [Rox, Waku, Bun, Development, Infrastructure]
excerpt: "If we're using Bun, why not make everything native?" — With this thought in mind, we started the waku2bun2 fork project aiming for Bun-native support in Waku. Due to current RSC support limitations in Bun, we are preparing while waiting for Bun's development to progress.
---

# waku2bun2 - Working Toward Bun-Native Waku

## The "Make Everything Bun-Native" Challenge

**"If we're using Bun, why not make everything native?"** — With this thought in mind, we started the **waku2bun2** fork project aiming for Bun-native support in Waku 🚀

## What is waku2bun2?

[waku2bun2](https://github.com/Love-Rox/waku2bun2) is a fork project **aiming** to run [Waku](https://waku.gg/), a React Server Components (RSC) framework, natively on the Bun runtime.

## Current Technical Challenges

After testing, we discovered that Bun has fundamental limitations for RSC support at this time.

### Unsupported `react-server` Export Condition

Bun does not yet support Node.js's `react-server` export condition, which is required for React Server Components to work.

```
error: No matching export in "react-dom/package.json" for import "react-dom"
```

As a result, **all phases (dev, build, start) currently require Node.js**.

## Goals

Once Bun's support progresses, waku2bun2 aims to achieve:

- **Development** - Native hot reload with `bun waku dev`
- **Build** - Native build with `bun waku build`
- **Runtime** - Native server startup with `bun waku start`

## Future Plans

1. **Watch Bun's RSC Development** - Track support for `react-server` export condition
2. **Update waku2bun2 as Bun Matures** - Advance implementation as Bun develops
3. **Contribute to Upstream Waku** - If stable, contribute to the main Waku project

## Related Links

- [waku2bun2 Repository](https://github.com/Love-Rox/waku2bun2)
- [Waku Official Website](https://waku.gg/)
- [Bun Official Website](https://bun.sh/)

As Bun evolves, this project will move forward too.

**Love rocks. Rox.** 💜
