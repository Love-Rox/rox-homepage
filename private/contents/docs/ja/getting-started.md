---
title: はじめに
description: Roxをローカル環境でセットアップして実行する方法を学ぶ
date: 2025-01-01
author: Roxチーム
tags: [セットアップ, インストール, チュートリアル]
---

# Roxをはじめる

Roxへようこそ！このガイドでは、ローカルマシンでRoxをセットアップして実行する方法を説明します。

## 前提条件

始める前に、以下がインストールされていることを確認してください：

- [Bun](https://bun.sh/) >= 1.0.0
- [Docker](https://www.docker.com/) と Docker Compose
- PostgreSQL >= 14（またはMySQL >= 8.0、またはSQLite）

## インストール手順

### 1. リポジトリをクローン

```bash
git clone https://github.com/Love-rox/rox.git
cd rox
```

### 2. 依存関係をインストール

```bash
bun install
```

### 3. 環境変数を設定

サンプル環境ファイルをコピーして設定：

```bash
cp .env.example .env
```

`.env`を編集して設定します。主要な変数：

- `URL`: インスタンスの公開URL（例: `https://your-domain.com`）
- `DATABASE_URL`: データベース接続文字列
- `STORAGE_TYPE`: `local`または`s3`を選択

### 4. 開発サービスを起動

Docker ComposeでPostgreSQLとDragonflyを起動：

```bash
docker compose up -d
```

サービスが正常に起動したか確認：

```bash
docker compose ps
```

### 5. データベースマイグレーションを実行

データベースマイグレーションを生成して実行：

```bash
bun run db:generate
bun run db:migrate
```

### 6. 開発サーバーを起動

バックエンドとフロントエンドの両方を起動：

```bash
bun run dev
```

または個別に起動：

```bash
# バックエンドのみ
bun run backend:dev

# フロントエンドのみ
bun run frontend:dev
```

サービスは以下で利用可能になります：
- **バックエンドAPI**: http://localhost:3000
- **フロントエンド**: http://localhost:3001

## 次のステップ

- [アーキテクチャガイド](architecture)を読んでRoxの仕組みを理解
- [デプロイメントガイド](deployment)で本番環境のセットアップを確認
- [GitHub](https://github.com/Love-rox/rox)でコミュニティに参加

## トラブルシューティング

### データベース接続エラー

データベース接続エラーが発生した場合：
- Dockerサービスが実行中か確認（`docker compose ps`）
- `.env`のデータベース認証情報が設定と一致しているか確認
- PostgreSQLポート（5432）が既に使用されていないか確認

### ポート競合

ポート3000または3001が既に使用されている場合、変更できます：
- バックエンド: `packages/backend/.env` → `PORT`
- フロントエンド: `packages/frontend/waku.config.ts` → `port`
