---
title: 連合ガイド
description: RoxがMastodonやMisskeyなどの他のActivityPubサーバーとどのように連合するかを理解する
date: 2025-01-01
author: Roxチーム
tags: [連合, activitypub, mastodon, misskey]
---

# 連合ガイド

Roxは **ActivityPub** プロトコルに基づいて構築されており、Fediverse（連合宇宙）内の何千もの他のサーバーと通信し、コンテンツを交換することができます。

## 連合の仕組み

Roxインスタンスのユーザーが他のサーバー（例：`mastodon.social`）のユーザーをフォローすると、サーバーは以下のようにメッセージを交換します：

1.  **購読**: あなたのサーバーがリモートサーバーに更新の送信を要求します。
2.  **配信**: リモートユーザーが投稿すると、そのサーバーはアクティビティをあなたのサーバーの **Inbox** にプッシュします。
3.  **処理**: あなたのサーバーはアクティビティを処理し、ユーザーのタイムラインに追加します。

### サポートされているアクティビティ

Roxは以下のActivityPubアクティビティをサポートしています：

- `Create` (ノート/投稿)
- `Delete` (ノート)
- `Follow` / `Undo Follow` (フォロー/フォロー解除)
- `Like` / `Undo Like` (いいね/いいね解除)
- `Announce` (リノート/ブースト)
- `Update` (プロフィール更新)

## 設定

連合はデフォルトで有効になっていますが、`.env` ファイルで設定可能です。

### 基本設定

```bash
# 連合の有効化/無効化
FEDERATION_ENABLED=true

# 共有Inbox（パフォーマンスのために推奨）
SHARED_INBOX_ENABLED=true
```

### 許可/ブロックリスト

サーバーが通信するインスタンスを制御できます。

```bash
# 許可リスト（設定されている場合、これらのドメインのみ許可されます）
FEDERATION_ALLOWLIST=mastodon.social,misskey.io

# ブロックリスト（これらのドメインはブロックされます）
FEDERATION_BLOCKLIST=spam-instance.com,bad-actors.net
```

## 発見（Discovery）

### WebFinger

Roxは **WebFinger** (RFC 7033) を実装しており、ユーザーがハンドル（例：`@alice@your-domain.com`）で発見されることを可能にします。

エンドポイント: `/.well-known/webfinger?resource=acct:user@domain.com`

### NodeInfo

Roxは **NodeInfo** メタデータを提供し、他のサーバーやクローラーがあなたのインスタンスの機能やソフトウェアバージョンを理解できるようにします。

エンドポイント: `/.well-known/nodeinfo`

## 連合のトラブルシューティング

### "リモートユーザーが見つかりません"
- ハンドルの形式を確認してください：`@username@domain.com`。
- リモートインスタンスがオンラインか確認してください。
- サーバーが外部へのHTTPSリクエストを行えるか確認してください。

### "投稿が届きません"
- バックグラウンドジョブキュー（BullMQ/Dragonfly）を確認してください。連合の配信は非同期です。
- `SHARED_INBOX` がインターネットからアクセス可能か確認してください。
- ログで署名検証エラーを確認してください。

### "署名検証に失敗しました"
- システム時刻が正確か確認してください（NTP）。
- SSL証明書が有効か確認してください。
- セットアップ中にインスタンスキーが正しく生成されたか確認してください。
