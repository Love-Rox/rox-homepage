---
title: Rox を TypeScript 7 (RC) へ移行しました - ネイティブコンパイラと依存関係の総入れ替え
description: 依存パッケージを最新化し、ネイティブ (Go) コンパイラである TypeScript 7 (RC) へ移行しました。移行中に踏んだ ioredis の二重化と TypeDoc 非対応という 2 つの落とし穴とその回避策も含めて共有します
date: 2026-06-21
author: Roxチーム
tags: [Rox, TypeScript, ツールチェーン, 開発, お知らせ]
excerpt: Rox の TypeScript を 7.0.1-rc へ移行しました。tsc が Go 製のネイティブコンパイラに切り替わり、型チェックが大幅に高速化します。あわせて依存パッケージを全面更新。移行中に遭遇した ioredis のバージョン二重化による型衝突と、TypeDoc がまだ TS7 に対応していない問題、その 2 つを overrides と隔離ツールでどう解決したかを書きました。
---

# Rox を TypeScript 7 (RC) へ移行しました

Rox の開発ツールチェーンを **TypeScript 7 (RC)** へ移行しました。あわせて依存パッケージも一通り最新版に揃えています。リリースの機能追加ではなく地味な基盤整備ですが、開発体験に効く変更なので記録しておきます。

## TypeScript 7 とは

TypeScript 7 は、これまで TypeScript 自身（JavaScript）で書かれていたコンパイラを **Go でフルスクラッチ移植**したものです。いわゆる "tsgo" / ネイティブコンパイラとして開発が進められてきました。

ポイントはシンプルで、**速い**ことです。型チェックやエディタの応答が桁違いに速くなる、というのが最大の動機です。API・型システムの挙動は基本的に互換を保ちながら、コンパイラの実装だけが Go ネイティブに置き換わります。

現時点ではまだ **RC (Release Candidate)** の段階ですが、Rox は「軽くて速い」を掲げているプロジェクトなので、ツールチェーンも素直に最新へ寄せておくことにしました。

```bash
$ tsc --version
Version 7.0.1-rc
```

`typescript` パッケージ自体が `7.0.1-rc` を `rc` タグで配布しており、`bin/tsc` をそのまま同梱しているため、**コマンドはこれまでと同じ `tsc`** です。型チェックスクリプト (`tsc --noEmit`) も `shared` パッケージの emit ビルド (`tsc`) も、コマンドを変えずにネイティブコンパイラへ切り替わりました。

## あわせて依存関係も総入れ替え

ツールチェーンを触るついでに、依存パッケージを全面的に最新へ更新しました。

- React 19.2.7 / Hono 4.12.26 / Drizzle / Zod
- `@lingui/*` 6.4.0 / `@sentry/*` 10.59.0 / BullMQ 5.79.0
- pg 8.22.0 / sharp 0.35.2 / Vite 8.0.16 / Waku 1.0.0-beta.3
- Playwright 1.61.0 / Storybook 10.4.6 など

ここまでは順調…と言いたいところですが、移行中に **2 つの落とし穴** を踏んだので共有します。同じ構成のモノレポで詰まる人がいるかもしれません。

## 落とし穴その 1: ioredis のバージョン二重化

依存を更新したところ、`bun run typecheck` が突然こんなエラーを吐き始めました。

```
error TS2322: Type 'Redis' is not assignable to type 'ConnectionOptions'.
  Type 'ioredis@5.11.1/.../Redis' is not assignable to type 'ioredis@5.10.1/.../Redis'.
```

原因は **ioredis が 2 バージョン同居していた**こと。Rox のバックエンドは ioredis を直接 `5.11.1` で使う一方、ジョブキューの **BullMQ が ioredis を `5.10.1` 固定で依存**していました。型としては別物の `Redis` クラスが 2 つ存在し、自前で生成した `Redis` インスタンスを BullMQ に渡す箇所で「同じ `Redis` のはずなのに代入できない」と弾かれていたわけです。

解決策は、ルートの `package.json` で `overrides` を使って **ioredis を単一バージョンに統一**することでした。

```json
{
  "overrides": {
    "ioredis": "5.11.1"
  }
}
```

