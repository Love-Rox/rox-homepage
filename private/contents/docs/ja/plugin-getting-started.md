---
title: プラグイン開発入門
description: Roxプラグインシステムの入門ガイド。初めてのプラグインを作成しましょう。
date: 2026-01-09
author: Roxチーム
tags: [プラグイン, 開発, チュートリアル]
---

# プラグイン開発入門

Roxプラグインシステムを使用すると、サーバーの機能を拡張できます。このガイドでは、初めてのプラグインを作成する方法を説明します。

## プラグインシステムの概要

Roxのプラグインシステムは以下の機能を提供します：

- **ライフサイクルイベントへのフック**: ノート作成、ユーザー登録などのイベントをインターセプト
- **カスタムAPIルート**: プラグイン独自のAPIエンドポイントを追加
- **設定ストレージ**: プラグイン固有の設定を永続化
- **スケジュールタスク**: 定期的に実行するタスクを登録

## クイックスタート

### 1. プラグインディレクトリの作成

プラグインは `./plugins` ディレクトリ配下に配置します：

```bash
mkdir -p plugins/my-first-plugin
cd plugins/my-first-plugin
```

### 2. マニフェストファイルの作成

`plugin.json` を作成してプラグインのメタデータを定義します：

```json
{
  "id": "my-first-plugin",
  "name": "My First Plugin",
  "version": "1.0.0",
  "description": "初めてのRoxプラグイン",
  "author": "あなたの名前",
  "license": "MIT",
  "minRoxVersion": "2026.1.0",
  "permissions": ["note:read"],
  "backend": "index.ts"
}
```

### 3. プラグインコードの作成

`index.ts` を作成します：

```typescript
import type { RoxPlugin } from "@rox/backend/plugins";

const myPlugin: RoxPlugin = {
  id: "my-first-plugin",
  name: "My First Plugin",
  version: "1.0.0",
  description: "初めてのRoxプラグイン",

  onLoad({ events, logger }) {
    logger.info("My First Plugin がロードされました！");

    // ノート作成後のイベントを購読
    events.on("note:afterCreate", ({ note }) => {
      logger.info({ noteId: note.id }, "新しいノートが作成されました");
    });
  },

  onUnload() {
    console.log("My First Plugin がアンロードされました");
  },
};

export default myPlugin;
```

### 4. プラグインのインストール

Rox CLIを使用してプラグインをインストールします：

```bash
# ローカルパスからインストール
bun run plugin install ./plugins/my-first-plugin

# GitHubからインストール
bun run plugin install https://github.com/user/my-rox-plugin
```

## プラグインCLI

Roxにはプラグイン管理のためのCLIが組み込まれています：

```bash
# プラグインのインストール
bun run plugin install <source>

# インストール済みプラグインの一覧
bun run plugin list

# プラグインの有効化/無効化
bun run plugin enable <plugin-id>
bun run plugin disable <plugin-id>

# プラグインの詳細情報
bun run plugin info <plugin-id>

# プラグインのアンインストール
bun run plugin uninstall <plugin-id>
```

### インストールオプション

```bash
# 強制インストール（既存を上書き）
bun run plugin install <source> --force

# インストール後に有効化しない
bun run plugin install <source> --no-enable

# アンインストール時にファイルを保持
bun run plugin uninstall <plugin-id> --keep-files
```

## プラグインIDの命名規則

プラグインIDは以下のルールに従う必要があります：

- 小文字の英数字とハイフンのみ使用可能
- 3〜50文字
- 英字で開始
- 英数字で終了

```
✅ 有効な例: my-plugin, content-filter, awesome-mod-1
❌ 無効な例: MyPlugin, my_plugin, 1-plugin, plugin-
```

## 次のステップ

プラグインの基本を理解したら、以下のドキュメントで詳細を学びましょう：

- [プラグインアーキテクチャ](plugin-architecture) - プラグインシステムの内部構造
- [プラグインマニフェスト](plugin-manifest) - plugin.json の完全リファレンス
- [プラグインイベント](plugin-events) - イベントシステムの詳細

## サンプルプラグイン

### アクティビティログプラグイン

```typescript
import type { RoxPlugin } from "@rox/backend/plugins";

const activityLogger: RoxPlugin = {
  id: "activity-logger",
  name: "Activity Logger",
  version: "1.0.0",

  onLoad({ events, logger }) {
    // ノートの作成をログ
    events.on("note:afterCreate", ({ note }) => {
      logger.info({ noteId: note.id }, "Note created");
    });

    // ノートの削除をログ
    events.on("note:afterDelete", ({ noteId }) => {
      logger.info({ noteId }, "Note deleted");
    });

    // ユーザー登録をログ
    events.on("user:afterRegister", ({ userId, username }) => {
      logger.info({ userId, username }, "User registered");
    });
  },
};

export default activityLogger;
```

### コンテンツモデレーションプラグイン

```typescript
import type { RoxPlugin } from "@rox/backend/plugins";

const contentFilter: RoxPlugin = {
  id: "content-filter",
  name: "Content Filter",
  version: "1.0.0",

  async onLoad({ events, config, logger }) {
    // 禁止ワードを設定から取得
    const blockedWords = await config.get<string[]>("blockedWords") ?? [];

    events.onBefore("note:beforeCreate", ({ content }) => {
      const hasBlocked = blockedWords.some(word =>
        content.toLowerCase().includes(word.toLowerCase())
      );

      if (hasBlocked) {
        logger.warn({ content: content.substring(0, 50) }, "Blocked content");
        return { cancel: true, reason: "禁止ワードが含まれています" };
      }

      return {};
    });
  },
};

export default contentFilter;
```
