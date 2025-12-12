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

## DevContainerを使う（推奨）

VS CodeまたはGitHub Codespacesを使用している場合、DevContainerで開発環境をワンクリックでセットアップできます。

### DevContainerの特徴

- **ワンクリックセットアップ**: 依存関係、データベース、SSL証明書がすべて自動構成
- **マルチデータベース**: PostgreSQL、MariaDB、Dragonflyがすぐに使える状態で起動
- **HTTPS対応**: mkcertによるローカルSSL証明書が自動生成
- **AI開発支援**: Claude Codeが事前インストール済み

### セットアップ手順

1. VS Codeで[Dev Containers拡張機能](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)をインストール
2. リポジトリをクローン: `git clone https://github.com/Love-rox/rox.git`
3. VS Codeでフォルダを開く
4. 「Reopen in Container」を選択（または `F1` → `Dev Containers: Reopen in Container`）
5. 初回起動時は自動セットアップが実行されます（5〜10分程度）

セットアップ完了後、以下のコマンドで開発を開始できます：

```bash
bun run dev
```

> **ヒント**: DevContainer内ではHTTPSが有効になっているため、`https://localhost` でアクセスできます。

---

## 手動インストール

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

Docker ComposeでPostgreSQLとDragonflyを起動（開発環境用）：

```bash
docker compose up -d
```

サービスが正常に起動したか確認：

```bash
docker compose ps
```

> **注意**: ここでは開発用データベースサービスにDockerを使用しています。本番環境へのデプロイには、より良いパフォーマンスと制御のために[ベアメタルインストール](deployment)を推奨します。

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

---

## 更新履歴

| 日付 | 変更内容 |
|------|----------|
| 2025-12-12 | DevContainerセクションを追加 |
