---
title: Backend & Frontend
description: Understanding the roles of Rox's backend and frontend, and their technology stacks
date: 2026-01-10
author: Rox Team
tags: [architecture, backend, frontend, development]
---

# Backend & Frontend

This document explains the roles of Rox's backend and frontend, their technology stacks, and what each can accomplish.

## Overall Structure

Rox is a monorepo consisting of three packages:

```
rox/
├── packages/
│   ├── backend/   # Hono Rox (API server)
│   ├── frontend/  # Waku Rox (web client)
│   └── shared/    # Common types and utilities
└── plugins/       # Plugin directory
```

| Package | Runtime | Technology Stack |
|---------|---------|------------------|
| backend | Server (Bun) | Hono, Drizzle ORM, BullMQ |
| frontend | Browser (React) | Waku, React Aria, Tailwind CSS |
| shared | Both | TypeScript type definitions |

## Backend (packages/backend)

The backend runs on the server side and handles Rox's core logic.

### Technology Stack

| Technology | Purpose |
|-----------|---------|
| **Bun** | JavaScript runtime |
| **Hono** | Web framework |
| **Drizzle ORM** | Database access |
| **BullMQ + Dragonfly** | Job queue |
| **pino** | Logging |

### Main Responsibilities

```
┌─────────────────────────────────────────────────────────┐
│                       Backend                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ API Routes  │  │ ActivityPub │  │    Plugin       │  │
│  │ /api/*      │  │ Federation  │  │    System       │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ Repository  │  │   Storage   │  │   Job Queue    │  │
│  │ Pattern     │  │   Adapter   │  │   (BullMQ)     │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐                       │
│  │  Database   │  │   Auth      │                       │
│  │ PostgreSQL  │  │ Passkey/PW  │                       │
│  └─────────────┘  └─────────────┘                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 1. API Endpoints

Provides Misskey-compatible API and Rox-specific API.

```typescript
// Route definition with Hono
app.post("/api/notes/create", async (c) => {
  const { text, visibility } = await c.req.json();
  const note = await noteRepository.create({ text, visibility });
  return c.json(note);
});
```

**Example Endpoints:**
- `/api/notes/*` - Note operations
- `/api/users/*` - User operations
- `/api/drive/*` - File operations
- `/api/x/{pluginId}/*` - Plugin API

#### 2. ActivityPub Federation

Handles federation with other servers.

- **Receive**: Receive Activity via `POST /inbox`
- **Send**: Deliver Activity to other servers
- **WebFinger**: Resolve accounts via `/.well-known/webfinger`

#### 3. Database Operations

Abstracts database access using the repository pattern.

```typescript
// Interface
interface INoteRepository {
  create(data: CreateNoteInput): Promise<Note>;
  findById(id: string): Promise<Note | null>;
  delete(id: string): Promise<void>;
}

// Implementation (PostgreSQL)
class PgNoteRepository implements INoteRepository {
  async create(data) {
    return await db.insert(notes).values(data).returning();
  }
}
```

**Supported Databases:**
- PostgreSQL (recommended)
- MySQL
- SQLite

#### 4. Storage Adapters

Abstracts file storage destinations.

```typescript
interface IStorageAdapter {
  upload(file: File): Promise<string>;
  delete(key: string): Promise<void>;
  getUrl(key: string): string;
}
```

**Supported Storage:**
- Local filesystem
- S3-compatible storage (AWS S3, Cloudflare R2, MinIO)

#### 5. Plugin System

What backend plugins can do:

| Feature | Description |
|---------|-------------|
| Event hooks | Intercept note creation, user registration, etc. |
| Custom API | Add endpoints under `/api/x/{plugin-id}/` |
| Data processing | Modify or cancel data with before events |
| Scheduled tasks | Register periodic tasks |
| Config storage | Persist plugin-specific settings |

```typescript
// Backend plugin example
const plugin: RoxPlugin = {
  id: "my-plugin",
  
  onLoad({ events, logger }) {
    events.on("note:afterCreate", ({ note }) => {
      logger.info({ noteId: note.id }, "Note created");
    });
  },

  routes(app) {
    app.get("/status", (c) => c.json({ ok: true }));
  },
};
```

## Frontend (packages/frontend)

The frontend runs in the browser and handles the user interface.

### Technology Stack

| Technology | Purpose |
|-----------|---------|
| **Waku** | React Server Components framework |
| **React** | UI library |
| **React Aria Components** | Accessible UI components |
| **Tailwind CSS v4** | Styling |
| **Jotai** | State management |
| **Lingui** | Internationalization (i18n) |

### Main Responsibilities

```
┌─────────────────────────────────────────────────────────┐
│                       Frontend                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   Pages     │  │ Components  │  │     Hooks       │  │
│  │  (Routes)   │  │    (UI)     │  │   (Logic)       │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   State     │  │    i18n     │  │    Styling      │  │
│  │  (Jotai)    │  │  (Lingui)   │  │  (Tailwind)     │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐                       │
│  │   Auth      │  │  API Client │                       │
│  │ (Passkey)   │  │  (fetch)    │                       │
│  └─────────────┘  └─────────────┘                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 1. Pages and Routing

Define pages using Waku's file-based routing.

```
src/pages/
├── index.tsx           # /
├── notes/
│   ├── index.tsx       # /notes
│   └── [id].tsx        # /notes/:id
└── settings/
    └── index.tsx       # /settings
```

#### 2. UI Components

Build accessible components with React Aria Components.

```tsx
import { Button, Dialog, Modal } from "react-aria-components";

function ComposeDialog() {
  return (
    <Modal>
      <Dialog>
        <Heading>New Note</Heading>
        <TextField label="Content" />
        <Button>Post</Button>
      </Dialog>
    </Modal>
  );
}
```

#### 3. State Management

Manage global state with Jotai.

```tsx
import { atom, useAtom } from "jotai";

const userAtom = atom<User | null>(null);
const themeAtom = atom<"light" | "dark">("light");

function Header() {
  const [user] = useAtom(userAtom);
  return <div>{user?.name}</div>;
}
```

#### 4. Internationalization

Multi-language support with Lingui.

```tsx
import { Trans } from "@lingui/macro";

function Welcome() {
  return <h1><Trans>Welcome to Rox!</Trans></h1>;
}
```

**Supported Languages:**
- Japanese (ja)
- English (en)

#### 5. Frontend Plugins

What frontend plugins can do:

| Feature | Description |
|---------|-------------|
| Settings UI | Add plugin settings components to admin panel |
| Note footer | Add custom display below notes |
| Style extensions | Inject custom CSS |

```tsx
// Frontend plugin example
export function PluginSettings({ pluginId }) {
  return (
    <div>
      <h3>Plugin Settings</h3>
      <p>ID: {pluginId}</p>
    </div>
  );
}
```

## Shared Package (packages/shared)

Type definitions and utilities shared between backend and frontend.

```typescript
// packages/shared/src/types/note.ts
export interface Note {
  id: string;
  text: string;
  userId: string;
  visibility: "public" | "home" | "followers" | "specified";
  createdAt: Date;
}

// packages/shared/src/types/plugin.ts
export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  permissions?: PluginPermission[];
}
```

## Data Flow

```
┌─────────────────┐                    ┌──────────────────┐
│    Frontend     │     HTTP API      │     Backend      │
│    (Browser)    │ ◄────────────────► │     (Server)     │
└────────┬────────┘                    └────────┬─────────┘
         │                                      │
         │ fetch("/api/notes/create")           │
         │ ─────────────────────────────────►   │
         │                                      ▼
         │                             ┌────────────────┐
         │                             │  Event Bus     │
         │                             │ beforeCreate   │
         │                             └───────┬────────┘
         │                                     │
         │                                     ▼
         │                             ┌────────────────┐
         │                             │  Repository    │
         │                             │  DB Insert     │
         │                             └───────┬────────┘
         │                                     │
         │                                     ▼
         │                             ┌────────────────┐
         │                             │  Event Bus     │
         │                             │ afterCreate    │
         │                             └───────┬────────┘
         │                                     │
         │ ◄───────────────────────────────────┘
         │        JSON Response
         ▼
┌─────────────────┐
│  State Update   │
│  UI Re-render   │
└─────────────────┘
```

## Role Distribution by Feature

| Feature | Backend | Frontend |
|---------|---------|----------|
| Note creation | Validation, DB save, federation delivery | Form UI, preview |
| Authentication | Session management, Passkey verification | Login UI, biometric authentication |
| File management | Upload, storage | File picker UI, preview |
| Search | Full-text search, filtering | Search UI, result display |
| Notifications | Notification generation, delivery | Notification list UI, real-time updates |
| Settings | Settings storage, validation | Settings form UI |
| Plugins | Event hooks, API provision | Settings UI, display extensions |

## Development Considerations

### When to Modify Backend

- Adding or changing API endpoints
- Changing database schema
- Modifying ActivityPub federation logic
- Modifying authentication/authorization logic
- Adding plugin events

### When to Modify Frontend

- UI/UX changes
- Adding new pages
- Adding or modifying components
- Adding internationalization
- Improving accessibility

### When to Modify Both

- Adding new features (API + UI)
- Adding new data models
- Extending the plugin system

## Related Documentation

- [Architecture](architecture) - Design pattern details
- [Plugin Getting Started](plugin-getting-started) - Plugin introductory guide
- [Plugin Architecture](plugin-architecture) - Plugin system details
- [API Reference](api-overview) - API specifications
