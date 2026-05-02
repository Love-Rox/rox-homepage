---
title: tate-chu-yoko に rehype が加わりました - unified パイプラインで build-time に縦中横を組む
date: 2026-05-03
author: Roxチーム
tags: [Love-Rox, tate-chu-yoko, rehype, unified, npm, リリース, 縦中横, 日本語組版]
description: 4つ目のパッケージ `@love-rox/tcy-rehype` を公開しました。`unified` の HAST パイプラインに組み込めば、Markdown → HTML や HTML → HTML の build 時に縦中横を適用できます。Astro / eleventy / MDX などで、React や Vue ランタイムを持ち込まずに自動縦中横化が可能になります。
excerpt: これまで自動縦中横は React か Vue で「描画時に」適用するものでした。アプリケーション内ではそれで十分ですが、静的サイトや Markdown ベースのコンテンツパイプラインには合いません。`@love-rox/tcy-rehype` は4つ目のパッケージとして、同じラッピング処理を `unified` パイプライン内で完結させます。クライアントランタイム不要、フレームワーク依存なし、オプションは既存と同一。
---

# tate-chu-yoko に rehype が加わりました - unified パイプラインで build-time に縦中横を組む

tate-chu-yoko の4つ目のパッケージ **`@love-rox/tcy-rehype`** を npm に公開しました ✨

- 📦 [@love-rox/tcy-rehype@0.2.2](https://www.npmjs.com/package/@love-rox/tcy-rehype)
- 📦 [@love-rox/tcy-core@0.2.2](https://www.npmjs.com/package/@love-rox/tcy-core)
- 📦 [@love-rox/tcy-react@0.2.2](https://www.npmjs.com/package/@love-rox/tcy-react)
- 📦 [@love-rox/tcy-vue@0.2.2](https://www.npmjs.com/package/@love-rox/tcy-vue)
- 💾 GitHub: [Love-Rox/tate-chu-yoko](https://github.com/Love-Rox/tate-chu-yoko)
- 🎨 パッケージ紹介: [/packages/tate-chu-yoko](/ja/packages/tate-chu-yoko)

> 4 パッケージはバージョン番号を `@love-rox/tcy-core` に揃えてリリースしています。「core は 0.3 だけど react は 0.2.5」のような不整合で迷わないよう、どれか一つでも変更があれば他もまとめて同じ番号に上がる運用です。

## 何ができるか

[rehype](https://github.com/rehypejs/rehype) のプラグインです。`@love-rox/tcy-core` を内部で使い、HAST を走査して text ノード内の半角英数字 run を `<span class="tcy">` で包みます。あとは CSS の `text-combine-upright: all` が縦中横として組版してくれます。

すでに `unified` ベースのパイプラインがあるなら——Markdown / MDX / Astro / eleventy / 単純な HTML 書き換え——その中に組み込むだけで、build 時に縦中横が適用されます。**クライアント側には React も Vue も不要です。**

## なぜいま追加したか

0.2.2 までの自動縦中横は、`<Tcy>` を React か Vue で描画する想定でした。これはアプリ内では問題ないものの、二つのケースで噛み合いません。

- **JS ランタイムを持たない静的サイト**。ドキュメントサイト、ブログ、出版物——縦組み × 縦中横の価値が一番高い場所に、必ずしも React/Vue があるとは限らない。
- **Markdown を正本としたサーバサイドパイプライン**。`.md` や MDX が原稿である現場では、build 時にラッピングまで済ませた HTML を吐きたい。実行時に hydration するのは余計な処理です。

rehype プラグインにすればこの両方にきれいに当てはまります。build 中に1回走り、静的な HTML を残し、余計な JS は入りません。

## Markdown パイプラインに組み込む

```ts
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeTcy from "@love-rox/tcy-rehype";

const html = String(
  await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeTcy)
    .use(rehypeStringify)
    .process("第1章 2026年4月"),
);
// <p>第<span class="tcy">1</span>章 <span class="tcy">2026</span>年<span class="tcy">4</span>月</p>
```

`remark-rehype` のあと、HAST が確定したタイミングで `rehypeTcy` を挟むだけ。HTML として出力される時点で、縦中横ラッピングは済んでいます。

## HTML だけのパイプライン

Markdown を介さず、HTML in / HTML out なら同じ要領で:

```ts
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import rehypeTcy from "@love-rox/tcy-rehype";

const html = String(
  await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeTcy)
    .use(rehypeStringify)
    .process("<p>第1章 2026年4月</p>"),
);
```

## オプションは `<Tcy>` と完全に共通

共通オプション——`target` / `combine` / `include` / `exclude` / `maxLength` / `excludeWords`——はすべて同じ意味で動きます。React / Vue でできることはそのまま rehype 側でもできます。

```ts
.use(rehypeTcy, {
  maxLength: 2,
  excludeWords: ["URL", "API", "2026"],
})
```

プラグイン専用オプションは3つだけ:

- **`tagName`**（既定値 `'span'`）— ラップに使うタグ名
- **`className`**（既定値 `'tcy'`）— ラップ要素に付くクラス名。配列で複数指定可
- **`skipTags`**（既定値 `['code', 'pre', 'script', 'style']`）— このタグの中身は走査しない

特に `skipTags` は地味ながら重要で、コードサンプルや埋め込み JSON が縦中横化されてしまうのを防ぎます。

## 冪等です

同じ HAST に2回プラグインを適用しても、出力は1回適用したときと同じです。span が二重になったりはしません。複数の処理段階で「念のため tcy を適用」したいケースでも安全です。

## ラインアップの中での位置づけ

```
@love-rox/tcy-core    — framework-agnostic トークナイザー（脳）
@love-rox/tcy-react   — React 用 `<Tcy>`（描画時にラップ）
@love-rox/tcy-vue     — Vue 3 用 `<Tcy>`（描画時にラップ）
@love-rox/tcy-rehype  — `unified` プラグイン（build 時にラップ） ← 新規
```

4つすべて同じ `core` トークナイザーを使っているので、「縦中横にすべき run はどれか」の判定はどのアダプタでも同一です。違うのは「いつ」「どこで」ラップが起きるか、それだけです。

`<Tcy>` で動いているプロジェクトには影響ありません。「React や Vue を持ち込まずに同じことがしたかった」という場面に、`@love-rox/tcy-rehype` がはまります。

## 試してみる

```bash
bun add @love-rox/tcy-rehype
# pnpm / npm / yarn でも同じ
```

`unified` パイプラインに `.use(rehypeTcy)` を追加して、必要ならオプションを指定するだけ。詳細な README と例は [GitHub リポジトリ](https://github.com/Love-Rox/tate-chu-yoko/tree/main/packages/rehype#readme) にあります。

## フィードバック歓迎です

Markdown パイプライン、Astro、eleventy、その他 `unified` を使った自前のビルドで tate-chu-yoko を試した感想を聞きたいです。「この単語は寝かせたい」「ここは組みたい」のような判断は、ライブラリ側だけでは決められない部分です。書き手・編集・組版・実装の現場の声がいちばん効きます。

[GitHub Issues](https://github.com/Love-Rox/tate-chu-yoko/issues) でお待ちしています。

**愛がロックする。Rox。**
