---
title: waku2bun2 - Bunネイティブ対応に向けた取り組み
description: WakuのBunネイティブ対応を目指すフォークプロジェクト「waku2bun2」について
date: 2026-01-14
author: Roxチーム
tags: [Rox, Waku, Bun, 開発, インフラ]
excerpt: 「せっかくBunを使うなら、全てネイティブにできないか」——そんな思いからWakuのBunネイティブ対応を目指すフォーク「waku2bun2」プロジェクトを開始しました。現時点ではBunのRSCサポートに制限があるため、Bun本体の対応を待ちながら準備を進めています。
---

# waku2bun2 - Bunネイティブ対応に向けた取り組み

## 「全てをBunネイティブに」というチャレンジ

**「せっかくBunを使うなら、全てネイティブにできないか」**——そんな思いから、WakuのBunネイティブ対応を目指すフォーク「**waku2bun2**」プロジェクトを開始しました 🚀

## waku2bun2とは

[waku2bun2](https://github.com/Love-Rox/waku2bun2)は、React Server Components（RSC）フレームワークである[Waku](https://waku.gg/)をBunランタイムでネイティブに動作させることを**目指す**フォークプロジェクトです。

## 現在の技術的課題

検証の結果、現時点ではBunでのRSC対応に根本的な制限があることが判明しました。

### `react-server` export conditionの未サポート

BunはまだNode.jsの`react-server` export conditionをサポートしていません。これはReact Server Componentsの動作に必要な条件です。

```
error: No matching export in "react-dom/package.json" for import "react-dom"
```

このため、現時点では**開発（dev）・ビルド（build）・実行（start）の全フェーズでNode.jsが必要**です。

## 目指すゴール

waku2bun2では、Bunの対応が進み次第以下を実現することを目指しています：

- **開発時** - `bun waku dev`でBunネイティブにホットリロード
- **ビルド時** - `bun waku build`でBunネイティブにビルド
- **実行時** - `bun waku start`でBunネイティブにサーバー起動

## 今後の予定

1. **Bun本体のRSC対応をウォッチ** - `react-server` export conditionのサポート状況を追跡
2. **対応が進み次第waku2bun2を更新** - Bunの成熟に合わせて実装を進める
3. **問題がなければ本家Wakuへ統合** - 安定性が確認できればアップストリームへコントリビュート

## 関連リンク

- [waku2bun2 リポジトリ](https://github.com/Love-Rox/waku2bun2)
- [Waku 公式サイト](https://waku.gg/)
- [Bun 公式サイト](https://bun.sh/)

Bunの進化と共に、このプロジェクトも前進していきます。

**愛がロックする。Rox。** 💜
