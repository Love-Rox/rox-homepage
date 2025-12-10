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

### アプリケーション設定

```bash
# バックエンドサーバーポート（デフォルト: 3000）
PORT=3000

# フロントエンドサーバーポート（デフォルト: 3001）
FRONTEND_PORT=3001

# 環境モード: development | production
NODE_ENV=development

# インスタンスの公開URL（ActivityPub、リンクなどに使用）
# 重要: フェデレーションが機能するには、実際の公開URLと一致する必要があります
URL=https://your-domain.com
```

**オプション:**
- `PORT`: バックエンドサーバーポート（デフォルト: `3000`）
- `FRONTEND_PORT`: フロントエンドサーバーポート（デフォルト: `3001`）
- `NODE_ENV`: 環境（`development`または`production`）
- `URL`: インスタンスの公開URL（フェデレーションに必須）

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

#### データベース接続プール設定（PostgreSQLのみ）

```bash
# プール内の最大接続数（デフォルト: 10）
DB_POOL_MAX=10

# アイドル接続を閉じるまでの秒数（デフォルト: 20）
DB_IDLE_TIMEOUT=20

# 最大接続寿命（秒）（デフォルト: 1800 = 30分）
DB_MAX_LIFETIME=1800

# 接続タイムアウト（秒）（デフォルト: 30）
DB_CONNECT_TIMEOUT=30
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
S3_PUBLIC_URL=https://media.your-domain.com
```

> [!IMPORTANT]
> `S3_ENDPOINT`にはバケット名を含めないでください！バケット名は`S3_BUCKET_NAME`で別途指定します。
>
> **正しい例:** `https://your-account.r2.cloudflarestorage.com`
> **間違った例:** `https://rox-media.your-account.r2.cloudflarestorage.com`

**対応プロバイダー:**
- AWS S3
- Cloudflare R2
- MinIO
- DigitalOcean Spaces
- Backblaze B2

### ファイルアップロード設定

```bash
# 最大ファイルサイズ（バイト）（デフォルト: 10MB = 10485760）
MAX_FILE_SIZE=10485760

# ノートあたりの最大ファイル数（デフォルト: 4）
MAX_FILES_PER_NOTE=4

# アップロード可能なMIMEタイプ
ALLOWED_MIME_TYPES=image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm

# 画像の自動WebP変換を有効化（デフォルト: false）
ENABLE_WEBP_CONVERSION=false
```

### 認証とセッション

```bash
# セッション有効期限（日数）（デフォルト: 30）
SESSION_EXPIRY_DAYS=30

# JWTシークレット（将来の使用のために予約）
JWT_SECRET=your-secure-random-secret-here
```

**安全なシークレットの生成:**

```bash
# opensslを使用
openssl rand -base64 32

# Bunを使用
bun -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 登録とモデレーション

```bash
# 新規ユーザー登録を有効化（デフォルト: false）
ENABLE_REGISTRATION=true

# 登録に招待コードを必須にする（デフォルト: false）
REQUIRE_INVITATION=false
```

### OAuth設定（オプション）

外部アカウントを使用してログイン/登録できるようにOAuthプロバイダーを設定します。

#### GitHub OAuth

OAuth アプリを作成: https://github.com/settings/developers

```bash
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=https://your-domain.com/api/auth/oauth/github/callback
```

#### Google OAuth

認証情報を作成: https://console.cloud.google.com/apis/credentials

```bash
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-domain.com/api/auth/oauth/google/callback
```

#### Discord OAuth

アプリケーションを作成: https://discord.com/developers/applications

```bash
DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret
DISCORD_REDIRECT_URI=https://your-domain.com/api/auth/oauth/discord/callback
```

#### Mastodon OAuth

Mastodonインスタンスでアプリを登録: 設定 > 開発 > 新規アプリケーション
必要なスコープ: `read:accounts`

```bash
MASTODON_CLIENT_ID=your-mastodon-client-id
MASTODON_CLIENT_SECRET=your-mastodon-client-secret
MASTODON_INSTANCE_URL=https://mastodon.social
MASTODON_REDIRECT_URI=https://your-domain.com/api/auth/oauth/mastodon/callback
```

### インスタンス設定

```bash
INSTANCE_NAME=あなたのインスタンス名
INSTANCE_DESCRIPTION=軽量なActivityPubサーバー
ADMIN_EMAIL=admin@your-domain.com
```

**オプション:**
- `INSTANCE_NAME`: インスタンス名（NodeInfoに表示）
- `INSTANCE_DESCRIPTION`: インスタンス情報に表示される説明
- `ADMIN_EMAIL`: 管理者連絡先メール（NodeInfoに表示）

### 連合とActivityPub

```bash
# フェデレーション（ActivityPubサポート）を有効化
ENABLE_FEDERATION=true
```

### Redis / キュー設定

```bash
# キャッシュとジョブキュー用のRedis URL
REDIS_URL=redis://localhost:6379

