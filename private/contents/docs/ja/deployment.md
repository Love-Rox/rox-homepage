---
title: デプロイメントガイド
description: Roxを本番環境にデプロイする
date: 2025-01-01
author: Roxチーム
tags: [デプロイメント, docker, 本番環境, cloudflare]
---

# デプロイメントガイド

このガイドでは、Roxを様々な環境にデプロイする方法を説明します。

## デプロイメントオプション

Roxは複数の方法でデプロイ可能：

1. **Docker Compose** - 従来のVPSデプロイメント
2. **Cloudflare Workers** - エッジデプロイメント
3. **ベアメタル** - 直接インストール

## Docker Composeデプロイメント

### 前提条件

- DockerとDocker Composeがインストール済み
- DNS設定済みのドメイン名
- SSL証明書（Let's Encrypt推奨）

### ステップ1: リポジトリをクローン

```bash
git clone https://github.com/Love-Rox/rox.git
cd rox
```

### ステップ2: 環境設定

```bash
cp .env.example .env
```

`.env`を本番環境の設定で編集：

```bash
# データベース
DB_TYPE=postgres
DATABASE_URL=postgresql://rox:secure_password@postgres:5432/rox

# ストレージ
STORAGE_TYPE=s3
S3_ENDPOINT=https://your-account.r2.cloudflarestorage.com
S3_BUCKET_NAME=rox-media
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key

# サーバー
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-domain.com
BACKEND_URL=https://api.your-domain.com

# セキュリティ
JWT_SECRET=your-very-secure-random-string
SESSION_SECRET=another-secure-random-string
```

### ステップ3: ビルドと起動

```bash
# イメージをビルド
docker compose build

# サービスを起動
docker compose up -d

# ステータス確認
docker compose ps
```

### ステップ4: マイグレーション実行

```bash
docker compose exec backend bun run db:migrate
```

### ステップ5: リバースプロキシ設定

#### Nginxの例

```nginx
# バックエンドAPI
server {
    listen 443 ssl http2;
    server_name api.your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# フロントエンド
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
    }
}
```

## Cloudflare Workersデプロイメント

### 前提条件

- Cloudflareアカウント
- Wrangler CLIインストール済み
- D1データベース作成済み
- R2バケット作成済み

### ステップ1: Wranglerインストール

```bash
npm install -g wrangler
wrangler login
```

### ステップ2: D1データベース作成

```bash
wrangler d1 create rox-db
```

### ステップ3: R2バケット作成

```bash
wrangler r2 bucket create rox-media
```

### ステップ4: デプロイ

```bash
wrangler deploy
```

## データベースバックアップ

### PostgreSQLバックアップ

```bash
# バックアップ
pg_dump -U rox rox > backup.sql

# リストア
psql -U rox rox < backup.sql
```

### 自動バックアップ

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/rox"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
pg_dump -U rox rox | gzip > $BACKUP_DIR/rox_$DATE.sql.gz

# 7日以上古いバックアップを削除
find $BACKUP_DIR -name "rox_*.sql.gz" -mtime +7 -delete
```

## 監視

### ヘルスチェック

```bash
# バックエンドヘルス
curl https://api.your-domain.com/health

# データベースヘルス
curl https://api.your-domain.com/health/db
```

## セキュリティチェックリスト

- [ ] データベースに強力なパスワードを使用
- [ ] ファイアウォールを設定（UFW推奨）
- [ ] SSL/TLS証明書を有効化
- [ ] JWT_SECRETとSESSION_SECRETを安全に設定
- [ ] レート制限を設定
- [ ] 定期的にバックアップ
- [ ] ログを監視

## パフォーマンス最適化

### データベース最適化

```sql
-- 一般的なクエリ用のインデックスを追加
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_created_at ON notes(created_at DESC);
```

### キャッシング

Redis/Dragonflyをキャッシング用に設定：

```bash
REDIS_URL=redis://localhost:6379
CACHE_TTL=3600
```

## トラブルシューティング

### データベース接続問題

```bash
# PostgreSQLステータス確認
sudo systemctl status postgresql

# 接続テスト
psql -U rox -h localhost -d rox
```

### ポート競合

```bash
# ポート3000を使用しているプロセスを確認
sudo lsof -i :3000

# 必要に応じてプロセスを終了
sudo kill -9 <PID>
```

## 次のステップ

- [設定ガイド](configuration) - 詳細な設定オプション
- [アーキテクチャ](architecture) - アーキテクチャを理解
- [APIリファレンス](api-overview) - APIを探索
