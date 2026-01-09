---
title: Plugin Architecture
description: Detailed documentation of Rox plugin system internal architecture and components
date: 2026-01-09
author: Rox Team
tags: [plugin, architecture, EventBus, PluginLoader]
---

# Plugin Architecture

This document explains the internal architecture of the Rox plugin system in detail.

## Component Overview

The Rox plugin system consists of the following main components:

```
┌─────────────────────────────────────────────────┐
│                  PluginManager                   │
│    (Manages plugin installation/uninstallation)  │
└─────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│                  PluginLoader                    │
│       (Loads/unloads/reloads plugins)           │
└─────────────────────────────────────────────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────────┐
│  EventBus   │ │PermManager  │ │PluginConfig     │
│  (Events)   │ │(Permissions)│ │Storage (Config) │
└─────────────┘ └─────────────┘ └─────────────────┘
```

## PluginContext

Plugins receive `PluginContext` in the `onLoad` callback. This is the primary interface for plugins to access Rox core services.

```typescript
interface PluginContext {
  /** EventBus for subscribing to events */
  events: IEventBus;

  /** Plugin-specific logger */
  logger: pino.Logger;

  /** Plugin-specific configuration storage */
  config: PluginConfigStorage;

  /** Register scheduled tasks */
  registerScheduledTask(task: ScheduledTask): void;

  /** Base URL of the Rox instance */
  baseUrl: string;

  /** Current Rox version */
  roxVersion: string;
}
```

### events - EventBus

Provides access to the event system.

```typescript
onLoad({ events }) {
  // Subscribe to "after" events (notification only)
  events.on("note:afterCreate", ({ note }) => {
    console.log("Note created:", note.id);
  });

  // Subscribe to "before" events (can cancel/modify)
  events.onBefore("note:beforeCreate", (data) => {
    if (data.content.includes("spam")) {
      return { cancel: true, reason: "Spam detected" };
    }
    return {};
  });
}
```

### logger - Logger

A namespaced logger specific to the plugin.

```typescript
onLoad({ logger }) {
  logger.info("Plugin loaded");
  logger.warn({ someData: "value" }, "Warning message");
  logger.error({ err: error }, "An error occurred");
}
```

### config - Configuration Storage

Storage for persisting plugin-specific configuration.

```typescript
onLoad({ config }) {
  // Get configuration value
  const keywords = await config.get<string[]>("keywords") ?? [];

  // Set configuration value
  await config.set("keywords", ["sensitive", "nsfw"]);

  // Delete configuration value
  await config.delete("keywords");

  // Get all configuration
  const allConfig = await config.getAll();
}
```

### registerScheduledTask - Scheduled Tasks

Register tasks that run periodically.

```typescript
onLoad({ registerScheduledTask, logger }) {
  registerScheduledTask({
    id: "cleanup-task",
    name: "Cleanup Task",
    schedule: "1h", // Every hour
    runOnStartup: true, // Also run at startup
    async handler() {
      logger.info("Running cleanup...");
    },
  });
}
```

Schedule formats:
- `"30s"` - Every 30 seconds
- `"5m"` - Every 5 minutes
- `"1h"` - Every hour
- `"24h"` - Every 24 hours
- Number (milliseconds) - e.g., `60000` (1 minute)

## Lifecycle Hooks

### onLoad

Called when the plugin is loaded. Use this for subscribing to events, initializing resources, etc.

```typescript
const myPlugin: RoxPlugin = {
  id: "my-plugin",
  name: "My Plugin",
  version: "1.0.0",

  async onLoad(context) {
    // Async initialization is also supported
    await initializeDatabase();
    
    context.logger.info("Plugin initialized");
  },
};
```

### onUnload

Called when the plugin is unloaded. Use this for resource cleanup.

```typescript
const myPlugin: RoxPlugin = {
  // ...

  async onUnload() {
    // Close connections, release resources, etc.
    await closeConnections();
  },
};
```

> [!NOTE]
> Event subscriptions are automatically cleaned up. In `onUnload`, you only need to clean up custom resources.

## Custom Routes

Plugins can register their own API routes. Routes are registered under `/api/x/{plugin-id}/`.

```typescript
const myPlugin: RoxPlugin = {
  id: "my-stats",
  name: "My Stats Plugin",
  version: "1.0.0",

  routes(app) {
    // GET /api/x/my-stats/health
    app.get("/health", (c) => {
      return c.json({ status: "ok" });
    });

    // POST /api/x/my-stats/analyze
    app.post("/analyze", async (c) => {
      const body = await c.req.json();
      return c.json({ result: "analyzed", data: body });
    });

    // Routes with parameters
    // GET /api/x/my-stats/user/:id
    app.get("/user/:id", (c) => {
      const id = c.req.param("id");
      return c.json({ userId: id });
    });
  },
};
```

Routes are defined using the [Hono](https://hono.dev) framework.

## Global Middleware

Plugins can register global middleware. This runs for all requests.

```typescript
const myPlugin: RoxPlugin = {
  id: "request-logger",
  name: "Request Logger",
  version: "1.0.0",

  middleware: [
    async (c, next) => {
      const start = Date.now();
      await next();
      const duration = Date.now() - start;
      console.log(`${c.req.method} ${c.req.url} - ${duration}ms`);
    },
  ],
};
```

> [!WARNING]
> Middleware runs for every request, so minimize performance impact. Also, once registered, middleware cannot be removed until server restart.

## Hot Reloading

During development, hot reloading of plugins is supported.

```bash
# Reload a plugin
bun run plugin reload <plugin-id>
```

PluginLoader handles the following:
1. Unload the plugin (calls `onUnload`)
2. Clean up event subscriptions
3. Clear module cache
4. Reload the plugin (calls `onLoad`)

## Security

### Permission System

Plugins must declare required permissions in their manifest. Plugins without declared permissions run in a restricted context.

```json
{
  "permissions": ["note:read", "note:write", "user:read"]
}
```

### Permission List

| Permission | Description | Risk Level |
|-----------|-------------|------------|
| `note:read` | Read notes | Low |
| `note:write` | Create/update/delete notes | Medium |
| `user:read` | Read user information | Low |
| `user:write` | Update user information | High |
| `config:read` | Read configuration | Low |
| `config:write` | Write configuration | Medium |
| `admin:read` | Read admin functions | High |
| `admin:write` | Write admin functions | High |
| `storage:read` | Read storage | Low |
| `storage:write` | Write storage | Medium |

### Security Auditing

PluginLoader has built-in security auditing that logs the following events:

- Plugin load/unload
- High-risk permission usage
- Permission violations
- Load failures

## Dependencies

Plugins can declare dependencies on other plugins.

```json
{
  "dependencies": ["other-plugin", "another-plugin"]
}
```

If a dependency plugin is not loaded, the plugin load will fail.

## Related Documentation

- [Plugin Getting Started](plugin-getting-started) - Introductory guide
- [Plugin Manifest](plugin-manifest) - plugin.json reference
- [Plugin Events](plugin-events) - Event system details
