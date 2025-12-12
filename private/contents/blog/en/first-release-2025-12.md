---
title: "1-2, 1-2: We've Released Rox!"
description: "2025/12/12 We've released our first major version of Rox!"
date: 2025-12-12
author: Rox Team
tags: [Rox, ActivityPub, Major Release, Announcement]
excerpt: "We've released our first major version of Rox!"
---

# 1-2, 1-2: We've Released Rox!

## It's Finally Here

You know how people say "one-two, one-two" when testing a microphone? Well, it's not exactly related, but on December 12, 2025, we released Rox's first major version **v2025.12.0**! 🎉

The feature set is still fairly minimal, but this release lays the groundwork for future plugin support. By the way, the internal version is **v1.0.0**.

## About This Release

Think of this release as "core features, all in place." We've made countless changes and fixes throughout the beta and RC phases. At this point, we believe Rox can federate with other servers without throwing errors.

### Timeline

The timeline displays server information for remote users. Reactions added on remote instances are reflected as quickly as possible.

However, you can't add reactions to reactions that were made remotely. You'll need to react from within your own server. Remote reactions are displayed with a dotted border so you can easily distinguish them from local ones.

### MFM (Misskey Flavored Markdown)

MFM inherits Misskey's markdown format as-is. We've made sure it handles MFM used in usernames and profiles correctly. If you find any display issues, we'll fix them as they come up.

### Push Notifications

Push notifications are supported. If you configure your server properly during setup, you'll be able to receive notifications. You can also choose which types of notifications you want to receive.

### PWA Support

Since we use Waku for the frontend, it's not a SPA, but you can still add it to your smartphone's home screen. It also works like an app on PC—in both cases, the address bar disappears, which we highly recommend.

## For Developers

### DevContainer Support

We've added DevContainer support. If you want to quickly spin up a development environment, give it a try. If you find any issues, we'd appreciate PRs to help fix them.

We've also made sure Claude Code works inside DevContainer, so if you use it, feel free to take advantage of that.

Additionally, Serena's memory files are included, which might be helpful for AI-assisted development.

### License

Rox is released under AGPL-3.0 (GNU Affero General Public License v3). This copyleft license requires that modified source code be made available even when providing the software as a network service. We chose this license because we value contributions to the open source community.

## Why Not Give It a Try Over the Holidays?

I feel like I'm forgetting some things I wanted to write about... but anyway, it's released!

We'd love for people to try out Rox and give us feedback so we can continue improving. If you have some free time over the holidays, please give it a try.

We're going to keep growing Rox little by little from here. Whether you're setting up your own instance or contributing to the project, we welcome you!

If you have any questions or feedback, feel free to reach out on [GitHub](https://github.com/Love-rox/rox) 🚀
