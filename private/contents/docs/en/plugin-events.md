---
title: Plugin Events
description: Detailed guide to the Rox plugin system event system and lifecycle hooks
date: 2026-01-09
author: Rox Team
tags: [plugin, events, EventBus, hooks]
---

# Plugin Events

The Rox plugin system provides an event system for hooking into application lifecycle events. This document explains the available events and how to use them.

## EventBus Overview

EventBus provides a pub/sub mechanism for plugins to subscribe to application events.

### Event Types

Rox has two types of events:

| Type | Description | Execution |
|------|-------------|-----------|
| **before** | Fired before an operation. Can cancel or modify | Sequential |
| **after** | Fired after an operation. Notification only (fire-and-forget) | Parallel |

### Event Naming Convention

Event names follow the format `{resource}:{timing}{Action}`:

- `note:beforeCreate` - Before note creation
- `note:afterCreate` - After note creation
- `user:beforeRegister` - Before user registration
- `user:afterRegister` - After user registration

## "before" Events

"before" events can cancel or modify operations. Handlers are executed sequentially.

### How to Subscribe

```typescript
events.onBefore("note:beforeCreate", (data) => {
  // Process
  return {};
});
```

### Return Value Options

"before" event handlers must return one of the following:

#### 1. Continue (no changes)

```typescript
events.onBefore("note:beforeCreate", (data) => {
  // Continue without changes
  return {};
});
```

#### 2. Cancel the operation

```typescript
events.onBefore("note:beforeCreate", (data) => {
  if (data.content.includes("blocked word")) {
    return { 
      cancel: true, 
      reason: "Content contains blocked words" 
    };
  }
  return {};
});
```

#### 3. Modify the data

```typescript
events.onBefore("note:beforeCreate", (data) => {
  // Sanitize content
  return { 
    modified: { 
      ...data, 
      content: sanitize(data.content) 
    } 
  };
});
```

### Available "before" Events

#### note:beforeCreate

Fired before a note is created.

```typescript
interface NoteBeforeCreateData {
  /** Note content text */
  content: string;
  /** User ID of the author */
  userId: string;
  /** Content warning (optional) */
  cw?: string | null;
  /** Visibility level */
  visibility?: "public" | "home" | "followers" | "specified";
  /** Local-only flag */
  localOnly?: boolean;
}
```

**Example: Content Filtering**

```typescript
events.onBefore("note:beforeCreate", ({ content, cw }) => {
  const blockedWords = ["spam", "advertisement"];
  
  if (blockedWords.some(word => content.includes(word))) {
    return { cancel: true, reason: "Content contains blocked words" };
  }
  
  // Add content warning for NSFW content
  if (content.includes("NSFW") && !cw) {
    return { modified: { content, cw: "Sensitive content" } };
  }
  
  return {};
});
```

#### note:beforeDelete

Fired before a note is deleted.

```typescript
interface NoteBeforeDeleteData {
  /** ID of the note to delete */
  noteId: string;
  /** User ID performing the deletion */
  userId: string;
}
```

**Example: Deletion Protection**

```typescript
events.onBefore("note:beforeDelete", async ({ noteId, userId }) => {
  const protectedNotes = await config.get<string[]>("protectedNotes") ?? [];
  
  if (protectedNotes.includes(noteId)) {
    return { cancel: true, reason: "This note is protected" };
  }
  
  return {};
});
```

#### user:beforeRegister

Fired before a user is registered.

```typescript
interface UserBeforeRegisterData {
  /** Username */
  username: string;
  /** Email address (optional) */
  email?: string | null;
}
```

**Example: Username Validation**

```typescript
events.onBefore("user:beforeRegister", ({ username }) => {
  const reservedNames = ["admin", "root", "system"];
  
  if (reservedNames.includes(username.toLowerCase())) {
    return { cancel: true, reason: "This username is reserved" };
  }
  
  return {};
});
```

## "after" Events

"after" events are notification only and cannot cancel operations. Handlers are executed in parallel.

### How to Subscribe

```typescript
events.on("note:afterCreate", ({ note }) => {
  // Process
});
```

### Available "after" Events

#### note:afterCreate

Fired after a note is successfully created.

```typescript
interface NoteAfterCreateData {
  /** The created note */
  note: Note;
}
```

**Example: Activity Logging**

```typescript
events.on("note:afterCreate", ({ note }) => {
  logger.info({ 
    noteId: note.id, 
    userId: note.userId,
    visibility: note.visibility 
  }, "New note created");
});
```

#### note:afterDelete

Fired after a note is successfully deleted.

```typescript
interface NoteAfterDeleteData {
  /** ID of the deleted note */
  noteId: string;
  /** User ID who performed the deletion */
  userId: string;
}
```

**Example: Deletion Logging**

```typescript
events.on("note:afterDelete", ({ noteId, userId }) => {
  logger.info({ noteId, userId }, "Note deleted");
});
```

#### user:afterRegister

Fired after a user is successfully registered.

```typescript
interface UserAfterRegisterData {
  /** ID of the registered user */
  userId: string;
  /** Username */
  username: string;
}
```

**Example: Welcome Message**

```typescript
events.on("user:afterRegister", async ({ userId, username }) => {
  logger.info({ userId, username }, "New user registered");
  
  // Send welcome notification, etc.
  await sendWelcomeNotification(userId);
});
```

## Unsubscribing

Both `events.on` and `events.onBefore` return an unsubscribe function.