ここで一つ注意点。Bun では `overrides` を追加しただけだと既存の解決結果がキャッシュされたまま反映されないことがあります。`bun.lock` の再生成だけでは足りず、**`node_modules` ごとクリーン再構築**して初めて BullMQ の依存も `5.11.1` に揃いました。

```bash
rm -rf node_modules bun.lock && bun install
```

## 落とし穴その 2: TypeDoc がまだ TS7 に対応していない

もう一つは、API ドキュメント生成に使っている **TypeDoc** です。TypeScript 7 へ上げた状態で実行すると、こうなりました。

```
Error [ERR_PACKAGE_PATH_NOT_EXPORTED]
```

TypeDoc は TypeScript の**コンパイラ API をライブラリとして**読み込んで動きます。一方ネイティブコンパイラはパッケージの `exports` 構成が変わっており、TypeDoc が期待する API パスを解決できません。最新の TypeDoc (0.28.19) でも peerDependency は `6.0.x` まで、つまり **TS7 は未対応**でした。

困ったのは、Bun が npm の **スコープ付き override (`"typedoc > typescript"` 形式や入れ子オブジェクト形式)** をサポートしていない点です。`typescript` をフラットに override すると今度はワークスペース全体が TS6 に戻ってしまい、移行の意味がなくなります。

そこで TypeDoc だけを、**TypeScript 6 に固定した独立インストール**として隔離しました。`tools/apidocs/` に専用の `package.json` を置きます。

```jsonc
// tools/apidocs/package.json
{
  "name": "rox-typedoc",
  "private": true,
  "devDependencies": {
    "typedoc": "^0.28.19",
    "typescript": "6.0.3"
  }
}
```

ワークスペースとは別管理の `node_modules` を持たせ、ルートの `typedoc` スクリプトはこの隔離側のバイナリを叩くようにしました。

```jsonc
// package.json (root)
{
  "scripts": {
    "typedoc:install": "cd tools/apidocs && bun install",
    "typedoc": "tools/apidocs/node_modules/.bin/typedoc"
  }
}
```

カレントディレクトリはリポジトリルートのまま（`typedoc.json` の相対パスが効く）、`typedoc` バイナリだけ隔離側から起動するのがコツです。バイナリは自分の隣にある `typescript@6` を解決するため、ワークスペースが TS7 でも TypeDoc は TS6 で動きます。GitHub Actions のドキュメント生成ワークフローも、この隔離ツールをインストールして実行するよう更新しました。

> [!NOTE]
> ちなみにディレクトリ名は最初 `tools/typedoc/` にしていましたが、`.gitignore` に `typedoc/`（どこでも「typedoc」という名のディレクトリにマッチ）があり、丸ごと無視されてしまいました。`tools/apidocs/` にリネームして解決しています。

## 検証結果

すべて TypeScript 7 (ネイティブ tsc) で確認しています。

| 項目                         | 結果              |
| ---------------------------- | ----------------- |
| typecheck (backend/frontend) | ✅ エラーなし     |
| ユニットテスト               | ✅ 1012 件すべて通過 |
| Lint                         | ✅ エラーなし     |
| ビルド                       | ✅ 成功           |
| TypeDoc (TS6 隔離)           | ✅ エラーなし     |

## 移行する場合の注意

- **RC 段階です**。7.0.1-rc は正式版前なので、本番運用前には必ず CI を一巡させて確認してください。
- **エディタ側の設定**。VS Code などで TS7 を使うには、ワークスペースの TypeScript バージョンを `node_modules/typescript/lib` に向ける指定が必要です。
- **TypeDoc を使っているなら隔離が必要**。本記事のように TS6 へ固定した独立インストールを用意するのが現状の現実解です。

## おわりに

機能追加ではありませんが、コンパイラのネイティブ化と依存の鮮度維持は、これから先の開発速度にじわじわ効いてきます。「軽くて速い」を支える足回りを、地道に整えていきます。

ご質問やフィードバックは [GitHub Issues](https://github.com/Love-Rox/rox/issues) にてお待ちしております。

**愛がロックする。Rox。** 🚀
