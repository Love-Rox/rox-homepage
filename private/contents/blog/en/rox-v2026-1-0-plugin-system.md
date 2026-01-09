---
title: "Rox v2026.1.0 Released - Plugin System is Here!"
description: "The first release of 2026 brings the Plugin System Foundation"
date: 2026-01-09
author: Rox Team
tags: [Rox, Update, Plugin, Announcement]
excerpt: "Rox v2026.1.0 introduces the Plugin System Foundation! With EventBus architecture, UI slot system, hot reload support, and more, extensibility has been significantly improved."
---

# Rox v2026.1.0 Released - Plugin System is Here!

## First Major Update of 2026

Happy New Year! We're excited to deliver **Rox v2026.1.0** as our first release of 2026 🎉

This release brings the long-awaited **Plugin System Foundation**, enabling you to freely extend Rox's functionality.

## New Feature: Plugin System Foundation

### EventBus Architecture

We've implemented a central event system for plugin communication. With before/after lifecycle hooks, you can inject custom processing before and after event handling.

### Secure Plugin Context

Plugins run in a sandboxed environment with permission-based access control for safe operation:

- **storage** - Data storage and retrieval
- **api** - API calls
- **ui** - UI element additions
- **events** - Event subscription and publishing

### Plugin Registry

We've implemented a registry for dynamic plugin loading, registration, and lifecycle management. Installing and uninstalling plugins is now straightforward.

### UI Slot System

We've prepared component injection points in the frontend. Plugins can add their own UI components to designated areas.

### Hot Reload Support

Development mode supports hot reload with file watching, speeding up iteration during plugin development.

## Sample Plugins

We've included two sample plugins as references for plugin development:

### activity-logger

A plugin demonstrating event subscription and Storage API usage. It records user activities as logs.

### auto-cw

A plugin demonstrating UI injection and note creation interception. It automatically adds CW (Content Warning) under specific conditions.

## Other Improvements

### Deck Features

- Added refresh button to columns
- Real-time updates for Mentions and List columns
- Real-time updates for Notifications column

### OGP & Embed Features

- Improved Discord/Slack embed display
- Added oEmbed endpoint
- Added ActivityPub alternate link (Misskey compatible)

### Mastodon API Compatibility

- Added statuses/accounts endpoints
- Improved compatibility with existing Mastodon clients

## Documentation

We've prepared comprehensive documentation for plugin development:

- Plugin Development Guide (English/Japanese)
- Plugin Marketplace Specification
- Architecture Documentation

## How to Update

If using Docker:

```bash
docker compose pull
docker compose up -d
```

For bare metal installations, pull the latest version, rebuild, and restart.

## The Future of Rox

With the plugin system foundation in place, we're looking forward to plugin development from the community. Why not bring your ideas to life as plugins?

If you have any questions or feedback, please reach out via our [GitHub repository](https://github.com/Love-Rox/rox).

**Love rocks. Rox.** 🚀
