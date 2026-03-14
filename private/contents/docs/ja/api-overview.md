---
title: APIリファレンス
description: RoxのMisskey互換API完全リファレンス
date: 2025-01-01
author: Roxチーム
tags: [api, リファレンス, misskey, エンドポイント]
---

# APIリファレンス

Roxは既存のMisskeyクライアントとのシームレスな統合のため、Misskey互換APIを提供しています。

## ベースURL

```
https://api.your-domain.com
```

## 認証

### アカウント作成

```http
POST /api/signup
Content-Type: application/json

{
  "username": "alice",
  "password": "secure_password"
}
```

**レスポンス:**

```json
{
  "id": "user_123",
  "username": "alice",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### ログイン

```http
POST /api/signin
Content-Type: application/json

{
  "username": "alice",
  "password": "secure_password"
}
```

**レスポンス:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "username": "alice",
    "displayName": "Alice"
  }
}
```

### トークンの使用

`Authorization`ヘッダーにトークンを含めます：

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## ノート（投稿）

### ノート作成

```http
POST /api/notes/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "Hello, Fediverse!",
  "visibility": "public",
  "fileIds": ["file_123"],
  "cw": "閲覧注意テキスト（オプション）",
  "replyId": "note_456（オプション）",
  "renoteId": "note_789（オプション）"
}
```

**パラメータ:**

- `text` (string): ノート内容
- `visibility` (string): `public`, `home`, `followers`, `specified`
- `fileIds` (array): アップロードされたファイルIDの配列
- `cw` (string, オプション): 閲覧注意
- `replyId` (string, オプション): 返信先ノートのID
- `renoteId` (string, オプション): リノート元ノートのID

**レスポンス:**

```json
{
  "createdNote": {
    "id": "note_123",
    "text": "Hello, Fediverse!",
    "userId": "user_123",
    "visibility": "public",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

### タイムライン取得

```http
POST /api/notes/timeline
Authorization: Bearer {token}
Content-Type: application/json

{
  "limit": 20,
  "sinceId": "note_100",
  "untilId": "note_200"
}
```

**パラメータ:**

- `limit` (number): ノート数（最大100）
- `sinceId` (string, オプション): このID以降のノートを取得
- `untilId` (string, オプション): このID以前のノートを取得

**レスポンス:**

```json
[
  {
    "id": "note_123",
    "text": "Hello!",
    "user": {
      "id": "user_123",
      "username": "alice",
      "displayName": "Alice"
    },
    "createdAt": "2025-01-01T00:00:00.000Z",
    "reactions": {
      "👍": 5,
      "❤️": 3
    }
  }
]
```

### ノート削除

```http
POST /api/notes/delete
Authorization: Bearer {token}
Content-Type: application/json

{
  "noteId": "note_123"
}
```

### リアクション

```http
POST /api/notes/reactions/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "noteId": "note_123",
  "reaction": "👍"
}
```

### リアクション削除

```http
POST /api/notes/reactions/delete
Authorization: Bearer {token}
Content-Type: application/json

{
  "noteId": "note_123"
}
```

## ユーザー

### ユーザー情報取得

```http
POST /api/users/show
Content-Type: application/json

{
  "username": "alice"
}
```

**レスポンス:**

```json
{
  "id": "user_123",
  "username": "alice",
  "displayName": "Alice",
  "description": "自己紹介",
  "avatarUrl": "https://example.com/avatar.jpg",
  "bannerUrl": "https://example.com/banner.jpg",
  "followersCount": 100,
  "followingCount": 50,
  "notesCount": 500
}
```

### 現在のユーザー取得

```http
POST /api/i
Authorization: Bearer {token}
```

### プロフィール更新

```http
POST /api/i/update
Authorization: Bearer {token}
Content-Type: application/json

{
  "displayName": "Alice Smith",
  "description": "新しい自己紹介",
  "avatarId": "file_123",
  "bannerId": "file_456"
}
```

## フォロー

### ユーザーをフォロー

```http
POST /api/following/create
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_456"
}
```

### フォロー解除

```http
POST /api/following/delete
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "user_456"
}
```

## ファイル

### ファイルアップロード

```http
POST /api/drive/files/create
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [バイナリデータ]
name: "image.jpg"
isSensitive: false
```

**レスポンス:**

```json
{
  "id": "file_123",
  "name": "image.jpg",
  "type": "image/jpeg",
  "md5": "abc123...",
  "size": 123456,
  "url": "https://example.com/files/image.jpg",
  "thumbnailUrl": "https://example.com/files/thumb_image.jpg"
}
```

## レート制限

- **デフォルト**: 15分あたり100リクエスト（IP単位）
- **認証済み**: 15分あたり200リクエスト（ユーザー単位）

**レート制限ヘッダー:**

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

## エラーレスポンス

### 400 Bad Request

```json
{
  "error": {
    "message": "無効なリクエスト",
    "code": "INVALID_PARAM",
    "id": "request_123"
  }
}
```

### 401 Unauthorized

```json
{
  "error": {
    "message": "認証が必要です",
    "code": "AUTHENTICATION_FAILED"
  }
}
```

### 404 Not Found

```json
{
  "error": {
    "message": "リソースが見つかりません",
    "code": "NOT_FOUND"
  }
}
```

## 次のステップ

- [認証ガイド](authentication) - 詳細な認証フロー
- [連合ガイド](federation) - ActivityPub連合の詳細
- [デプロイメントガイド](deployment) - インスタンスのデプロイ
