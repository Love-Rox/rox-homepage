---
title: プラグインイベント
description: Roxプラグインシステムのイベントシステムとライフサイクルフックの詳細ガイド
date: 2026-01-09
author: Roxチーム
tags: [プラグイン, イベント, EventBus, フック]
---

# プラグインイベント

Roxプラグインシステムは、アプリケーションのライフサイクルイベントにフックするためのイベントシステムを提供します。このドキュメントでは、利用可能なイベントとその使用方法について説明します。

## EventBus概要

EventBusは、プラグインがアプリケーションイベントを購読するためのpub/subメカニズムを提供します。

### イベントの種類

Roxには2種類のイベントがあります：

| 種類 | 説明 | 実行方法 |
|-----|------|---------|
| **before** | 操作の前に発火。キャンセルや変更が可能 | 順次実行 |
| **after** | 操作の後に発火。通知のみ（fire-and-forget） | 並列実行 |

### イベント命名規則

イベント名は `{resource}:{timing}{Action}` の形式に従います：

- `note:beforeCreate` - ノート作成前
- `note:afterCreate` - ノート作成後
- `user:beforeRegister` - ユーザー登録前
- `user:afterRegister` - ユーザー登録後

## "before"イベント

"before"イベントは操作をキャンセルまたは変更できます。ハンドラは順次実行されます。

### 購読方法

```typescript
events.onBefore("note:beforeCreate", (data) => {
  // 処理
  return {};
});
```

### 戻り値オプション

"before"イベントハンドラは以下のいずれかを返す必要があります：

#### 1. 操作を続行（変更なし）

```typescript
events.onBefore("note:beforeCreate", (data) => {
  // 何も変更せず続行
  return {};
});
```

#### 2. 操作をキャンセル

```typescript
events.onBefore("note:beforeCreate", (data) => {
  if (data.content.includes("禁止ワード")) {
    return { 
      cancel: true, 
      reason: "禁止ワードが含まれています" 
    };
  }
  return {};
});
```

#### 3. データを変更

```typescript
events.onBefore("note:beforeCreate", (data) => {
  // コンテンツをサニタイズ
  return { 
    modified: { 
      ...data, 
      content: sanitize(data.content) 
    } 
  };
});
```

### 利用可能な"before"イベント

#### note:beforeCreate

ノートが作成される前に発火します。

```typescript
interface NoteBeforeCreateData {
  /** ノートの内容 */
  content: string;
  /** 作成者のユーザーID */
  userId: string;
  /** コンテンツ警告（オプション） */
  cw?: string | null;
  /** 公開範囲 */
  visibility?: "public" | "home" | "followers" | "specified";
  /** ローカルのみフラグ */
  localOnly?: boolean;
}
```

**使用例: コンテンツフィルタリング**

```typescript
events.onBefore("note:beforeCreate", ({ content, cw }) => {
  const blockedWords = ["スパム", "広告"];
  
  if (blockedWords.some(word => content.includes(word))) {
    return { cancel: true, reason: "禁止ワードが含まれています" };
  }
  
  // コンテンツ警告がある場合はNSFWをつける
  if (content.includes("NSFW") && !cw) {
    return { modified: { content, cw: "閲覧注意" } };
  }
  
  return {};
});
```

#### note:beforeDelete

ノートが削除される前に発火します。

```typescript
interface NoteBeforeDeleteData {
  /** 削除するノートのID */
  noteId: string;
  /** 削除を実行するユーザーID */
  userId: string;
}
```

**使用例: 削除の制限**

```typescript
events.onBefore("note:beforeDelete", async ({ noteId, userId }) => {
  const protectedNotes = await config.get<string[]>("protectedNotes") ?? [];
  
  if (protectedNotes.includes(noteId)) {
    return { cancel: true, reason: "このノートは保護されています" };
  }
  
  return {};
});
```

#### user:beforeRegister

ユーザーが登録される前に発火します。

```typescript
interface UserBeforeRegisterData {
  /** ユーザー名 */
  username: string;
  /** メールアドレス（オプション） */
  email?: string | null;
}
```

**使用例: ユーザー名検証**

```typescript
events.onBefore("user:beforeRegister", ({ username }) => {
  const reservedNames = ["admin", "root", "system"];
  
  if (reservedNames.includes(username.toLowerCase())) {
    return { cancel: true, reason: "このユーザー名は予約されています" };
  }
  
  return {};
});
```

## "after"イベント

"after"イベントは通知のみで、操作をキャンセルすることはできません。ハンドラは並列で実行されます。

### 購読方法

```typescript
events.on("note:afterCreate", ({ note }) => {
  // 処理
});
```

### 利用可能な"after"イベント

#### note:afterCreate

ノートが正常に作成された後に発火します。

```typescript
interface NoteAfterCreateData {
  /** 作成されたノート */
  note: Note;
}
```

