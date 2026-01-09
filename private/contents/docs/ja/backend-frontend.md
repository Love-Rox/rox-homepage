---
title: バックエンドとフロントエンド
description: Roxのバックエンドとフロントエンドの役割分担と技術スタックの解説
date: 2026-01-10
author: Roxチーム
tags: [アーキテクチャ, バックエンド, フロントエンド, 開発]
---

# バックエンドとフロントエンド

このドキュメントでは、Roxのバックエンドとフロントエンドの役割分担、技術スタック、そしてそれぞれで実現できることを説明します。

## 全体構成

Roxはモノレポ構成で、3つのパッケージで構成されています：

```
rox/
├── packages/
│   ├── backend/   # Hono Rox (APIサーバー)
│   ├── frontend/  # Waku Rox (Webクライアント)
│   └── shared/    # 共通型とユーティリティ
└── plugins/       # プラグインディレクトリ
```

| パッケージ | 実行環境 | 技術スタック |
|-----------|---------|-------------|
| backend | サーバー (Bun) | Hono, Drizzle ORM, BullMQ |
| frontend | ブラウザ (React) | Waku, React Aria, Tailwind CSS |
| shared | 両方 | TypeScript型定義 |

## バックエンド (packages/backend)

バックエンドはサーバーサイドで実行され、Roxのコアロジックを担当します。

### 技術スタック

| 技術 | 用途 |
|-----|------|
| **Bun** | JavaScriptランタイム |
| **Hono** | Webフレームワーク |
| **Drizzle ORM** | データベースアクセス |
| **BullMQ + Dragonfly** | ジョブキュー |
| **pino** | ログ出力 |

### 主な責務

