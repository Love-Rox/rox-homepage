---
title: 2026年7月に作ったものたち - LaboLabo / Harushion / kichijitsu / kumihimo
description: 7月の Love-Rox では Rox v2026.7.0 の安定版リリースに加えて、4つの新しいプロダクトを公開しました。AIエージェントの並列実行環境、GitHub クライアント、カレンダー、AV系統図ライブラリをまとめて紹介します
date: 2026-07-31
author: Roxチーム
tags: [お知らせ, LaboLabo, Harushion, kichijitsu, kumihimo, リリース]
excerpt: 7月の Love-Rox は新しいプロダクトが4つ生まれた月になりました。AIコーディングエージェントを1セッション=1worktreeで並列に走らせる macOS アプリ「LaboLabo」、GitHub の Issue/PR を検索クエリ単位で追う「Harushion」、ローカルファーストなカレンダー「kichijitsu」、AV系統図をテキストで書く「kumihimo」。それぞれ何を解こうとしたのかを紹介します。
---

# 2026年7月に作ったものたち

7月の Love-Rox は、[Rox v2026.7.0](/blog/rox-v2026-7-0) の安定版リリースに加えて、新しいプロダクトが4つ生まれた月になりました。

いずれも「自分たちが困っていたこと」から出発しています。この記事では、それぞれが何を解こうとしたのかを紹介します。

## 🧪 LaboLabo — AIエージェントを並列で走らせて、その差分を真横で見る

**サイト: <https://labolabo.love-rox.cc>** ・ [GitHub](https://github.com/Love-Rox/labolabo)

Claude Code や Codex、Gemini といった AI コーディングエージェントを複数同時に走らせると、すぐに「いまどのセッションが何を変更したのか分からない」状態になります。端末を並べても、見えているのはエージェントの発話だけで、リポジトリの実際の状態は別途 `git diff` を叩かないと分かりません。

LaboLabo は、**1セッション = 1 git worktree** という原則でこれを整理する macOS ネイティブアプリです。

- **左ペイン**: リポジトリ/セッションのツリー。セッション名・ブランチ名・状態を一望できます
- **中央**: 本物の GPU 端末。エージェントがインタラクティブに動きます
- **右ペイン**: 変更ファイル一覧と、Diff ⇄ ファイル全文の切替表示

セッションごとに worktree が分かれているため、並列で走らせても作業が混ざりません。そして中央の端末で動いているエージェントの変更が、右ペインにライブで反映されます。

技術的には、端末に **libghostty** を XCFramework として埋め込んでいるのが中心的な選択です。ターミナルエミュレータを自前で書くのでも、既存アプリを外部プロセスとして呼ぶのでもなく、GPU レンダリングされる本物の端末をアプリ内に持っています。

| 項目             | 内容                                                           |
| ---------------- | -------------------------------------------------------------- |
| プラットフォーム | macOS ネイティブ（Swift + SwiftUI）                            |
| 端末             | libghostty を XCFramework として埋め込み                       |
| エンジン層       | プロセス / Git / 状態を UI 非依存の Swift `actor` 群として分離 |
| 永続化           | GRDB.swift（SQLite）                                           |

現在のバージョンは **v1.2.5** です。

```sh
brew tap love-rox/tap
brew trust love-rox/tap          # 第三者 tap の信頼（Homebrew の要件）
brew install --cask labolabo
```

## 🌸 Harushion — GitHub の Issue/PR を「Stream」で追う

**サイト: <https://harushion.love-rox.cc>** ・ [GitHub](https://github.com/Love-Rox/Harushion)

GitHub の通知は、放っておくと read/unread の海になります。Harushion は通知を追うのではなく、**GitHub 検索クエリを「Stream」という単位にして、見たいものを自分で定義する**アプローチを取りました。

- **Stream**: GitHub 検索クエリ単位でチェック対象をコントロールする
- **Filter**: Stream 内の絞り込みはローカルで行う。**API レートリミットを消費しない**
- **ブランチグラフ**: ブランチ状況を DAG で可視化
- **アプリ内ブラウザ**: github.com 専用ウィンドウで閲覧。外部ブラウザで開くこともできる

認証まわりは、**トークンを自前で保存しない**方針にしています。GitHub CLI (`gh`) に委譲し、`gh auth token` から都度取得してメモリ上にのみ保持します。アプリが認証情報の保管責任を持たずに済むため、設計と運用の両面で軽くなりました。

Tauri 2 + React 構成で、バックエンドは Rust + SQLite、フロントは表示に専念しています。macOS だけでなく Windows / Linux 向けのパッケージも配布しており、新しいバージョンが出るとアプリ内バナーで通知され、そのまま自己更新できます。

現在のバージョンは **v0.1.14** です。

```sh
brew tap love-rox/tap
brew install --cask harushion
xattr -rd com.apple.quarantine /Applications/Harushion.app
```