**使用例: アクティビティログ**

```typescript
events.on("note:afterCreate", ({ note }) => {
  logger.info({ 
    noteId: note.id, 
    userId: note.userId,
    visibility: note.visibility 
  }, "新しいノートが作成されました");
});
```

#### note:afterDelete

ノートが正常に削除された後に発火します。

```typescript
interface NoteAfterDeleteData {
  /** 削除されたノートのID */
  noteId: string;
  /** 削除を実行したユーザーID */
  userId: string;
}
```

**使用例: 削除ログ**

```typescript
events.on("note:afterDelete", ({ noteId, userId }) => {
  logger.info({ noteId, userId }, "ノートが削除されました");
});
```

#### user:afterRegister

ユーザーが正常に登録された後に発火します。

```typescript
interface UserAfterRegisterData {
  /** 登録されたユーザーID */
  userId: string;
  /** ユーザー名 */
  username: string;
}
```

**使用例: ウェルカムメッセージ**

```typescript
events.on("user:afterRegister", async ({ userId, username }) => {
  logger.info({ userId, username }, "新規ユーザーが登録されました");
  
  // ウェルカムメッセージの送信など
  await sendWelcomeNotification(userId);
});
```

## 購読解除

`events.on` と `events.onBefore` はどちらも購読解除関数を返します。

```typescript
onLoad({ events }) {
  const unsubscribe = events.on("note:afterCreate", ({ note }) => {
    console.log("ノート作成:", note.id);
  });
  
  // 必要に応じて購読解除
  unsubscribe();
}
```

> [!NOTE]
> プラグインがアンロードされると、そのプラグインのイベント購読は自動的にクリーンアップされます。

## エラーハンドリング

### "after"イベント

"after"イベントのハンドラでエラーが発生しても、他のハンドラには影響しません。エラーはログに記録されますが、スローされません。

```typescript
events.on("note:afterCreate", ({ note }) => {
  throw new Error("Something went wrong"); // 他のハンドラには影響しない
});
```

### "before"イベント

"before"イベントのハンドラでエラーが発生すると、そのエラーが伝播し、後続のハンドラは実行されません。

```typescript
events.onBefore("note:beforeCreate", (data) => {
  throw new Error("Validation failed"); // 操作が中断される
});
```

## 実践例

### コンテンツモデレーションプラグイン

```typescript
import type { RoxPlugin } from "@rox/backend/plugins";

const moderationPlugin: RoxPlugin = {
  id: "moderation",
  name: "Content Moderation",
  version: "1.0.0",

  async onLoad({ events, config, logger }) {
    const blockedWords = await config.get<string[]>("blockedWords") ?? [];
    const blockedPatterns = await config.get<string[]>("blockedPatterns") ?? [];

    // コンテンツフィルタリング
    events.onBefore("note:beforeCreate", ({ content }) => {
      // 禁止ワードチェック
      for (const word of blockedWords) {
        if (content.toLowerCase().includes(word.toLowerCase())) {
          logger.warn({ word }, "禁止ワードを検出");
          return { cancel: true, reason: `禁止ワード "${word}" が含まれています` };
        }
      }

      // パターンマッチング
      for (const pattern of blockedPatterns) {
        if (new RegExp(pattern, "i").test(content)) {
          logger.warn({ pattern }, "禁止パターンを検出");
          return { cancel: true, reason: "禁止されたパターンが含まれています" };
        }
      }

      return {};
    });

    // モデレーションログ
    events.on("note:afterCreate", ({ note }) => {
      logger.debug({ noteId: note.id }, "ノートがモデレーションを通過");
    });
  },
};

export default moderationPlugin;
```

### 分析プラグイン

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
      }, "ノート作成統計");
    });

    events.on("note:afterDelete", ({ noteId }) => {
      noteCount--;
      logger.info({ total: noteCount, noteId }, "ノート削除統計");
    });

    events.on("user:afterRegister", ({ userId, username }) => {
      userCount++;
      logger.info({ 
        total: userCount, 
        userId, 
        username 
      }, "ユーザー登録統計");
    });
  },
};

export default analyticsPlugin;
```

## イベント一覧

| イベント | 種類 | 説明 |
|---------|-----|------|
| `note:beforeCreate` | before | ノート作成前 |
| `note:afterCreate` | after | ノート作成後 |
| `note:beforeDelete` | before | ノート削除前 |
| `note:afterDelete` | after | ノート削除後 |
| `user:beforeRegister` | before | ユーザー登録前 |
| `user:afterRegister` | after | ユーザー登録後 |

## 関連ドキュメント

- [プラグイン開発入門](plugin-getting-started) - 入門ガイド
- [プラグインアーキテクチャ](plugin-architecture) - アーキテクチャの詳細
- [プラグインマニフェスト](plugin-manifest) - plugin.json リファレンス
