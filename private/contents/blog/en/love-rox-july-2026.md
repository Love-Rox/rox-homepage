---
title: What We Built in July 2026 - LaboLabo, Harushion, kichijitsu, and kumihimo
description: Alongside the stable release of Rox v2026.7.0, July brought four new products from Love-Rox - a parallel workspace for AI coding agents, a GitHub client, a calendar, and a library for AV signal flow diagrams
date: 2026-07-31
author: Rox Team
tags: [News, LaboLabo, Harushion, kichijitsu, kumihimo, Release]
excerpt: July was a month of new products at Love-Rox. LaboLabo runs AI coding agents in parallel, one git worktree per session, on macOS. Harushion follows GitHub issues and PRs by search query. kichijitsu is a local-first calendar client. kumihimo writes AV signal flow diagrams as text. Here is what each of them set out to solve.
---

# What We Built in July 2026

July at Love-Rox brought four new products, alongside the stable release of [Rox v2026.7.0](/blog/rox-v2026-7-0).

Each of them started from something that was getting in our way. This post covers what each one set out to solve.

## 🧪 LaboLabo — Run AI agents in parallel, and see their diffs right next to them

**Site: <https://labolabo.love-rox.cc>** · [GitHub](https://github.com/Love-Rox/labolabo)

Run several AI coding agents at once — Claude Code, Codex, Gemini — and you quickly lose track of which session changed what. Tiling terminals doesn't help much: what you see is the agent talking, not the state of the repository. For that you still have to run `git diff` somewhere else.

LaboLabo organises this around one principle: **one session, one git worktree**.

- **Left pane**: a tree of repositories and sessions, showing session name, branch, and state at a glance
- **Centre**: a real GPU-accelerated terminal where the agent runs interactively
- **Right pane**: the list of changed files, switchable between diff and full file contents

Because each session has its own worktree, running them in parallel doesn't tangle the work. And the changes made by the agent in the centre terminal show up live in the right pane.

The defining technical choice is embedding **libghostty** as an XCFramework. Rather than writing a terminal emulator or shelling out to an existing app, LaboLabo hosts a real, GPU-rendered terminal inside itself.

|              |                                                          |
| ------------ | -------------------------------------------------------- |
| Platform     | Native macOS (Swift + SwiftUI)                           |
| Terminal     | libghostty, embedded as an XCFramework                   |
| Engine layer | Process, Git, and state as UI-independent Swift `actor`s |
| Persistence  | GRDB.swift (SQLite)                                      |

The current version is **v1.2.5**.

```sh
brew tap love-rox/tap
brew trust love-rox/tap          # required for third-party taps
brew install --cask labolabo
```

## 🌸 Harushion — Follow GitHub issues and PRs as "Streams"

**Site: <https://harushion.love-rox.cc>** · [GitHub](https://github.com/Love-Rox/Harushion)

Left alone, GitHub notifications become an ocean of read and unread. Harushion takes a different angle: instead of chasing notifications, **you define what you want to see as a GitHub search query, called a Stream**.

- **Streams**: control what you're watching, one search query at a time
- **Filters**: narrowing within a Stream happens locally and **doesn't consume API rate limit**
- **Branch graph**: branch state visualised as a DAG
- **In-app browser**: a github.com-only window, with the option to open externally

Authentication deliberately **avoids storing tokens**. It delegates to the GitHub CLI (`gh`), fetching a token via `gh auth token` on demand and keeping it in memory only. Not owning the storage of credentials keeps both the design and the operational story lighter.

It's built on Tauri 2 and React, with a Rust + SQLite backend and a frontend that sticks to presentation. Packages ship for Windows and Linux as well as macOS, and new versions are announced in an in-app banner with self-update built in.

The current version is **v0.1.14**.

```sh
brew tap love-rox/tap
brew install --cask harushion
xattr -rd com.apple.quarantine /Applications/Harushion.app
```

