---
title: waku2bun2 - Bunネイティブ対応Wakuへの移行
description: 「Bunを使うなら全てネイティブに」というチャレンジ。Wakuフォーク「waku2bun2」のテストを開始
date: 2026-01-14
author: Roxチーム
tags: [Rox, Waku, Bun, 開発, インフラ]
excerpt: 「せっかくBunを使うなら、全てネイティブにできないか」——そんなチャレンジとして、RoxホームページでBunネイティブ対応のWakuフォーク「waku2bun2」のテストを開始しました。問題がなければ本家Wakuへの統合も目指しています。
---

# waku2bun2 - Bunネイティブ対応Wakuへの移行

## 「全てをBunネイティブに」というチャレンジ

**「せっかくBunを使うなら、全てネイティブにできないか」**——そんなチャレンジとして、RoxホームページでBunネイティブ対応のWakuフォーク「**waku2bun2**」のテストを開始しました 🚀

> [!NOTE]
> 現時点ではrox-homepageのみでのテストであり、Rox本体にはまだ適用されていません。

## waku2bun2とは

[waku2bun2](https://github.com/Love-Rox/waku2bun2)は、React Server Components（RSC）フレームワークである[Waku](https://waku.gg/)をBunランタイムでネイティブに動作するようフォークしたプロジェクトです。

### 主な特徴

- **Bunネイティブ対応** - Node.jsではなくBunで直接実行可能
- **高速な起動時間** - Bunの高速なJavaScript/TypeScriptランタイムの恩恵
- **互換性維持** - 既存のWakuプロジェクトからの移行が容易

## なぜBunへ移行するのか

### パフォーマンス向上

Bunは起動時間が非常に高速で、特に開発時のホットリロードやプロダクションでのコールドスタートで大きな改善が期待できます。

### 開発体験の向上

Bunはパッケージマネージャー、テストランナー、バンドラーなどを統合したオールインワンツールキットです。ツールチェーン全体がシンプルになります。

### エコシステムの進化

Bunの採用が広がる中、Roxプロジェクトでもこの新しいランタイムへの対応を進めていきます。

## 現在のステータス

rox-homepageで`@love-rox/waku`パッケージとして試験的に導入しています。

```json
{
  "dependencies": {
    "waku": "npm:@love-rox/waku@1.0.0-alpha.2"
  }
}
```

## 今後の予定

1. **rox-homepageでの動作検証** - 各ページ・機能の動作確認
2. **パフォーマンス計測** - Node.js版との比較
3. **安定性確認** - 本番環境での長期運用テスト
4. **Rox本体への適用検討** - 検証結果を踏まえて判断
5. **本家Wakuへの統合** - 問題がなければアップストリームへのコントリビュートを目指す

## 関連リンク

- [waku2bun2 リポジトリ](https://github.com/Love-Rox/waku2bun2)
- [Waku 公式サイト](https://waku.gg/)
- [Bun 公式サイト](https://bun.sh/)

検証が進み次第、進捗をお知らせしていきます。

**愛がロックする。Rox。** 💜
