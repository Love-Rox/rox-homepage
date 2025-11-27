---
title: Architecture Guide
description: Understanding Rox's architecture and design patterns
date: 2025-01-01
author: Rox Team
tags: [architecture, design-patterns, repository-pattern, adapter-pattern]
---

# Architecture Guide

Rox is built with proven design patterns to ensure maintainability, testability, and flexibility.

## Core Design Patterns

### Repository Pattern

The Repository Pattern abstracts database operations through interfaces, decoupling business logic from data access implementation.

#### Benefits
- **Testability**: Easy to mock repositories for unit testing
- **Flexibility**: Switch database implementations without changing business logic
- **Maintainability**: Clear separation of concerns

#### Key Repositories

```typescript
interface INoteRepository {
  create(note: Note): Promise<Note>;
  findById(id: string): Promise<Note | null>;
  findByUserId(userId: string): Promise<Note[]>;
  update(id: string, note: Partial<Note>): Promise<Note>;
  delete(id: string): Promise<void>;
}

interface IUserRepository {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  update(id: string, user: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}

interface IFileRepository {
  create(file: File): Promise<File>;
  findById(id: string): Promise<File | null>;
  delete(id: string): Promise<void>;
}
```

#### Implementation

Repositories are implemented using Drizzle ORM:

```typescript
export class DrizzleNoteRepository implements INoteRepository {
  constructor(private db: DrizzleDatabase) {}

  async create(note: Note): Promise<Note> {
    const [created] = await this.db
      .insert(notes)
      .values(note)
      .returning();
    return created;
  }

  // ... other methods
}
```

### Adapter Pattern

The Adapter Pattern provides a consistent interface for different storage backends.

#### Storage Adapters

```typescript
interface IStorageAdapter {
  upload(file: Buffer, key: string): Promise<string>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  getUrl(key: string): string;
}
```

#### Local Storage Adapter

```typescript
export class LocalStorageAdapter implements IStorageAdapter {
  constructor(private basePath: string) {}

  async upload(file: Buffer, key: string): Promise<string> {
    const filePath = path.join(this.basePath, key);
    await fs.writeFile(filePath, file);
    return key;
  }

  getUrl(key: string): string {
    return `/uploads/${key}`;
  }

  // ... other methods
}
```

#### S3 Storage Adapter

```typescript
export class S3StorageAdapter implements IStorageAdapter {
  constructor(
    private s3Client: S3Client,
    private bucketName: string
  ) {}

  async upload(file: Buffer, key: string): Promise<string> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file,
      })
    );
    return key;
  }

  getUrl(key: string): string {
    return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
  }

  // ... other methods
}
```

### Dependency Injection

Rox uses Hono's context to inject dependencies based on environment variables.

#### Configuration

```typescript
// Setup in middleware
app.use('*', async (c, next) => {
  // Database
  const db = createDatabase(c.env.DB_TYPE);
  c.set('db', db);

  // Repositories
  c.set('noteRepository', new DrizzleNoteRepository(db));
  c.set('userRepository', new DrizzleUserRepository(db));

  // Storage
  const storage = createStorageAdapter(c.env.STORAGE_TYPE);
  c.set('storage', storage);

  await next();
});
```

#### Usage in Routes

```typescript
app.post('/api/notes', async (c) => {
  const noteRepository = c.get('noteRepository');
  const note = await noteRepository.create(data);
  return c.json(note);
});
```

## Project Structure

```
packages/
├── backend/
│   ├── src/
│   │   ├── adapters/        # Storage adapters
│   │   ├── repositories/    # Database repositories
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Middleware
│   │   ├── types/           # TypeScript types
│   │   └── index.ts         # Entry point
│   ├── drizzle/             # Database migrations
│   └── tests/               # Tests
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Waku pages
│   │   ├── lib/             # Utilities
│   │   ├── atoms/           # Jotai atoms
│   │   └── styles/          # Global styles
│   └── public/              # Static assets
└── shared/
    ├── types/               # Shared TypeScript types
    └── utils/               # Shared utilities
```

## Database Layer

### Drizzle ORM

Rox uses Drizzle ORM for type-safe database operations.

#### Schema Definition

