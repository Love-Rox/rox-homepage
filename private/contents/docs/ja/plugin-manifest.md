---
title: プラグインマニフェスト
description: plugin.json マニフェストファイルの完全リファレンス
date: 2026-01-09
author: Roxチーム
tags: [プラグイン, マニフェスト, plugin.json, リファレンス]
---

# プラグインマニフェスト

`plugin.json` はプラグインのメタデータを定義するマニフェストファイルです。このドキュメントでは、すべてのフィールドについて説明します。

## 基本構造

```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "description": "プラグインの説明",
  "author": "作者名",
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

## 必須フィールド

### id

プラグインの一意識別子です。

| 属性 | 値 |
|-----|---|
| 型 | `string` |
| 必須 | はい |
| 形式 | 小文字英数字とハイフン、3〜50文字 |

**ルール:**
- 小文字の英字で開始
- 小文字の英数字で終了
- 中間には小文字英数字とハイフンのみ使用可能

```json
{
  "id": "content-filter"
}
```

**バリデーション正規表現:** `/^[a-z][a-z0-9-]{1,48}[a-z0-9]$/`

### name

プラグインの表示名です。

| 属性 | 値 |
|-----|---|
| 型 | `string` |
| 必須 | はい |
| 最大長 | 100文字 |

```json
{
  "name": "Content Filter Plugin"
}
```

### version

セマンティックバージョニング形式のバージョン番号です。

| 属性 | 値 |
|-----|---|
| 型 | `string` |
| 必須 | はい |
| 形式 | セマンティックバージョニング (例: `1.0.0`, `2.1.0-beta.1`) |

```json
{
  "version": "1.2.3"
}
```

## オプションフィールド

### description

プラグインの説明文です。

| 属性 | 値 |
|-----|---|
| 型 | `string` |
| 必須 | いいえ |
| 最大長 | 500文字 |

```json
{
  "description": "不適切なコンテンツを自動的にフィルタリングするプラグイン"
}
```

### author

プラグインの作者名または組織名です。

| 属性 | 値 |
|-----|---|
| 型 | `string` |
| 必須 | いいえ |

```json
{
  "author": "Rox Team"
}
```

### license

プラグインのライセンス（SPDX識別子推奨）です。

| 属性 | 値 |
|-----|---|
| 型 | `string` |
| 必須 | いいえ |

```json
{
  "license": "MIT"
}
```

### homepage

プラグインのホームページURLです。

| 属性 | 値 |
|-----|---|
| 型 | `string` |
| 必須 | いいえ |
| 形式 | 有効なHTTP/HTTPS URL |

```json
{
  "homepage": "https://example.com/my-plugin"
}
```

### repository

GitリポジトリのURLです。

| 属性 | 値 |
|-----|---|
| 型 | `string` |
| 必須 | いいえ |
| 形式 | 有効なHTTP/HTTPS URL |

```json
{
  "repository": "https://github.com/user/my-plugin"
}
```

### minRoxVersion

必要な最小Roxバージョンです（CalVer形式）。

| 属性 | 値 |
|-----|---|
| 型 | `string` |
| 必須 | いいえ |
| 形式 | CalVer (例: `2026.1.0`, `2025.12.1-beta.1`) |

```json
{
  "minRoxVersion": "2026.1.0"
}
```

### maxRoxVersion

サポートする最大Roxバージョンです（CalVer形式）。

| 属性 | 値 |
|-----|---|
| 型 | `string` |
| 必須 | いいえ |
| 形式 | CalVer |

```json
{
  "maxRoxVersion": "2026.12.0"
}
```

### permissions

プラグインが必要とするパーミッションの配列です。

| 属性 | 値 |
|-----|---|
| 型 | `PluginPermission[]` |
| 必須 | いいえ |

**利用可能なパーミッション:**

| パーミッション | 説明 |
|--------------|------|
| `note:read` | ノートの読み取り |
| `note:write` | ノートの作成/更新/削除 |
| `user:read` | ユーザー情報の読み取り |
| `user:write` | ユーザー情報の更新 |
| `config:read` | 設定の読み取り |
| `config:write` | 設定の書き込み |
| `admin:read` | 管理機能の読み取り |
| `admin:write` | 管理機能の書き込み |
| `storage:read` | ストレージの読み取り |
| `storage:write` | ストレージの書き込み |

```json
{
  "permissions": ["note:read", "note:write", "user:read"]
}
```

> [!IMPORTANT]
> パーミッションを宣言しないプラグインは、制限付きコンテキストで実行され、保護されたリソースにはアクセスできません。

### dependencies

依存する他のプラグインIDの配列です。

| 属性 | 値 |
|-----|---|
| 型 | `string[]` |
| 必須 | いいえ |

```json
{
  "dependencies": ["base-plugin", "helper-plugin"]
}
```

依存するプラグインがロードされていない場合、プラグインのロードは失敗します。

### backend

バックエンドエントリーポイントへの相対パスです。

| 属性 | 値 |
|-----|---|
| 型 | `string` |
| 必須 | いいえ |
| デフォルト | `index.ts` または `index.js` |

```json
{
  "backend": "src/index.ts"
}
```

### frontend

フロントエンドエントリーポイントへの相対パスです。

| 属性 | 値 |
|-----|---|
| 型 | `string` |
| 必須 | いいえ |

```json
{
  "frontend": "frontend/index.ts"
}
```

> [!NOTE]
> `backend` と `frontend` のどちらも指定されていない場合、警告が表示されます。

### configSchema

プラグイン設定のJSON Schemaです。

| 属性 | 値 |
|-----|---|
| 型 | `object` |
| 必須 | いいえ |

```json
{
  "configSchema": {
    "type": "object",
    "properties": {
      "blockedWords": {
        "type": "array",
        "items": { "type": "string" },
        "description": "フィルタリングする禁止ワードのリスト"
      },
      "enabled": {
        "type": "boolean",
        "default": true,
        "description": "フィルタリングを有効にするかどうか"
      }
    }
  }
}
```

### keywords

検索用のキーワード配列です。

| 属性 | 値 |
|-----|---|
| 型 | `string[]` |
| 必須 | いいえ |

```json
{
  "keywords": ["moderation", "filter", "content", "safety"]
}
```

### icon

プラグインアイコンのパスまたはURLです。

| 属性 | 値 |
|-----|---|
| 型 | `string` |
| 必須 | いいえ |

```json
{
  "icon": "assets/icon.png"
}
```

### screenshots

プラグインリスト用のスクリーンショットパス配列です。

| 属性 | 値 |
|-----|---|
| 型 | `string[]` |
| 必須 | いいえ |

```json
{
  "screenshots": [
    "assets/screenshot-1.png",
    "assets/screenshot-2.png"
  ]
}
```

## 完全な例

### シンプルなプラグイン

```json
{
  "id": "hello-world",
  "name": "Hello World",
  "version": "1.0.0",
  "description": "シンプルなHello Worldプラグイン",
  "author": "Your Name",
  "backend": "index.ts"
}
```

### フル機能プラグイン

```json
{
  "id": "advanced-moderation",
  "name": "Advanced Moderation",
  "version": "2.1.0",
  "description": "高度なコンテンツモデレーション機能を提供するプラグイン",
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

## バリデーション

マニフェストファイルは読み込み時に自動的にバリデーションされます。バリデーションエラーがある場合、プラグインのロードは失敗します。

### よくあるバリデーションエラー

| エラー | 原因 |
|-------|------|
| `id is required` | `id` フィールドがありません |
| `id must be lowercase alphanumeric...` | ID形式が無効です |
| `version must be in semantic versioning format` | バージョン形式が無効です |
| `invalid permission` | 無効なパーミッションが指定されています |
| `minRoxVersion must be in CalVer format` | バージョン形式が無効です |

## 関連ドキュメント

- [プラグイン開発入門](plugin-getting-started) - 入門ガイド
- [プラグインアーキテクチャ](plugin-architecture) - アーキテクチャの詳細
- [プラグインイベント](plugin-events) - イベントシステムの詳細