```
┌─────────────────────────────────────────────────────────┐
│                    バックエンド                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ API Routes  │  │ ActivityPub │  │   プラグイン     │  │
│  │ /api/*      │  │ Federation  │  │   システム       │  │
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

#### 1. API エンドポイント

Misskey互換APIとRox独自APIを提供します。

```typescript
// Honoによるルート定義
app.post("/api/notes/create", async (c) => {
  const { text, visibility } = await c.req.json();
  const note = await noteRepository.create({ text, visibility });
  return c.json(note);
});
```

**エンドポイント例:**
- `/api/notes/*` - ノート操作
- `/api/users/*` - ユーザー操作
- `/api/drive/*` - ファイル操作
- `/api/x/{pluginId}/*` - プラグインAPI

#### 2. ActivityPub連合

他のサーバーとの連合処理を担当します。

- **受信**: `POST /inbox` でActivityを受信
- **送信**: 他サーバーへActivityを配送
- **WebFinger**: `/.well-known/webfinger` でアカウント解決

#### 3. データベース操作

リポジトリパターンでデータベースアクセスを抽象化。

```typescript
// インターフェース
interface INoteRepository {
  create(data: CreateNoteInput): Promise<Note>;
  findById(id: string): Promise<Note | null>;
  delete(id: string): Promise<void>;
}

// 実装（PostgreSQL用）
class PgNoteRepository implements INoteRepository {
  async create(data) {
    return await db.insert(notes).values(data).returning();
  }
}
```

**対応データベース:**
- PostgreSQL（推奨）
- MySQL
- SQLite

#### 4. ストレージアダプター

ファイル保存先を抽象化。

```typescript
interface IStorageAdapter {
  upload(file: File): Promise<string>;
  delete(key: string): Promise<void>;
  getUrl(key: string): string;
}
```

**対応ストレージ:**
- ローカルファイルシステム
- S3互換ストレージ（AWS S3, Cloudflare R2, MinIO）

#### 5. プラグインシステム

バックエンドプラグインができること：

| 機能 | 説明 |
|-----|------|
| イベントフック | ノート作成、ユーザー登録などをインターセプト |
| カスタムAPI | `/api/x/{plugin-id}/` 配下にエンドポイント追加 |
| データ処理 | beforeイベントでデータ変更・キャンセル |
| スケジュールタスク | 定期実行タスク登録 |
| 設定ストレージ | プラグイン固有設定の永続化 |

```typescript
// バックエンドプラグイン例
const plugin: RoxPlugin = {
  id: "my-plugin",
  
  onLoad({ events, logger }) {
    events.on("note:afterCreate", ({ note }) => {
      logger.info({ noteId: note.id }, "ノート作成");
    });
  },

  routes(app) {
    app.get("/status", (c) => c.json({ ok: true }));
  },
};
```

## フロントエンド (packages/frontend)

フロントエンドはブラウザで実行され、ユーザーインターフェースを担当します。

### 技術スタック

| 技術 | 用途 |
|-----|------|
| **Waku** | React Server Components フレームワーク |
| **React** | UIライブラリ |
| **React Aria Components** | アクセシブルUIコンポーネント |
| **Tailwind CSS v4** | スタイリング |
| **Jotai** | 状態管理 |
| **Lingui** | 国際化 (i18n) |

### 主な責務

```
┌─────────────────────────────────────────────────────────┐
│                    フロントエンド                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   Pages     │  │ Components  │  │    Hooks        │  │
│  │  (Routes)   │  │   (UI)      │  │  (ロジック)      │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   State     │  │   i18n      │  │   Styling       │  │
│  │  (Jotai)    │  │  (Lingui)   │  │ (Tailwind)      │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐                       │
│  │   Auth      │  │  API Client │                       │
│  │ (Passkey)   │  │  (fetch)    │                       │
│  └─────────────┘  └─────────────┘                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### 1. ページとルーティング

Wakuのファイルベースルーティングでページを定義。

```
src/pages/
├── index.tsx           # /
├── notes/
│   ├── index.tsx       # /notes
│   └── [id].tsx        # /notes/:id
└── settings/
    └── index.tsx       # /settings
```

#### 2. UIコンポーネント

React Aria Componentsでアクセシブルなコンポーネントを構築。

```tsx
import { Button, Dialog, Modal } from "react-aria-components";

function ComposeDialog() {
  return (
    <Modal>
      <Dialog>
        <Heading>新しいノート</Heading>
        <TextField label="内容" />
        <Button>投稿</Button>
      </Dialog>
    </Modal>
  );
}
```

#### 3. 状態管理

Jotaiでグローバル状態を管理。

```tsx
import { atom, useAtom } from "jotai";

const userAtom = atom<User | null>(null);
const themeAtom = atom<"light" | "dark">("light");

function Header() {
  const [user] = useAtom(userAtom);
  return <div>{user?.name}</div>;
}
```

#### 4. 国際化

Linguiで多言語対応。

```tsx
import { Trans } from "@lingui/macro";

function Welcome() {
  return <h1><Trans>ようこそ、Roxへ！</Trans></h1>;
}
```

**対応言語:**
- 日本語 (ja)
- 英語 (en)

#### 5. フロントエンドプラグイン

フロントエンドプラグインができること：

| 機能 | 説明 |
|-----|------|
| 設定UI | 管理画面にプラグイン設定コンポーネント追加 |
| ノートフッター | ノート下部にカスタム表示追加 |
| スタイル拡張 | カスタムCSS注入 |

```tsx
// フロントエンドプラグイン例
export function PluginSettings({ pluginId }) {
  return (
    <div>
      <h3>プラグイン設定</h3>
      <p>ID: {pluginId}</p>
    </div>
  );
}
```

## 共通パッケージ (packages/shared)

バックエンドとフロントエンドで共有される型定義とユーティリティ。

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

## データフロー

```
┌─────────────────┐                    ┌──────────────────┐
│   フロントエンド  │     HTTP API      │    バックエンド    │
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
│   状態更新       │
│   UI再レンダリング│
└─────────────────┘
```

## 機能別の役割分担

| 機能 | バックエンド | フロントエンド |
|-----|------------|--------------|
| ノート作成 | バリデーション、DB保存、連合配送 | フォームUI、プレビュー |
| 認証 | セッション管理、Passkey検証 | ログインUI、生体認証連携 |
| ファイル管理 | アップロード、ストレージ保存 | ファイル選択UI、プレビュー |
| 検索 | 全文検索、フィルタリング | 検索UI、結果表示 |
| 通知 | 通知生成、配信 | 通知一覧UI、リアルタイム更新 |
| 設定 | 設定保存、検証 | 設定フォームUI |
| プラグイン | イベントフック、API提供 | 設定UI、表示拡張 |

## 開発時の考慮事項

### バックエンドを修正すべき場合

- APIエンドポイントの追加・変更
- データベーススキーマの変更
- ActivityPub連合ロジックの変更
- 認証・認可ロジックの変更
- プラグインイベントの追加

### フロントエンドを修正すべき場合

- UI/UXの変更
- 新しいページの追加
- コンポーネントの追加・変更
- 多言語対応の追加
- アクセシビリティの改善

### 両方を修正すべき場合

- 新機能の追加（API + UI）
- 新しいデータモデルの追加
- プラグインシステムの拡張

## 関連ドキュメント

- [アーキテクチャ](architecture) - 設計パターンの詳細
- [プラグイン開発入門](plugin-getting-started) - プラグイン入門ガイド
- [プラグインアーキテクチャ](plugin-architecture) - プラグインシステムの詳細
- [APIリファレンス](api-overview) - API仕様