```typescript
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  displayName: text('display_name'),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notes = pgTable('notes', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  text: text('text'),
  visibility: text('visibility'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

#### Migrations

```bash
# Generate migration
bun run db:generate

# Run migration
bun run db:migrate

# Open Drizzle Studio
bun run db:studio
```

### Multi-Database Support

Rox supports multiple databases through Drizzle's database adapters:

- **PostgreSQL**: `drizzle-orm/postgres-js`
- **MySQL**: `drizzle-orm/mysql2`
- **SQLite**: `drizzle-orm/better-sqlite3`
- **Cloudflare D1**: `drizzle-orm/d1`

## API Layer

### Hono Framework

Rox uses Hono for its lightweight and fast API server.

#### Route Definition

```typescript
const app = new Hono();

app.get('/api/notes/:id', async (c) => {
  const noteRepository = c.get('noteRepository');
  const note = await noteRepository.findById(c.req.param('id'));
  
  if (!note) {
    return c.json({ error: 'Not found' }, 404);
  }
  
  return c.json(note);
});
```

#### Middleware

```typescript
// Authentication middleware
const requireAuth = async (c, next) => {
  const token = c.req.header('Authorization');
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  
  const user = await verifyToken(token);
  c.set('user', user);
  await next();
};

app.use('/api/notes/*', requireAuth);
```

## Frontend Architecture

### Waku (React Server Components)

Rox frontend uses Waku for server-side rendering and React Server Components.

#### Page Structure

```tsx
// Server Component
export default async function NotePage({ id }: { id: string }) {
  const note = await fetchNote(id);
  
  return (
    <div>
      <NoteContent note={note} />
      <NoteActions noteId={id} />
    </div>
  );
}
```

### State Management (Jotai)

```typescript
// atoms/user.ts
export const currentUserAtom = atom<User | null>(null);

// Usage in component
const [user, setUser] = useAtom(currentUserAtom);
```

### React Aria Components

Accessible UI components without styling:

```tsx
import { Button } from 'react-aria-components';

<Button onPress={() => handleSubmit()}>
  Submit
</Button>
```

## Testing Strategy

### Unit Tests

```typescript
describe('NoteRepository', () => {
  it('should create a note', async () => {
    const repo = new DrizzleNoteRepository(mockDb);
    const note = await repo.create({
      text: 'Hello, world!',
      userId: 'user1',
    });
    
    expect(note.text).toBe('Hello, world!');
  });
});
```

### Integration Tests

```typescript
describe('POST /api/notes', () => {
  it('should create a note', async () => {
    const res = await app.request('/api/notes', {
      method: 'POST',
      body: JSON.stringify({ text: 'Hello!' }),
      headers: { 'Content-Type': 'application/json' },
    });
    
    expect(res.status).toBe(201);
  });
});
```

## Performance Considerations

### Caching

Rox uses Redis (via Dragonfly) for caching:

```typescript
const cacheService = new CacheService(redis);

// Cache user profiles
await cacheService.set(`user:${userId}`, user, 3600);
const cachedUser = await cacheService.get(`user:${userId}`);
```

### Image Optimization

Images are automatically converted to WebP:

```typescript
const imageProcessor = new ImageProcessor();
const optimized = await imageProcessor.toWebP(buffer);
```

### Queue System

Background jobs use BullMQ with Dragonfly:

```typescript
const deliveryQueue = new Queue('delivery', {
  connection: dragonfly,
});

await deliveryQueue.add('deliver-activity', {
  activityId: '123',
  inboxUrl: 'https://example.com/inbox',
});
```

## Security

### Input Validation

All inputs are validated using Zod:

```typescript
const createNoteSchema = z.object({
  text: z.string().min(1).max(3000),
  visibility: z.enum(['public', 'unlisted', 'followers', 'direct']),
});

const data = createNoteSchema.parse(req.body);
```

### Rate Limiting

```typescript
app.use('/api/*', rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
}));
```

## Next Steps

- [Deployment Guide](deployment) - Deploy Rox to production
- [API Reference](api-overview) - Explore the API
- [Contributing](https://github.com/Love-Rox/rox/blob/main/CONTRIBUTING.md) - Contribute to Rox
