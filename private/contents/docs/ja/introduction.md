---
title: Roxの紹介
description: Misskey API互換の軽量ActivityPubサーバー・クライアント、Roxについて学ぶ
date: 2025-01-01
author: Roxチーム
tags: [紹介, 概要, activitypub, misskey]
---

# Roxの紹介

Roxは、Misskey API互換の軽量ActivityPubサーバー・クライアントで、モダンなデプロイメントシナリオ向けに設計されています。

## Roxとは？

Roxは次世代の連合型ソーシャルメディアプラットフォームで、以下を組み合わせています：

- **ActivityPubプロトコル**: Mastodon、Misskey、GoToSocial、その他のActivityPub互換サーバーとの完全な連合
- **Misskey API互換**: 既存のMisskeyユーザーとクライアントのためのシームレスな移行パス
- **モダンアーキテクチャ**: パフォーマンスと開発者体験のための最先端技術で構築
- **デプロイメントの柔軟性**: DockerでVPSに、またはCloudflare Workersなどのエッジ環境で実行

## 主要機能

### 軽量・高性能
Bunランタイムとモダンなウェブ標準で構築され、卓越した速度と効率を実現。バックエンド全体が高速でリソース効率的に設計されています。

### インフラ非依存
Roxはどこにでもデプロイ可能：
- **従来のVPS**: Docker Composeで簡単デプロイ
- **エッジコンピューティング**: Cloudflare WorkersとD1データベースにデプロイ
- **ハイブリッド**: ニーズに応じて組み合わせ

### Misskey API互換
Misskey APIとの完全な互換性により：
- 既存のMisskeyクライアントがそのまま動作
- Misskeyインスタンスからの簡単な移行
- 開発者にとって馴染みのあるAPI

### マルチデータベース対応
デプロイメントに合わせてデータベースを選択：
- **PostgreSQL**: 本番環境推奨
- **MySQL**: 代替リレーショナルデータベース
- **SQLite/D1**: エッジデプロイメントに最適

### 柔軟なストレージ
メディアファイルを好きな場所に保存：
- **ローカルファイルシステム**: シングルサーバーデプロイメントに最適
- **S3互換ストレージ**: AWS S3、Cloudflare R2、MinIOでスケーラビリティ

### モダンUI
美しくアクセシブルなインターフェース：
- **Waku**: React Server Componentsフレームワーク
- **React Aria Components**: アクセシブルなヘッドレスUIコンポーネント
- **Tailwind CSS v4**: OKLCHカラースペースによるモダンスタイリング
- **Lingui**: 最適化された国際化（英語/日本語）

## アーキテクチャ概要

Roxは保守性とテスト可能性のために実証済みの設計パターンを使用：

### リポジトリパターン
データベース操作はインターフェースを通じて抽象化：
- `INoteRepository` - ノート/投稿操作
- `IUserRepository` - ユーザー管理
- `IFileRepository` - ファイル処理
- その他...

### アダプターパターン
ストレージ操作は柔軟性のためにアダプターを使用：
- `LocalStorageAdapter` - ローカルファイルシステムストレージ
- `S3StorageAdapter` - S3互換ストレージ

### 依存性注入
実装はHono Contextを介して環境変数に基づいて注入され、コード変更なしで異なる実装間の切り替えが容易。

## プロジェクト構造

```
rox/
├── packages/
│   ├── backend/   # Hono Rox (APIサーバー)
│   ├── frontend/  # Waku Rox (Webクライアント)
│   └── shared/    # 共通型とユーティリティ
├── docs/          # ドキュメント
├── docker/        # Docker設定
└── scripts/       # ビルドとデプロイメントスクリプト
```

## 技術スタック

### バックエンド
- **ランタイム**: Bun 1.1.45+
- **言語**: TypeScript 5.x
- **フレームワーク**: Hono 4.10.6
- **ORM**: Drizzle ORM 0.36.4
- **キュー**: Dragonfly / BullMQ
- **コード品質**: oxc

### フロントエンド
- **フレームワーク**: Waku 0.27.1
- **状態管理**: Jotai 2.15.1
- **UIコンポーネント**: React Aria Components 1.6.3
- **スタイリング**: Tailwind CSS v4 4.1.17
- **国際化**: Lingui 5.6.0
- **認証**: パスキー + パスワード

## ユースケース

Roxは以下に最適：

1. **個人インスタンス**: 独自の連合型ソーシャルメディアサーバーを運用
2. **コミュニティプラットフォーム**: ActivityPub連合でコミュニティを構築
3. **Misskey移行**: 最小限の中断でMisskeyから移行
4. **エッジデプロイメント**: Cloudflare Workersでグローバルにデプロイ
5. **開発**: ActivityPubと連合システムについて学ぶ

## 次のステップ

始める準備はできましたか？以下のガイドをご覧ください：

- [はじめに](getting-started) - Roxをローカルでセットアップ
- [アーキテクチャ](architecture) - アーキテクチャの詳細
- [デプロイメント](deployment) - Roxを本番環境にデプロイ
- [APIリファレンス](api-overview) - APIを探索

## コミュニティ

- **GitHub**: [Love-Rox/rox](https://github.com/Love-Rox/rox)
- **ドキュメント**: [実装ガイド](https://github.com/Love-Rox/rox/blob/main/docs/implementation/README.md)
- **コントリビューション**: [コントリビューションガイド](https://github.com/Love-Rox/rox/blob/main/CONTRIBUTING.md)

## ライセンス

RoxはMITライセンスの下でオープンソースソフトウェアとして公開されています。
