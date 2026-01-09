---
title: Plugin Development Getting Started
description: An introductory guide to the Rox plugin system. Create your first plugin.
date: 2026-01-09
author: Rox Team
tags: [plugin, development, tutorial]
---

# Plugin Development Getting Started

The Rox plugin system allows you to extend server functionality. This guide explains how to create your first plugin.

## Plugin System Overview

The Rox plugin system provides the following features:

- **Lifecycle Event Hooks**: Intercept events like note creation, user registration, etc.
- **Custom API Routes**: Add plugin-specific API endpoints
- **Configuration Storage**: Persist plugin-specific settings
- **Scheduled Tasks**: Register tasks that run periodically

## Quick Start

### 1. Create Plugin Directory

Plugins are placed under the `./plugins` directory:

```bash
mkdir -p plugins/my-first-plugin
cd plugins/my-first-plugin
```

### 2. Create Manifest File

Create `plugin.json` to define plugin metadata:

```json
{
  "id": "my-first-plugin",
  "name": "My First Plugin",
  "version": "1.0.0",
  "description": "My first Rox plugin",
  "author": "Your Name",
  "license": "MIT",
  "minRoxVersion": "2026.1.0",
  "permissions": ["note:read"],
  "backend": "index.ts"
}
```

### 3. Create Plugin Code

Create `index.ts`:

```typescript
import type { RoxPlugin } from "@rox/backend/plugins";

const myPlugin: RoxPlugin = {
  id: "my-first-plugin",
  name: "My First Plugin",
  version: "1.0.0",
  description: "My first Rox plugin",

  onLoad({ events, logger }) {
    logger.info("My First Plugin loaded!");

    // Subscribe to note creation events
    events.on("note:afterCreate", ({ note }) => {
      logger.info({ noteId: note.id }, "New note created");
    });
  },

  onUnload() {
    console.log("My First Plugin unloaded");
  },
};

export default myPlugin;
```

### 4. Install the Plugin

Use the Rox CLI to install your plugin:

```bash
# Install from local path
bun run plugin install ./plugins/my-first-plugin

# Install from GitHub
bun run plugin install https://github.com/user/my-rox-plugin
```

## Plugin CLI

Rox includes a built-in CLI for plugin management:

```bash
# Install a plugin
bun run plugin install <source>

# List installed plugins
bun run plugin list

# Enable/disable a plugin
bun run plugin enable <plugin-id>
bun run plugin disable <plugin-id>

# Show plugin details
bun run plugin info <plugin-id>

# Uninstall a plugin
bun run plugin uninstall <plugin-id>
```

### Installation Options

```bash
# Force install (overwrite existing)
bun run plugin install <source> --force

# Don't enable after installation
bun run plugin install <source> --no-enable

# Keep files when uninstalling
bun run plugin uninstall <plugin-id> --keep-files
```

## Plugin ID Naming Rules

Plugin IDs must follow these rules:

- Only lowercase alphanumeric characters and hyphens
- 3-50 characters
- Must start with a letter
- Must end with a letter or digit

```
✅ Valid examples: my-plugin, content-filter, awesome-mod-1
❌ Invalid examples: MyPlugin, my_plugin, 1-plugin, plugin-
```

## Next Steps

Now that you understand the basics, learn more from these documents:

- [Plugin Architecture](plugin-architecture) - Internal structure of the plugin system
- [Plugin Manifest](plugin-manifest) - Complete reference for plugin.json
- [Plugin Events](plugin-events) - Details of the event system

## Sample Plugins

### Activity Logger Plugin

```typescript
import type { RoxPlugin } from "@rox/backend/plugins";

const activityLogger: RoxPlugin = {
  id: "activity-logger",
  name: "Activity Logger",
  version: "1.0.0",

  onLoad({ events, logger }) {
    // Log note creation
    events.on("note:afterCreate", ({ note }) => {
      logger.info({ noteId: note.id }, "Note created");
    });

    // Log note deletion
    events.on("note:afterDelete", ({ noteId }) => {
      logger.info({ noteId }, "Note deleted");
    });

    // Log user registration
    events.on("user:afterRegister", ({ userId, username }) => {
      logger.info({ userId, username }, "User registered");
    });
  },
};

export default activityLogger;
```

### Content Moderation Plugin

```typescript
import type { RoxPlugin } from "@rox/backend/plugins";

const contentFilter: RoxPlugin = {
  id: "content-filter",
  name: "Content Filter",
  version: "1.0.0",

  async onLoad({ events, config, logger }) {
    // Get blocked words from config
    const blockedWords = await config.get<string[]>("blockedWords") ?? [];

    events.onBefore("note:beforeCreate", ({ content }) => {
      const hasBlocked = blockedWords.some(word =>
        content.toLowerCase().includes(word.toLowerCase())
      );

      if (hasBlocked) {
        logger.warn({ content: content.substring(0, 50) }, "Blocked content");
        return { cancel: true, reason: "Content contains blocked words" };
      }

      return {};
    });
  },
};

export default contentFilter;
```
