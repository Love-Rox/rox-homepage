---
title: Rox v2026.2.0 リリース - EventBus基盤の強化
description: プラグインシステムのEventBus基盤を強化し、フロントエンドの大規模リファクタリングを行いました
date: 2026-02-01
author: Roxチーム
tags: [Rox, アップデート, プラグイン, お知らせ]
excerpt: Rox v2026.2.0では、EventBus基盤の強化、Wakuのアップグレード、フロントエンドのリファクタリング、リモートユーザー表示の改善など、多くの機能強化が含まれています。
---

# Rox v2026.2.0 リリース - EventBus基盤の強化

## 2026年2月のアップデート

**Rox v2026.2.0** をリリースしました！🎉

今回のリリースでは、v2026.1.0で導入されたプラグインシステムの基盤をさらに強化し、フロントエンドの大規模なリファクタリングを行いました。

## バージョン情報

| コンポーネント | バージョン |
|-----------|---------|
| **Rox (Project)** | `2026.2.0` |
| Hono Rox (Backend) | `1.4.0` |
| Waku Rox (Frontend) | `1.4.0` |
| Shared | `1.4.0` |

## 新機能・改善

### 🚀 EventBus基盤の強化

プラグインシステムのコアとなるEventBus基盤を大幅に強化しました。

#### EventBusクラス

- **型安全なイベントハンドリング**: `on()` / `emit()` でポストアクションイベントを処理
- **プリアクションイベント**: `onBefore()` / `emitBefore()` でキャンセルサポート付きの前処理
- **優先度ベースの実行**: より高い優先度のハンドラが先に実行
- **エラー隔離**: 1つのハンドラの失敗が他に影響しない

#### プラグイン型定義

- `RoxPlugin` インターフェース
- `PluginContext` でコアサービスへのアクセス
- 機密データを除外したサニタイズ済み型（`PluginUser`, `PluginNote`, `PluginFollow`）

#### サービスへのイベントフック統合

- **NoteService**: `note:beforeCreate`, `note:afterCreate`, `note:beforeDelete`, `note:afterDelete`
- **AuthService**: `user:beforeRegister`, `user:afterRegister`, `user:beforeLogin`, `user:afterLogin`
- **FollowService**: `follow:afterCreate`, `follow:afterDelete`

### 🔧 Waku 1.0.0-alpha.3へのアップグレード

フロントエンドフレームワークをWaku 1.0.0-alpha.3にアップグレードしました。

- **FormModal**: 再利用可能なモーダルベースコンポーネント
- **APIユーティリティ**: `buildPaginationParams()` と `buildUrlWithParams()` でクリーンなAPI呼び出し
- **エラーユーティリティ**: `getErrorMessage()` で一貫したエラーメッセージ抽出
- **コンポーネントリファクタリング**: ListCreateModal, ListEditModalがFormModalを使用してボイラープレートを削減

### 🎨 フロントエンドリファクタリング

大規模なフロントエンドリファクタリングを行いました。

#### useApiフックの導入

認証状態管理を一元化する新しいフックを導入：

- `token`: 現在の認証トークン
- `isAuthenticated`: 認証状態のブール値
- `get/post/put/delete`: 認証済みAPIメソッド

#### コンポーネント分割

大きなコンポーネントを小さなモジュールに分割：

| 元のコンポーネント | 分割後 |
|----------|------------|
| `NoteCard.tsx` (929行) | `NoteCard.tsx` + `NoteCardMenu.tsx` |
| `NoteComposer.tsx` (1430行) | `NoteComposer.tsx` + `NoteComposerAttachments.tsx` + `NoteComposerDrafts.tsx` + `NoteComposerSchedulePicker.tsx` |
| `EmojiPicker.tsx` (1193行) | `EmojiPicker.tsx` + `emojiData.ts` |

#### TSDocドキュメント

すべてのエクスポートされたコンポーネント、フック、型定義に包括的なTSDocコメントを追加しました。

### 👤 リモートユーザープロフィールの改善

リモートユーザーの表示を改善しました：

- **ユーザー名形式**: `@username@host` 形式で表示
- **インスタンスバッジ**: リモートインスタンスのアイコンと名前を表示
- **戻るボタンナビゲーション**: SPAナビゲーションの修正

### 🐛 バグ修正

- メンションフィールドのユーザーID格納を一貫化
- リモートインスタンスアイコンのフォールバック表示をReact stateで管理
- 冗長な三項演算子の簡略化

## アップデート方法

Dockerをご利用の場合：

```bash
docker compose pull
docker compose up -d
```

ベアメタルの場合は、最新版をpullしてビルド・再起動してください。

## これからのRox

EventBus基盤の強化により、プラグイン開発がさらに容易になりました。今後も継続的な改善を行っていきます。

ご質問やフィードバックがございましたら、[GitHubリポジトリ](https://github.com/Love-Rox/rox)よりお問い合わせください。

**愛がロックする。Rox。** 🚀
