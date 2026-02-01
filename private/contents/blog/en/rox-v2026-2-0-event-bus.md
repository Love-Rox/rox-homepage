---
title: "Rox v2026.2.0 Released - EventBus Foundation Enhancement"
description: "Enhanced plugin system EventBus foundation with major frontend refactoring"
date: 2026-02-01
author: Rox Team
tags: [Rox, Update, Plugin, Announcement]
excerpt: "Rox v2026.2.0 includes EventBus foundation enhancement, Waku upgrade, frontend refactoring, improved remote user display, and more."
---

# Rox v2026.2.0 Released - EventBus Foundation Enhancement

## February 2026 Update

We've released **Rox v2026.2.0**! 🎉

This release further strengthens the plugin system foundation introduced in v2026.1.0 and includes major frontend refactoring.

## Version Information

| Component | Version |
|-----------|---------|
| **Rox (Project)** | `2026.2.0` |
| Hono Rox (Backend) | `1.4.0` |
| Waku Rox (Frontend) | `1.4.0` |
| Shared | `1.4.0` |

## New Features & Improvements

### 🚀 EventBus Foundation Enhancement

We've significantly enhanced the EventBus foundation, the core of the plugin system.

#### EventBus Class

- **Type-safe event handling**: Process post-action events with `on()` / `emit()`
- **Pre-action events**: `onBefore()` / `emitBefore()` with cancellation support
- **Priority-based execution**: Higher priority handlers run first
- **Error isolation**: One handler's failure doesn't affect others

#### Plugin Type Definitions

- `RoxPlugin` interface for plugin registration
- `PluginContext` for accessing core services
- Sanitized types excluding sensitive data (`PluginUser`, `PluginNote`, `PluginFollow`)

#### Event Hooks Integrated into Services

- **NoteService**: `note:beforeCreate`, `note:afterCreate`, `note:beforeDelete`, `note:afterDelete`
- **AuthService**: `user:beforeRegister`, `user:afterRegister`, `user:beforeLogin`, `user:afterLogin`
- **FollowService**: `follow:afterCreate`, `follow:afterDelete`

### 🔧 Waku 1.0.0-alpha.3 Upgrade

We've upgraded the frontend framework to Waku 1.0.0-alpha.3.

- **FormModal**: Reusable modal base component
- **API Utilities**: `buildPaginationParams()` and `buildUrlWithParams()` for cleaner API calls
- **Error Utilities**: `getErrorMessage()` for consistent error message extraction
- **Component Refactoring**: ListCreateModal and ListEditModal use FormModal to reduce boilerplate

### 🎨 Frontend Refactoring

We've performed major frontend refactoring.

#### Introduction of useApi Hook

A new hook for centralized authentication state management:

- `token`: Current authentication token
- `isAuthenticated`: Boolean authentication status
- `get/post/put/delete`: Authenticated API methods

#### Component Splitting

Split large components into smaller, focused modules:

| Original | Split Into |
|----------|------------|
| `NoteCard.tsx` (929 lines) | `NoteCard.tsx` + `NoteCardMenu.tsx` |
| `NoteComposer.tsx` (1430 lines) | `NoteComposer.tsx` + `NoteComposerAttachments.tsx` + `NoteComposerDrafts.tsx` + `NoteComposerSchedulePicker.tsx` |
| `EmojiPicker.tsx` (1193 lines) | `EmojiPicker.tsx` + `emojiData.ts` |

#### TSDoc Documentation

Added comprehensive TSDoc comments to all exported components, hooks, and type definitions.

### 👤 Improved Remote User Profile Display

Improved display for remote users:

- **Username format**: Now displays `@username@host` format
- **Instance badge**: Shows remote instance icon and name
- **Back button navigation**: Fixed SPA navigation

### 🐛 Bug Fixes

- Unified mentions field to store user IDs consistently
- Managed remote instance icon fallback display using React state
- Simplified redundant ternary expressions

## How to Update

If using Docker:

```bash
docker compose pull
docker compose up -d
```

For bare metal installations, pull the latest version, rebuild, and restart.

## The Future of Rox

With the enhanced EventBus foundation, plugin development has become even easier. We'll continue making improvements.

If you have any questions or feedback, please reach out via our [GitHub repository](https://github.com/Love-Rox/rox).

**Love rocks. Rox.** 🚀