```typescript
onLoad({ events }) {
  const unsubscribe = events.on("note:afterCreate", ({ note }) => {
    console.log("Note created:", note.id);
  });
  
  // Unsubscribe when needed
  unsubscribe();
}
```

> [!NOTE]
> When a plugin is unloaded, its event subscriptions are automatically cleaned up.

## Error Handling

### "after" Events

Errors in "after" event handlers don't affect other handlers. Errors are logged but not thrown.

```typescript
events.on("note:afterCreate", ({ note }) => {
  throw new Error("Something went wrong"); // Doesn't affect other handlers
});
```

### "before" Events

Errors in "before" event handlers propagate and prevent subsequent handlers from running.

```typescript
events.onBefore("note:beforeCreate", (data) => {
  throw new Error("Validation failed"); // Operation is aborted
});
```

## Practical Examples

### Content Moderation Plugin

```typescript
import type { RoxPlugin } from "@rox/backend/plugins";

const moderationPlugin: RoxPlugin = {
  id: "moderation",
  name: "Content Moderation",
  version: "1.0.0",

  async onLoad({ events, config, logger }) {
    const blockedWords = await config.get<string[]>("blockedWords") ?? [];
    const blockedPatterns = await config.get<string[]>("blockedPatterns") ?? [];

    // Content filtering
    events.onBefore("note:beforeCreate", ({ content }) => {
      // Check blocked words
      for (const word of blockedWords) {
        if (content.toLowerCase().includes(word.toLowerCase())) {
          logger.warn({ word }, "Blocked word detected");
          return { cancel: true, reason: `Blocked word "${word}" detected` };
        }
      }

      // Pattern matching
      for (const pattern of blockedPatterns) {
        if (new RegExp(pattern, "i").test(content)) {
          logger.warn({ pattern }, "Blocked pattern detected");
          return { cancel: true, reason: "Blocked pattern detected" };
        }
      }

      return {};
    });

    // Moderation logging
    events.on("note:afterCreate", ({ note }) => {
      logger.debug({ noteId: note.id }, "Note passed moderation");
    });
  },
};

export default moderationPlugin;
```

### Analytics Plugin

```typescript
import type { RoxPlugin } from "@rox/backend/plugins";

const analyticsPlugin: RoxPlugin = {
  id: "analytics",
  name: "Analytics Plugin",
  version: "1.0.0",

  async onLoad({ events, config, logger }) {
    let noteCount = 0;
    let userCount = 0;

    events.on("note:afterCreate", ({ note }) => {
      noteCount++;
      logger.info({ 
        total: noteCount, 
        noteId: note.id 
      }, "Note creation stats");
    });

    events.on("note:afterDelete", ({ noteId }) => {
      noteCount--;
      logger.info({ total: noteCount, noteId }, "Note deletion stats");
    });

    events.on("user:afterRegister", ({ userId, username }) => {
      userCount++;
      logger.info({ 
        total: userCount, 
        userId, 
        username 
      }, "User registration stats");
    });
  },
};

export default analyticsPlugin;
```

## Event Summary

| Event | Type | Description |
|-------|------|-------------|
| `note:beforeCreate` | before | Before note creation |
| `note:afterCreate` | after | After note creation |
| `note:beforeDelete` | before | Before note deletion |
| `note:afterDelete` | after | After note deletion |
| `user:beforeRegister` | before | Before user registration |
| `user:afterRegister` | after | After user registration |
| `user:beforeLogin` | before | Before user login |
| `user:afterLogin` | after | After user login |
| `follow:afterCreate` | after | After follow creation |
| `follow:afterDelete` | after | After follow deletion |

## Additional Event Details

### user:beforeLogin

Fired before a user logs in.

```typescript
interface UserBeforeLoginData {
  /** Username or email address */
  identifier: string;
}
```

**Example: Login Restriction**

```typescript
events.onBefore("user:beforeLogin", async ({ identifier }) => {
  const blockedUsers = await config.get<string[]>("blockedUsers") ?? [];
  
  if (blockedUsers.includes(identifier.toLowerCase())) {
    return { cancel: true, reason: "This account is restricted from logging in" };
  }
  
  return {};
});
```

### user:afterLogin

Fired after a user successfully logs in.

```typescript
interface UserAfterLoginData {
  /** ID of the logged-in user */
  userId: string;
  /** Username */
  username: string;
}
```

**Example: Login Notification**

```typescript
events.on("user:afterLogin", ({ userId, username }) => {
  logger.info({ userId, username }, "User logged in");
});
```

### follow:afterCreate

Fired after a follow relationship is created.

```typescript
interface FollowAfterCreateData {
  /** ID of the user who followed */
  followerId: string;
  /** ID of the user who was followed */
  followeeId: string;
}
```

**Example: Follow Notification**

```typescript
events.on("follow:afterCreate", ({ followerId, followeeId }) => {
  logger.info({ followerId, followeeId }, "New follow relationship created");
});
```

### follow:afterDelete

Fired after a follow relationship is deleted.

```typescript
interface FollowAfterDeleteData {
  /** ID of the user who unfollowed */
  followerId: string;
  /** ID of the user who was unfollowed */
  followeeId: string;
}
```

**Example: Unfollow Logging**

```typescript
events.on("follow:afterDelete", ({ followerId, followeeId }) => {
  logger.info({ followerId, followeeId }, "Follow relationship deleted");
});
```

## Related Documentation

- [Plugin Getting Started](plugin-getting-started) - Introductory guide
- [Plugin Architecture](plugin-architecture) - Architecture details
- [Plugin Manifest](plugin-manifest) - plugin.json reference

