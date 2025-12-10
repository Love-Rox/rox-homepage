---
title: 設定ガイド
description: Roxのデプロイメント設定
date: 2025-12-10
author: Roxチーム
tags: [設定, 環境変数, セットアップ]
---

# 設定ガイド

このガイドでは、Roxのすべての設定オプションを説明します。

## 環境変数

Roxは環境変数を通じて完全に設定されます。`.env.example`を`.env`にコピーして、必要に応じてカスタマイズしてください。

### データベース設定

#### PostgreSQL（推奨）

```bash
DB_TYPE=postgres
DATABASE_URL=postgresql://username:password@host:5432/database
```

#### MySQL

```bash
DB_TYPE=mysql
DATABASE_URL=mysql://username:password@host:3306/database
```

#### SQLite

```bash
DB_TYPE=sqlite
DATABASE_URL=sqlite://./rox.db
```

### ストレージ設定

#### ローカルストレージ

```bash
STORAGE_TYPE=local
LOCAL_STORAGE_PATH=./uploads
```

#### S3互換ストレージ

```bash
STORAGE_TYPE=s3
S3_ENDPOINT=https://your-account.r2.cloudflarestorage.com
S3_BUCKET_NAME=rox-media
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_REGION=auto
```

**対応プロバイダー:**
- AWS S3
- Cloudflare R2
- MinIO
- DigitalOcean Spaces

### サーバー設定

```bash
NODE_ENV=production
PORT=3000
FRONTEND_PORT=3001
FRONTEND_URL=https://your-domain.com
BACKEND_URL=https://api.your-domain.com
```

### セキュリティ設定

```bash
JWT_SECRET=your-very-secure-random-string-at-least-32-chars
SESSION_SECRET=another-secure-random-string-at-least-32-chars
COOKIE_SECURE=true
COOKIE_DOMAIN=.your-domain.com
```

**安全なシークレットの生成:**

```bash
# opensslを使用
openssl rand -base64 32

# Bunを使用
bun -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### インスタンス設定

```bash
INSTANCE_NAME=あなたのインスタンス名
INSTANCE_DESCRIPTION=インスタンスの説明
ADMIN_EMAIL=admin@your-domain.com
INSTANCE_ICON_URL=https://your-domain.com/icon.png
```

### 連合設定

```bash
FEDERATION_ENABLED=true
FEDERATION_ALLOWLIST=
FEDERATION_BLOCKLIST=
SHARED_INBOX_ENABLED=true
```

**例:**

```bash
# 特定のインスタンスをブロック
FEDERATION_BLOCKLIST=spam.example.com,bad-actor.net

# 特定のインスタンスのみ許可
FEDERATION_ALLOWLIST=mastodon.social,misskey.io
```

### キャッシュ設定

```bash
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600
```

### レート制限

```bash
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**オプション:**
- `RATE_LIMIT_ENABLED`: レート制限を有効化（デフォルト: `true`）
- `RATE_LIMIT_WINDOW_MS`: 時間ウィンドウ（ミリ秒）（デフォルト: `900000` = 15分）
- `RATE_LIMIT_MAX_REQUESTS`: ウィンドウあたりの最大リクエスト数（デフォルト: `100`）

### ログ設定

```bash
LOG_LEVEL=info
LOG_FORMAT=json
```

**オプション:**
- `LOG_LEVEL`: ログレベル（`debug`, `info`, `warn`, `error`）
- `LOG_FORMAT`: ログ形式（`json`または`pretty`）

## 設定ファイル

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: rox
      POSTGRES_USER: rox
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  dragonfly:
    image: docker.dragonflydb.io/dragonflydb/dragonfly
    ports:
      - "6379:6379"

  backend:
    build: ./packages/backend
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://dragonfly:6379
    ports:
      - "3000:3000"

volumes:
  postgres_data:
```

## ベストプラクティス

### セキュリティ

1. **`.env`ファイルをコミットしない** - `.gitignore`に追加
2. **強力なシークレットを使用** - 最低32文字、ランダム
3. **シークレットを定期的にローテーション**
4. **HTTPSを有効化** - 本番環境では常にSSL/TLS

### パフォーマンス

1. **キャッシングを有効化** - パフォーマンス向上のためRedisを設定
2. **CDNを使用** - 静的アセットをCDN経由で配信
3. **データベースを最適化** - 一般的なクエリ用のインデックスを追加

## 環境別設定

### 開発環境

```bash
NODE_ENV=development
LOG_LEVEL=debug
LOG_FORMAT=pretty
RATE_LIMIT_ENABLED=false
```

### 本番環境

```bash
NODE_ENV=production
LOG_LEVEL=warn
LOG_FORMAT=json
COOKIE_SECURE=true
RATE_LIMIT_ENABLED=true
```

## トラブルシューティング

### データベース接続問題

```bash
# データベース接続をテスト
psql -h localhost -U rox -d rox

# DATABASE_URL形式を確認
echo $DATABASE_URL
```

### ストレージ問題

```bash
# S3接続をテスト
aws s3 ls s3://your-bucket --endpoint-url=$S3_ENDPOINT
```

## 次のステップ

- [デプロイメントガイド](deployment) - Roxを本番環境にデプロイ
- [アーキテクチャガイド](architecture) - アーキテクチャを理解
- [APIリファレンス](api-overview) - APIを探索

---

## 更新履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-12-10 | Cloudflare D1およびwrangler.tomlセクションを削除（開発中止） |
