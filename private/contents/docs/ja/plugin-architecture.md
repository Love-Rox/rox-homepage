---
title: プラグインアーキテクチャ
description: Roxプラグインシステムの内部アーキテクチャとコンポーネントの詳細
date: 2026-01-09
author: Roxチーム
tags: [プラグイン, アーキテクチャ, EventBus, PluginLoader]
---

# プラグインアーキテクチャ

このドキュメントでは、Roxプラグインシステムの内部アーキテクチャを詳しく説明します。

## コンポーネント概要

Roxプラグインシステムは以下の主要コンポーネントで構成されています：

```
┌─────────────────────────────────────────────────┐
│                  PluginManager                   │
│  (プラグインのインストール/アンインストール管理)  │
└─────────────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│                  PluginLoader                    │
│     (プラグインの読み込み/アンロード/リロード)    │
└─────────────────────────────────────────────────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────────┐
│  EventBus   │ │PermManager  │ │PluginConfig     │
│ (イベント)   │ │ (権限管理)   │ │Storage (設定)   │
└─────────────┘ └─────────────┘ └─────────────────┘
```

## PluginContext

プラグインは `onLoad` コールバックで `PluginContext` を受け取ります。これがプラグインがRoxコアサービスにアクセスするための主要なインターフェースです。

```typescript
interface PluginContext {
  /** イベントの購読用EventBus */
  events: IEventBus;

  /** プラグイン専用のロガー */
  logger: pino.Logger;

  /** プラグイン専用の設定ストレージ */
  config: PluginConfigStorage;

  /** スケジュールタスクの登録 */
  registerScheduledTask(task: ScheduledTask): void;

  /** RoxインスタンスのベースURL */
  baseUrl: string;

  /** 現在のRoxバージョン */
  roxVersion: string;
}
```

### events - EventBus

イベントシステムへのアクセスを提供します。

```typescript
onLoad({ events }) {
  // "after"イベントの購読（通知のみ）
  events.on("note:afterCreate", ({ note }) => {
    console.log("ノートが作成されました:", note.id);
  });

  // "before"イベントの購読（キャンセル/変更可能）
  events.onBefore("note:beforeCreate", (data) => {
    if (data.content.includes("スパム")) {
      return { cancel: true, reason: "スパムを検出しました" };
    }
    return {};
  });
}
```

### logger - ロガー

プラグイン専用の名前空間付きロガーです。

```typescript
onLoad({ logger }) {
  logger.info("プラグインがロードされました");
  logger.warn({ someData: "value" }, "警告メッセージ");
  logger.error({ err: error }, "エラーが発生しました");
}
```

### config - 設定ストレージ

プラグイン固有の設定を永続化するためのストレージです。

```typescript
onLoad({ config }) {
  // 設定値の取得
  const keywords = await config.get<string[]>("keywords") ?? [];

  // 設定値の保存
  await config.set("keywords", ["sensitive", "nsfw"]);

  // 設定値の削除
  await config.delete("keywords");

  // すべての設定を取得
  const allConfig = await config.getAll();
}
```

### registerScheduledTask - スケジュールタスク

定期的に実行するタスクを登録できます。

```typescript
onLoad({ registerScheduledTask, logger }) {
  registerScheduledTask({
    id: "cleanup-task",
    name: "Cleanup Task",
    schedule: "1h", // 1時間ごと
    runOnStartup: true, // 起動時にも実行
    async handler() {
      logger.info("クリーンアップを実行中...");
    },
  });
}
```

スケジュール形式：
- `"30s"` - 30秒ごと
- `"5m"` - 5分ごと
- `"1h"` - 1時間ごと
- `"24h"` - 24時間ごと
- 数値（ミリ秒）- 例: `60000`（1分）

## ライフサイクルフック

### onLoad

プラグインがロードされたときに呼び出されます。イベントの購読、リソースの初期化などを行います。

```typescript
const myPlugin: RoxPlugin = {
  id: "my-plugin",
  name: "My Plugin",
  version: "1.0.0",

  async onLoad(context) {
    // 非同期初期化もサポート
    await initializeDatabase();
    
    context.logger.info("プラグインを初期化しました");
  },
};
```

### onUnload

プラグインがアンロードされるときに呼び出されます。リソースのクリーンアップを行います。

```typescript
const myPlugin: RoxPlugin = {
  // ...

  async onUnload() {
    // 接続のクローズ、リソースの解放など
    await closeConnections();
  },
};
```

> [!NOTE]
> イベント購読は自動的にクリーンアップされます。`onUnload` では、カスタムリソースのクリーンアップのみが必要です。

## カスタムルート

プラグインは独自のAPIルートを登録できます。ルートは `/api/x/{plugin-id}/` 配下に登録されます。

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

    // パラメータ付きルート
    // GET /api/x/my-stats/user/:id
    app.get("/user/:id", (c) => {
      const id = c.req.param("id");
      return c.json({ userId: id });
    });
  },
};
```

ルートは[Hono](https://hono.dev)フレームワークを使用して定義します。

## グローバルミドルウェア

プラグインはグローバルミドルウェアを登録できます。これはすべてのリクエストに対して実行されます。

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
> ミドルウェアはすべてのリクエストで実行されるため、パフォーマンスへの影響を最小限に抑えてください。また、ミドルウェアは一度登録すると、サーバー再起動まで削除できません。

## ホットリロード

開発中は、プラグインのホットリロードがサポートされています。

```bash
# プラグインをリロード
bun run plugin reload <plugin-id>
```

PluginLoaderは以下を処理します：
1. プラグインのアンロード（`onUnload`呼び出し）
2. イベント購読のクリーンアップ
3. モジュールキャッシュのクリア
4. プラグインの再読み込み（`onLoad`呼び出し）

## セキュリティ

### パーミッションシステム

プラグインは必要なパーミッションをマニフェストで宣言する必要があります。パーミッションが宣言されていないプラグインは、制限付きコンテキストで実行されます。

```json
{
  "permissions": ["note:read", "note:write", "user:read"]
}
```

### パーミッション一覧

| パーミッション | 説明 | リスクレベル |
|--------------|------|------------|
| `note:read` | ノートの読み取り | 低 |
| `note:write` | ノートの作成/更新/削除 | 中 |
| `user:read` | ユーザー情報の読み取り | 低 |
| `user:write` | ユーザー情報の更新 | 高 |
| `config:read` | 設定の読み取り | 低 |
| `config:write` | 設定の書き込み | 中 |
| `admin:read` | 管理機能の読み取り | 高 |
| `admin:write` | 管理機能の書き込み | 高 |
| `storage:read` | ストレージの読み取り | 低 |
| `storage:write` | ストレージの書き込み | 中 |

### セキュリティ監査

PluginLoaderにはセキュリティ監査機能が組み込まれており、以下のイベントをログに記録します：

- プラグインのロード/アンロード
- 高リスクパーミッションの使用
- パーミッション違反
- ロード失敗

## 依存関係

プラグインは他のプラグインへの依存を宣言できます。

```json
{
  "dependencies": ["other-plugin", "another-plugin"]
}
```

依存するプラグインがロードされていない場合、プラグインのロードは失敗します。

## 関連ドキュメント

- [プラグイン開発入門](plugin-getting-started) - 入門ガイド
- [プラグインマニフェスト](plugin-manifest) - plugin.json リファレンス
- [プラグインイベント](plugin-events) - イベントシステムの詳細
