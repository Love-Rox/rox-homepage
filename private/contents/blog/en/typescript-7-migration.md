---
title: Migrating Rox to TypeScript 7 (RC) - The Native Compiler and a Full Dependency Refresh
description: We refreshed our dependencies and moved to TypeScript 7 (RC), the native (Go) compiler. Here are the two traps we hit along the way — a duplicated ioredis and a TypeDoc that doesn't support TS7 yet — and how we worked around them
date: 2026-06-21
author: Rox Team
tags: [Rox, TypeScript, Toolchain, Engineering, News]
excerpt: We moved Rox's TypeScript to 7.0.1-rc. tsc is now the Go-based native compiler, so type checking is dramatically faster. We also refreshed every dependency. This post covers the two traps we hit mid-migration — a type clash from a duplicated ioredis, and TypeDoc not supporting TS7 yet — and how overrides and an isolated tooling install solved them.
---

# Migrating Rox to TypeScript 7 (RC)

We migrated Rox's development toolchain to **TypeScript 7 (RC)**, and refreshed our dependencies while we were at it. This isn't a feature release — it's unglamorous plumbing — but it's the kind of change that pays off in day-to-day development, so it's worth writing down.

## What is TypeScript 7?

TypeScript 7 is a **full rewrite of the compiler in Go**. Until now the compiler was written in TypeScript (i.e. JavaScript); the native port (a.k.a. "tsgo") replaces that implementation.

The pitch is simple: it's **fast**. Type checking and editor responsiveness become dramatically quicker — that's the whole motivation. The API and type-system behavior stay compatible; only the compiler implementation swaps over to native Go.

It's still at the **RC (Release Candidate)** stage, but Rox is a project built around being "light and fast," so it felt natural to keep our toolchain on the leading edge.

```bash
$ tsc --version
Version 7.0.1-rc
```

The `typescript` package itself publishes `7.0.1-rc` under the `rc` tag and ships `bin/tsc`, so **the command is still just `tsc`**. Both our type-check scripts (`tsc --noEmit`) and the `shared` package's emit build (`tsc`) switched to the native compiler with no command changes.

## A full dependency refresh, too

While we had the hood open, we updated dependencies across the board:

- React 19.2.7 / Hono 4.12.26 / Drizzle / Zod
- `@lingui/*` 6.4.0 / `@sentry/*` 10.59.0 / BullMQ 5.79.0
- pg 8.22.0 / sharp 0.35.2 / Vite 8.0.16 / Waku 1.0.0-beta.3
- Playwright 1.61.0 / Storybook 10.4.6, and more

So far so good — except we hit **two traps** during the migration. Sharing them in case anyone with a similar monorepo gets stuck.

## Trap #1: a duplicated ioredis

Right after updating dependencies, `bun run typecheck` started throwing this:

```
error TS2322: Type 'Redis' is not assignable to type 'ConnectionOptions'.
  Type 'ioredis@5.11.1/.../Redis' is not assignable to type 'ioredis@5.10.1/.../Redis'.
```

The cause: **two versions of ioredis living side by side**. Our backend uses ioredis directly at `5.11.1`, while the job queue, **BullMQ, pins ioredis to `5.10.1`**. That meant two structurally distinct `Redis` classes existed, and the spot where we pass our own `Redis` instance into BullMQ got rejected — "this should be the same `Redis`, but it isn't assignable."

The fix was to **collapse ioredis to a single version** via `overrides` in the root `package.json`:

```json
{
  "overrides": {
    "ioredis": "5.11.1"
  }
}
```

One caveat here. With Bun, just adding `overrides` doesn't always take effect — the previous resolution can stay cached. Regenerating `bun.lock` wasn't enough; only a **clean rebuild of `node_modules`** finally lined BullMQ's dependency up on `5.11.1`.

```bash
rm -rf node_modules bun.lock && bun install
```

## Trap #2: TypeDoc doesn't support TS7 yet

The second one was **TypeDoc**, which we use to generate our API docs. Running it on TypeScript 7 produced:

```
Error [ERR_PACKAGE_PATH_NOT_EXPORTED]
```

TypeDoc consumes TypeScript's **compiler API as a library**. The native compiler reorganized its package `exports`, so TypeDoc can't resolve the API path it expects. Even the latest TypeDoc (0.28.19) caps its peerDependency at `6.0.x` — **no TS7 support**.

The annoying part: Bun doesn't support npm's **scoped overrides** (neither the `"typedoc > typescript"` form nor the nested-object form). And a flat `typescript` override would drag the entire workspace back to TS6, defeating the migration.

So we isolated TypeDoc into a **standalone install pinned to TypeScript 6**, with its own `package.json` under `tools/apidocs/`:

```jsonc
// tools/apidocs/package.json
{
  "name": "rox-typedoc",
  "private": true,
  "devDependencies": {
    "typedoc": "^0.28.19",
    "typescript": "6.0.3",
  },
}
```

It carries its own `node_modules` separate from the workspace, and the root `typedoc` script invokes the binary from that isolated install:

```jsonc
// package.json (root)
{
  "scripts": {
    "typedoc:install": "cd tools/apidocs && bun install",
    "typedoc": "tools/apidocs/node_modules/.bin/typedoc",
  },
}
```

The trick is to keep the working directory at the repo root (so the relative paths in `typedoc.json` still resolve) while launching only the `typedoc` binary from the isolated side. That binary resolves the `typescript@6` sitting next to it, so TypeDoc runs on TS6 even though the workspace is on TS7. Our GitHub Actions docs workflow was updated to install this isolated tooling and run it the same way.

> [!NOTE]
> We originally named the directory `tools/typedoc/`, but `.gitignore` had a `typedoc/` rule (which matches a directory named "typedoc" anywhere), so the whole thing was ignored. Renaming it to `tools/apidocs/` fixed that.

## Verification

Everything below was checked on TypeScript 7 (the native tsc):

| Check                        | Result              |
| ---------------------------- | ------------------- |
| typecheck (backend/frontend) | ✅ no errors        |
| unit tests                   | ✅ all 1012 passing |
| lint                         | ✅ no errors        |
| build                        | ✅ success          |
| TypeDoc (isolated on TS6)    | ✅ no errors        |

## If you're migrating too

- **It's still RC.** 7.0.1-rc is pre-release, so run your CI end-to-end before relying on it in production.
- **Editor setup.** To use TS7 in VS Code and friends, point the workspace TypeScript version at `node_modules/typescript/lib`.
- **Isolate TypeDoc if you use it.** A separate install pinned to TS6, as shown above, is the pragmatic path for now.

## Wrapping up

It's not a feature, but a native compiler plus fresh dependencies compound into real development velocity over time. We'll keep quietly tuning the chassis that makes Rox light and fast.

Feedback and bug reports are welcome on [GitHub Issues](https://github.com/Love-Rox/rox/issues).

**The Love Rocks. Rox.** 🚀