For Windows and Linux, grab the nsis installer or the AppImage / deb / rpm from [Releases](https://github.com/Love-Rox/Harushion/releases).

## 📅 kichijitsu — A local-first calendar client

**Site: <https://kichijitsu.love-rox.cc>** · [GitHub](https://github.com/Love-Rox/kichijitsu)

A calendar client aiming for something close to Notion Calendar's feel, built local-first. It went from v0.1.0 to **v0.1.8** during July alone.

- **A three-day timeline by default**, with 1-day / 3-day / month on narrow screens and the usual week / month on wide ones
- **Google Calendar sync**, covering incremental sync plus recurrence rules (RRULE), event colours, and reminders
- **Meeting links**: Google Meet, Zoom, Teams, and Slack huddles are recognised, shown as icons, and surfaced as a "join with ⋯" link
- **Editing**: Option-drag to duplicate an event, autocomplete for locations, and a choice of scope when editing or moving a recurring event
- **Mobile**: swipe anywhere to move between days; tap an event to select it before moving it

The architecture is three layers: a web app (PWA), a desktop app (Tauri), and a Cloudflare Workers service for sync. Calendar sync turned out to be full of specification traps — how deletions surface in Google Calendar's incremental sync, the ID scheme for recurring instances, what `useDefault` and `overrides` actually mean for reminders. Working through them one at a time is ongoing.

## 🎛️ kumihimo — AV signal flow diagrams as text

**Site: <https://kumihimo.love-rox.cc/en>** · [GitHub](https://github.com/Love-Rox/kumihimo) · [npm](https://www.npmjs.com/package/@love-rox/kumihimo-core)

What Mermaid does for flowcharts, kumihimo does for **AV signal flow diagrams** — with two decisive differences. **The unit of connection is a port, not a node**, and **the signal type on a cable is information the tool understands, not decoration**.

```khm
device cam "SONY FX3"  as camera   { out SDI : sdi }
device sw  "ATEM Mini" as switcher { in 1..8 : sdi  out PGM : sdi }
device rec "HyperDeck" as recorder { in SDI : sdi }

cam.SDI -> sw.1     : sdi 30m "V-01" [color=blue]
sw.PGM  -> rec.SDI  : sdi 2m  "V-10"
```

Why ports? A mixer's `IN 12` is a different thing from its `IN 13`. An SDI output cannot feed an HDMI input. The length and jacket colour of a cable are facts somebody needs on site. A flowchart tool can draw a picture of all this; **it cannot tell you when the picture is wrong**.

|                        | Mermaid flowchart | kumihimo                                       |
| ---------------------- | ----------------- | ---------------------------------------------- |
| Unit of connection     | node → node       | **port → port**                                |
| Meaning of a line      | arbitrary         | **signal type** (SDI / XLR / Dante …)          |
| Validation             | none              | type mismatches, direction, over-booked inputs |
| Position within a node | meaningless       | **meaningful** — `IN 1` is not `IN 2`          |

The faults worth catching are the ones where **the cable plugs in perfectly and nothing works**. HDBaseT, for instance, uses Cat cable and RJ45 but is not Ethernet, so patching it into a network switch does nothing — while fitting perfectly.

The packages are split by use:

- `@love-rox/kumihimo-core` — parser, validator, layout, and SVG renderer
- `@love-rox/kumihimo-cli` — `kumihimo build` / `check` / `export` / `--watch`
- `@love-rox/kumihimo-rehype` — render code fences in Markdown pipelines
- `@love-rox/kumihimo-react` / `-vue` / `-astro` — framework components and integrations
- `@love-rox/kumihimo-editor` — an embeddable live editor

The CLI can also export to draw.io format and produce cable schedules for use on site.

So that the same console doesn't have to be rewritten for every diagram, `model` defines a piece of equipment once and `device … from` instantiates it as many times as needed.

```khm
model dm3 "Yamaha DM3" as mixer {
  in  CH[1..16] : xlr
  out L, R      : xlr
  @vendor "Yamaha"
}

device foh from dm3
device mon from dm3 "Monitor console"
```

The site carries a live editor, so you can try the syntax without installing anything.

Published on July 30th, currently at **v0.1.0** on npm.

## 📦 On distribution

macOS apps are distributed through [love-rox/tap](https://github.com/Love-Rox/homebrew-tap).

```sh
brew tap love-rox/tap
```

As a third-party tap, casks require `brew trust love-rox/tap` before installing. Builds are unsigned, so if Gatekeeper blocks the first launch, follow the steps shown in the `caveats` at install time — clearing the quarantine attribute with `xattr`, or right-click → Open in Finder.

## Closing

All four are still early in their version numbers. We'll keep growing each of them through August.

If something gets in your way, or you find yourself wishing it worked differently, open an issue on the relevant repository.

**The Love Rocks. Rox.** 🛠️
