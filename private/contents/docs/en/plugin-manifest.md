---
title: Plugin Manifest
description: Complete reference for the plugin.json manifest file
date: 2026-01-09
author: Rox Team
tags: [plugin, manifest, plugin.json, reference]
---

# Plugin Manifest

`plugin.json` is the manifest file that defines plugin metadata. This document explains all available fields.

## Basic Structure

```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "description": "Plugin description",
  "author": "Author Name",
  "license": "MIT",
  "homepage": "https://example.com",
  "repository": "https://github.com/user/my-plugin",
  "minRoxVersion": "2026.1.0",
  "maxRoxVersion": "2026.12.0",
  "permissions": ["note:read", "note:write"],
  "dependencies": ["other-plugin"],
  "backend": "index.ts",
  "frontend": "frontend/index.ts",
  "configSchema": {},
  "keywords": ["moderation", "filter"],
  "icon": "icon.png",
  "screenshots": ["screenshot1.png", "screenshot2.png"]
}
```

## Required Fields

### id

Unique identifier for the plugin.

| Attribute | Value |
|-----------|-------|
| Type | `string` |
| Required | Yes |
| Format | Lowercase alphanumeric and hyphens, 3-50 characters |

**Rules:**
- Must start with a lowercase letter
- Must end with a lowercase letter or digit
- Middle characters can be lowercase letters, digits, or hyphens

```json
{
  "id": "content-filter"
}
```

**Validation regex:** `/^[a-z][a-z0-9-]{1,48}[a-z0-9]$/`

### name

Display name for the plugin.

| Attribute | Value |
|-----------|-------|
| Type | `string` |
| Required | Yes |
| Max Length | 100 characters |

```json
{
  "name": "Content Filter Plugin"
}
```

### version

Version number in semantic versioning format.

| Attribute | Value |
|-----------|-------|
| Type | `string` |
| Required | Yes |
| Format | Semantic Versioning (e.g., `1.0.0`, `2.1.0-beta.1`) |

```json
{
  "version": "1.2.3"
}
```

## Optional Fields

### description

Description of the plugin.

| Attribute | Value |
|-----------|-------|
| Type | `string` |
| Required | No |
| Max Length | 500 characters |

```json
{
  "description": "A plugin that automatically filters inappropriate content"
}
```

### author

Author name or organization.

| Attribute | Value |
|-----------|-------|
| Type | `string` |
| Required | No |

```json
{
  "author": "Rox Team"
}
```

### license

Plugin license (SPDX identifier recommended).

| Attribute | Value |
|-----------|-------|
| Type | `string` |
| Required | No |

```json
{
  "license": "MIT"
}
```

### homepage

Homepage URL for the plugin.

| Attribute | Value |
|-----------|-------|
| Type | `string` |
| Required | No |
| Format | Valid HTTP/HTTPS URL |

```json
{
  "homepage": "https://example.com/my-plugin"
}
```

### repository

Git repository URL.

| Attribute | Value |
|-----------|-------|
| Type | `string` |
| Required | No |
| Format | Valid HTTP/HTTPS URL |

```json
{
  "repository": "https://github.com/user/my-plugin"
}
```

### minRoxVersion

Minimum required Rox version (CalVer format).

| Attribute | Value |
|-----------|-------|
| Type | `string` |
| Required | No |
| Format | CalVer (e.g., `2026.1.0`, `2025.12.1-beta.1`) |

```json
{
  "minRoxVersion": "2026.1.0"
}
```

### maxRoxVersion

Maximum supported Rox version (CalVer format).

| Attribute | Value |
|-----------|-------|
| Type | `string` |
| Required | No |
| Format | CalVer |

```json
{
  "maxRoxVersion": "2026.12.0"
}
```

### permissions

Array of permissions required by the plugin.

| Attribute | Value |
|-----------|-------|
| Type | `PluginPermission[]` |
| Required | No |

**Available Permissions:**

| Permission | Description |
|-----------|-------------|
| `note:read` | Read notes |
| `note:write` | Create/update/delete notes |
| `user:read` | Read user information |
| `user:write` | Update user information |
| `config:read` | Read configuration |
| `config:write` | Write configuration |
| `admin:read` | Read admin functions |
| `admin:write` | Write admin functions |
| `storage:read` | Read storage |
| `storage:write` | Write storage |