Windows / Linux は [Releases](https://github.com/Love-Rox/Harushion/releases) から nsis インストーラ / AppImage・deb・rpm を入手できます。

## 📅 kichijitsu — ローカルファーストなカレンダークライアント

**サイト: <https://kichijitsu.love-rox.cc>** ・ [GitHub](https://github.com/Love-Rox/kichijitsu)

Notion Calendar 相当の使い勝手を、ローカルファーストで実現しようとしているカレンダークライアントです。7月だけで v0.1.0 から **v0.1.8** まで進みました。

- **3日タイムラインが既定**。狭い画面では 1日/3日/月、広い画面では従来どおり 週/月 を出し分けます
- **Google Calendar 同期**。差分同期に加えて、繰り返し予定の RRULE、イベント色、リマインダーまで扱います
- **会議リンクの表示**。Google Meet / Zoom / Teams / Slack ハドルをアイコンで判別し、「Meet で参加」のような参加リンクを出します
- **編集操作**。Option+ドラッグで予定を複製、場所の入力補完、繰り返し予定を編集・移動するときの適用範囲の選択
- **スマホ対応**。どこでもスワイプで日移動、予定はタップして選択してから移動

構成は Web（PWA）+ デスクトップ（Tauri）+ 同期用の Cloudflare Workers という3層です。カレンダーの同期は、仕様上の落とし穴が非常に多い領域でした。Google Calendar API の差分同期における削除の扱い、繰り返しインスタンスの ID 体系、リマインダーの `useDefault` と `overrides` の意味。素直に読むと足をすくわれる箇所を、1つずつ潰していく作業が続いています。

## 🎛️ kumihimo — AV系統図をテキストで書く

**サイト: <https://kumihimo.love-rox.cc/ja>** ・ [GitHub](https://github.com/Love-Rox/kumihimo) ・ [npm](https://www.npmjs.com/package/@love-rox/kumihimo-core)

Mermaid がフローチャートに対してやっていることを、**AV系統図**に対してやるライブラリです。ただし、決定的な違いが2つあります。**接続の単位がノードではなくポートであること**、そして**ケーブルに乗る信号の種別を、装飾ではなくツールが理解する情報として扱うこと**です。

```khm
device cam "SONY FX3"  as camera   { out SDI : sdi }
device sw  "ATEM Mini" as switcher { in 1..8 : sdi  out PGM : sdi }
device rec "HyperDeck" as recorder { in SDI : sdi }

cam.SDI -> sw.1     : sdi 30m "V-01" [color=blue]
sw.PGM  -> rec.SDI  : sdi 2m  "V-10"
```

なぜポート単位なのか。ミキサーの `IN 12` と `IN 13` は違うものですし、SDI 出力は HDMI 入力に挿さりません。ケーブルの長さや外皮の色は、現場の誰かが必要とする事実です。フローチャートのツールは、これらの絵を描くことはできても、**その絵が間違っているときに教えてくれません**。

|                | Mermaid フローチャート | kumihimo                                   |
| -------------- | ---------------------- | ------------------------------------------ |
| 接続の単位     | ノード → ノード        | **ポート → ポート**                        |
| 線の意味       | 任意                   | **信号種別**（SDI / XLR / Dante …）        |
| 検証           | なし                   | 型の不一致、方向、入力の重複割り当て       |
| ノード内の位置 | 意味を持たない         | **意味を持つ** — `IN 1` は `IN 2` ではない |

拾いたいのは、**ケーブルは完璧に挿さっているのに何も動かない**類の障害です。たとえば HDBaseT は Cat ケーブルと RJ45 コネクタを使いますが Ethernet ではないので、ネットワークスイッチに挿しても機能しません。物理的には何の問題もなく挿さります。

パッケージは用途ごとに分かれています。

- `@love-rox/kumihimo-core` — パーサ、バリデータ、レイアウト、SVG レンダラ
- `@love-rox/kumihimo-cli` — `kumihimo build` / `check` / `export` / `--watch`
- `@love-rox/kumihimo-rehype` — Markdown パイプライン中のコードフェンスを描画
- `@love-rox/kumihimo-react` / `-vue` / `-astro` — 各フレームワーク向けコンポーネント
- `@love-rox/kumihimo-editor` — 組み込み可能なライブエディタ

CLI からは draw.io 形式への書き出しや、現場で使うケーブル表の出力もできます。

卓の16chを図ごとに書き直す必要はありません。`model` で一度定義しておけば、`device … from` から何台でも実体化できます。

```khm
model dm3 "Yamaha DM3" as mixer {
  in  CH[1..16] : xlr
  out L, R      : xlr
  @vendor "Yamaha"
}

device foh from dm3
device mon from dm3 "モニター卓"
```

サイトにはライブエディタが載っているので、インストールせずに書き味を試せます。

7月30日に公開したばかりで、npm 上は **v0.1.0** です。

## 📦 配布について

macOS 向けのアプリは [love-rox/tap](https://github.com/Love-Rox/homebrew-tap) から配布しています。

```sh
brew tap love-rox/tap
```

第三者 tap のため、cask のインストール前に `brew trust love-rox/tap` が必要です。また無署名配布のため、初回起動が Gatekeeper にブロックされた場合は、インストール時に表示される `caveats` の手順（`xattr` による隔離属性の解除、または Finder で右クリック →「開く」）で許可してください。

## おわりに

4つとも、まだバージョン番号の若いプロダクトです。8月も引き続き、それぞれを育てていきます。

使ってみて困ったことや「こうだったらいいのに」があれば、各リポジトリの Issue でお知らせください。

**愛がロックする。Rox。** 🛠️
