---
title: アーキテクチャガイド
description: Roxのアーキテクチャと設計パターンを理解する
date: 2025-01-01
author: Roxチーム
tags: [アーキテクチャ, 設計パターン, リポジトリパターン, アダプターパターン]
---

# アーキテクチャガイド

Roxは保守性、テスト可能性、柔軟性を確保するために実証済みの設計パターンで構築されています。

## コア設計パターン

### リポジトリパターン

リポジトリパターンはインターフェースを通じてデータベース操作を抽象化し、ビジネスロジックをデータアクセス実装から分離します。

#### メリット
- **テスト可能性**: ユニットテストのためにリポジトリを簡単にモック化
- **柔軟性**: ビジネスロジックを変更せずにデータベース実装を切り替え
- **保守性**: 関心事の明確な分離

#### 主要なリポジトリ

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
```

### アダプターパターン

アダプターパターンは異なるストレージバックエンドに対して一貫したインターフェースを提供します。

```typescript
interface IStorageAdapter {
  upload(file: Buffer, key: string): Promise<string>;
  download(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  getUrl(key: string): string;
}
```

### 依存性注入

RoxはHonoのコンテキストを使用して、環境変数に基づいて依存関係を注入します。

```typescript
app.use('*', async (c, next) => {
  const db = createDatabase(c.env.DB_TYPE);
  c.set('db', db);
  
  const noteRepository = new DrizzleNoteRepository(db);
  c.set('noteRepository', noteRepository);
  
  await next();
});
```

## プロジェクト構造

```
packages/
├── backend/
│   ├── src/
│   │   ├── adapters/        # ストレージアダプター
│   │   ├── repositories/    # データベースリポジトリ
│   │   ├── services/        # ビジネスロジック
│   │   ├── routes/          # APIルート
│   │   └── middleware/      # ミドルウェア
│   └── tests/               # テスト
├── frontend/
│   ├── src/
│   │   ├── components/      # Reactコンポーネント
│   │   ├── pages/           # Wakuページ
│   │   └── atoms/           # Jotai atoms
│   └── public/              # 静的アセット
└── shared/
    └── types/               # 共有TypeScript型
```

## データベース層

### Drizzle ORM

Roxは型安全なデータベース操作のためにDrizzle ORMを使用しています。

```typescript
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  displayName: text('display_name'),
  createdAt: timestamp('created_at').defaultNow(),
});
```

### マイグレーション

```bash
# マイグレーション生成
bun run db:generate

# マイグレーション実行
bun run db:migrate

# Drizzle Studioを開く
bun run db:studio
```

## API層

### Honoフレームワーク

Roxは軽量で高速なAPIサーバーのためにHonoを使用しています。

```typescript
app.get('/api/notes/:id', async (c) => {
  const noteRepository = c.get('noteRepository');
  const note = await noteRepository.findById(c.req.param('id'));
  
  if (!note) {
    return c.json({ error: 'Not found' }, 404);
  }
  
  return c.json(note);
});
```

## フロントエンドアーキテクチャ

### Waku (React Server Components)

RoxフロントエンドはサーバーサイドレンダリングとReact Server ComponentsのためにWakuを使用しています。

```tsx
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

### 状態管理 (Jotai)

```typescript
export const currentUserAtom = atom<User | null>(null);

// コンポーネントでの使用
const [user, setUser] = useAtom(currentUserAtom);
```

## パフォーマンス考慮事項

### キャッシング

RoxはRedis（Dragonfly経由）をキャッシングに使用：

```typescript
const cacheService = new CacheService(redis);
await cacheService.set(`user:${userId}`, user, 3600);
```

### 画像最適化

画像は自動的にWebPに変換されます：

```typescript
const imageProcessor = new ImageProcessor();
const optimized = await imageProcessor.toWebP(buffer);
```

## セキュリティ

### 入力検証

すべての入力はZodを使用して検証されます：

```typescript
const createNoteSchema = z.object({
  text: z.string().min(1).max(3000),
  visibility: z.enum(['public', 'unlisted', 'followers', 'direct']),
});
```

### レート制限

```typescript
app.use('/api/*', rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));
```

## 次のステップ

- [デプロイメントガイド](deployment) - Roxを本番環境にデプロイ
- [APIリファレンス](api-overview) - APIを探索
- [コントリビューション](https://github.com/Love-Rox/rox/blob/main/CONTRIBUTING.md) - Roxに貢献