```json
{
  "permissions": ["note:read", "note:write", "user:read"]
}
```

> [!IMPORTANT]
> Plugins without declared permissions run in a restricted context with no access to protected resources.

### dependencies

Array of other plugin IDs this plugin depends on.

| Attribute | Value |
|-----------|-------|
| Type | `string[]` |
| Required | No |

```json
{
  "dependencies": ["base-plugin", "helper-plugin"]
}
```

If a dependency plugin is not loaded, the plugin load will fail.

### backend

Relative path to the backend entry point.

| Attribute | Value |
|-----------|-------|
| Type | `string` |
| Required | No |
| Default | `index.ts` or `index.js` |

```json
{
  "backend": "src/index.ts"
}
```

### frontend

Relative path to the frontend entry point.

| Attribute | Value |
|-----------|-------|
| Type | `string` |
| Required | No |

```json
{
  "frontend": "frontend/index.ts"
}
```

> [!NOTE]
> A warning is displayed if neither `backend` nor `frontend` is specified.

### configSchema

JSON Schema for plugin configuration.

| Attribute | Value |
|-----------|-------|
| Type | `object` |
| Required | No |

```json
{
  "configSchema": {
    "type": "object",
    "properties": {
      "blockedWords": {
        "type": "array",
        "items": { "type": "string" },
        "description": "List of words to filter"
      },
      "enabled": {
        "type": "boolean",
        "default": true,
        "description": "Whether filtering is enabled"
      }
    }
  }
}
```

### keywords

Array of keywords for search.

| Attribute | Value |
|-----------|-------|
| Type | `string[]` |
| Required | No |

```json
{
  "keywords": ["moderation", "filter", "content", "safety"]
}
```

### icon

Path or URL to the plugin icon.

| Attribute | Value |
|-----------|-------|
| Type | `string` |
| Required | No |

```json
{
  "icon": "assets/icon.png"
}
```

### screenshots

Array of screenshot paths for plugin listing.

| Attribute | Value |
|-----------|-------|
| Type | `string[]` |
| Required | No |

```json
{
  "screenshots": [
    "assets/screenshot-1.png",
    "assets/screenshot-2.png"
  ]
}
```

## Complete Examples

### Simple Plugin

```json
{
  "id": "hello-world",
  "name": "Hello World",
  "version": "1.0.0",
  "description": "A simple Hello World plugin",
  "author": "Your Name",
  "backend": "index.ts"
}
```

### Full-Featured Plugin

```json
{
  "id": "advanced-moderation",
  "name": "Advanced Moderation",
  "version": "2.1.0",
  "description": "A plugin providing advanced content moderation features",
  "author": "Moderation Team",
  "license": "AGPL-3.0",
  "homepage": "https://example.com/advanced-moderation",
  "repository": "https://github.com/example/advanced-moderation",
  "minRoxVersion": "2026.1.0",
  "permissions": [
    "note:read",
    "note:write",
    "user:read",
    "config:read",
    "config:write"
  ],
  "dependencies": ["base-moderation"],
  "backend": "src/backend/index.ts",
  "frontend": "src/frontend/index.ts",
  "configSchema": {
    "type": "object",
    "properties": {
      "blockedWords": {
        "type": "array",
        "items": { "type": "string" },
        "default": []
      },
      "blockPatterns": {
        "type": "array",
        "items": { "type": "string" },
        "default": []
      },
      "logViolations": {
        "type": "boolean",
        "default": true
      }
    }
  },
  "keywords": ["moderation", "filter", "content", "safety", "admin"],
  "icon": "assets/icon.svg",
  "screenshots": [
    "assets/screenshot-dashboard.png",
    "assets/screenshot-config.png"
  ]
}
```

## Validation

Manifest files are automatically validated on load. If there are validation errors, the plugin load will fail.

### Common Validation Errors

| Error | Cause |
|-------|-------|
| `id is required` | Missing `id` field |
| `id must be lowercase alphanumeric...` | Invalid ID format |
| `version must be in semantic versioning format` | Invalid version format |
| `invalid permission` | Invalid permission specified |
| `minRoxVersion must be in CalVer format` | Invalid version format |

## Related Documentation

- [Plugin Getting Started](plugin-getting-started) - Introductory guide
- [Plugin Architecture](plugin-architecture) - Architecture details
- [Plugin Events](plugin-events) - Event system details