# キューを無効にして同期配信を使用（デフォルト: false）
USE_QUEUE=true

# 失敗したActivityPub配信のリトライ回数
DELIVERY_RETRY_ATTEMPTS=3

# 統計ログ間隔（ミリ秒）（デフォルト: 3600000 = 1時間）
STATS_LOG_INTERVAL_MS=3600000
```

> [!NOTE]
> 本番環境ではActivityPub配信キューにRedisが必要です。高性能なRedis代替として[Dragonfly](https://www.dragonflydb.io/)を使用できます。

### Webプッシュ通知（VAPID）

VAPIDキーを生成:

```bash
bunx web-push generate-vapid-keys
```

```bash
# VAPID公開鍵（フロントエンドと共有）
VAPID_PUBLIC_KEY=your-vapid-public-key

# VAPID秘密鍵（秘密にしてください！）
VAPID_PRIVATE_KEY=your-vapid-private-key

# VAPID連絡先メール（設定されていない場合はADMIN_EMAILにフォールバック）
VAPID_CONTACT_EMAIL=mailto:admin@example.com
```

### ログ設定

```bash
LOG_LEVEL=info
```

**オプション:**
- `LOG_LEVEL`: ログレベル（`debug`, `info`, `warn`, `error`）
  - デフォルト: 開発環境では`debug`、本番環境では`info`

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
    ports:
      - "5432:5432"

  dragonfly:
    image: docker.dragonflydb.io/dragonflydb/dragonfly
    ports:
      - "6379:6379"
    volumes:
      - dragonfly_data:/data

  backend:
    build: ./packages/backend
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://dragonfly:6379
      - URL=${URL}
    depends_on:
      - postgres
      - dragonfly
    ports:
      - "3000:3000"

  frontend:
    build: ./packages/frontend
    environment:
      - BACKEND_URL=http://backend:3000
    depends_on:
      - backend
    ports:
      - "3001:3001"

volumes:
  postgres_data:
  dragonfly_data:
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
4. **接続プーリングを設定** - ワークロードに合わせて`DB_POOL_MAX`を調整

## 環境別設定

### 開発環境

```bash
NODE_ENV=development
LOG_LEVEL=debug
URL=http://localhost:3000
ENABLE_REGISTRATION=true
```

### 本番環境

```bash
NODE_ENV=production
LOG_LEVEL=info
URL=https://your-domain.com
ENABLE_FEDERATION=true
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

# ローカルストレージの権限を確認
ls -la ./uploads
```

### Redis接続問題

```bash
# Redis接続をテスト
redis-cli -u $REDIS_URL ping
```

## 次のステップ

- [デプロイメントガイド](deployment) - Roxを本番環境にデプロイ
- [アーキテクチャガイド](architecture) - アーキテクチャを理解
- [APIリファレンス](api-overview) - APIを探索

---

## 更新履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-12-10 | 現在の.env.exampleに合わせて更新: OAuthプロバイダー、VAPID、ファイルアップロード設定、URL設定の簡素化を追加 |
