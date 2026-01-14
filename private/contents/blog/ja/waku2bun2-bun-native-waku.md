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

検証の結果、現時点ではBunでのReact Server Components（RSC）対応に課題があることが判明しました。そのため、rox-homepageでは通常のWakuに戻して運用しています。

```json
{
  "dependencies": {
    "waku": "^1.0.0-alpha.2"
  }
}
```

> [!IMPORTANT]
> BunのRSCサポートはまだ発展途上です。現時点では通常のWaku（Node.jsベース）を使用していますが、Bun本体のRSC対応が進み次第、再度waku2bun2への移行を検討します。

## 今後の予定

1. **Bun本体のRSC対応の動向をウォッチ** - Bunチームの開発状況を継続的に追跡
2. **対応が進み次第waku2bun2を再検証** - Bunの成熟に合わせて再度テスト
3. **問題がなければ本家Wakuへ統合** - 安定性が確認できればアップストリームへコントリビュート

## 関連リンク

- [waku2bun2 リポジトリ](https://github.com/Love-Rox/waku2bun2)
- [Waku 公式サイト](https://waku.gg/)
- [Bun 公式サイト](https://bun.sh/)

検証が進み次第、進捗をお知らせしていきます。

**愛がロックする。Rox。** 💜
