---
title: コントリビューションガイド
description: Roxへの貢献方法、開発環境のセットアップ、プルリクエストの送信方法について学ぶ
date: 2025-01-01
author: Roxチーム
tags: [貢献, 開発, オープンソース]
---

# Roxへの貢献

Roxへの貢献に関心をお寄せいただきありがとうございます！Roxをより良くするために、コミュニティからの貢献を歓迎します。

## 行動規範

このプロジェクトに参加することで、[行動規範（Code of Conduct）](https://github.com/Love-Rox/rox/blob/main/CODE_OF_CONDUCT.md)に従うことに同意したことになります。すべての人に敬意と優しさを持って接してください。

## はじめに

### 前提条件

- **Bun**: v1.0.0 以上
- **Node.js**: v18 以上（一部のツール用）
- **Docker**: データベースとサービスの実行用

### 環境セットアップ

1.  GitHubでリポジトリを**フォーク**します。
2.  **フォークをクローン**します：
    ```bash
    git clone https://github.com/YOUR_USERNAME/rox.git
    cd rox
    ```
3.  **依存関係をインストール**します：
    ```bash
    bun install
    ```
4.  **データベースを起動**します：
    ```bash
    docker compose up -d
    ```
5.  **マイグレーションを実行**します：
    ```bash
    bun run db:migrate
    ```
6.  **開発サーバーを起動**します：
    ```bash
    bun run dev
    ```

バックエンドAPIは `http://localhost:3000`、フロントエンドクライアントは `http://localhost:3001` で利用可能になります。

## 開発ワークフロー

1.  機能または修正のための**ブランチを作成**します：
    ```bash
    git checkout -b feature/my-new-feature
    ```
2.  **変更を加えます**。プロジェクトのコーディングスタイルに従ってください。
3.  **テストを実行**して、リグレッションがないことを確認します：
    ```bash
    bun test
    ```
4.  Conventional Commitsを使用して**変更をコミット**します：
    ```bash
    git commit -m "feat: add new awesome feature"
    ```
5.  **フォークにプッシュ**します：
    ```bash
    git push origin feature/my-new-feature
    ```
6.  メインリポジトリに対して**プルリクエストを作成**します。

## プロジェクト構造

- `src/backend`: Hono APIサーバー
- `src/frontend`: Wakuクライアントアプリケーション
- `src/shared`: 共有型とユーティリティ
- `drizzle`: データベーススキーマとマイグレーション

## 問題の報告

バグを見つけた場合や機能リクエストがある場合は、GitHubでIssueを開いてください。再現手順など、できるだけ詳細な情報を提供してください。

## ライセンス

貢献することで、あなたの貢献がプロジェクトの[MITライセンス](https://github.com/Love-Rox/rox/blob/main/LICENSE)の下でライセンスされることに同意したことになります。
