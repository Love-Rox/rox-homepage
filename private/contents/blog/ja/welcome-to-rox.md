---
title: Roxへようこそ
description: Misskey API互換の軽量ActivityPubサーバー、Roxの紹介
date: 2025-11-27
author: Roxチーム
tags: [お知らせ, 紹介, activitypub]
excerpt: Misskey API互換の軽量ActivityPubサーバー・クライアント、Roxをご紹介します。モダンなデプロイメントシナリオ向けに設計されています。
---

# Roxへようこそ

**Rox**をご紹介します。Misskey API互換の軽量ActivityPubサーバー・クライアントで、モダンなデプロイメントシナリオ向けに設計されています。

## Roxとは？

Roxは、モダンなWeb技術とFediverseのオープンスタンダードを組み合わせた次世代の連合型ソーシャルメディアプラットフォームです。Bun、Hono、Wakuで構築されたRoxは以下を提供します：

- **軽量・高速**: モダンなWeb標準で構築され、卓越したパフォーマンスを実現
- **インフラ非依存**: 従来のVPSまたはエッジ環境にデプロイ可能
- **Misskey互換**: 既存のMisskeyユーザーのためのシームレスな移行
- **開発者フレンドリー**: TypeScriptによるクリーンなアーキテクチャ

## 主要機能

### モダンな技術スタック

Roxは最先端の技術を活用：

- **バックエンド**: Bunランタイム、Honoフレームワーク、Drizzle ORM
- **フロントエンド**: Waku（React Server Components）、Jotai、React Aria Components
- **スタイリング**: OKLCHカラースペースを使用したTailwind CSS v4
- **国際化**: 英語と日本語をサポートするLingui

### ActivityPub連合

完全なActivityPubサポートにより、Roxは以下と連合可能：

- Mastodon
- Misskey
- GoToSocial
- その他のActivityPub互換サーバー

### 柔軟なデプロイメント

デプロイ方法を選択できます：

```bash
# 従来のDockerデプロイメント
docker compose up -d

# Cloudflare Workersでのエッジデプロイメント
wrangler deploy
```

## はじめに

Roxを始めるのは簡単です：

```bash
# リポジトリをクローン
git clone https://github.com/Love-rox/rox.git
cd rox

# 依存関係をインストール
bun install

# 開発を開始
bun run dev
```

詳細な手順については、[はじめにガイド](/docs/getting-started)をご覧ください。

## 今後の予定

現在、以下に取り組んでいます：

- **プラグインシステム**: カスタム機能のための拡張可能なアーキテクチャ
- **強化されたモデレーション**: インスタンス管理者向けの高度なツール
- **パフォーマンス最適化**: Roxをさらに高速に
- **より多くのドキュメント**: 包括的なガイドとチュートリアル

## コミュニティに参加

ぜひご参加ください：

- **GitHub**: [Love-Rox/rox](https://github.com/Love-Rox/rox)
- **ドキュメント**: [Roxドキュメント](/docs)
- **コントリビューション**: [コントリビューションガイド](https://github.com/Love-Rox/rox/blob/main/CONTRIBUTING.md)をご確認ください

## まとめ

Roxは連合型ソーシャルメディアへの新しいアプローチを表しています - 軽量、モダン、そして開発者フレンドリー。皆さんがRoxで何を構築するか楽しみにしています！

今後のアップデートにご期待ください。そして、楽しい連合を！ 🚀
