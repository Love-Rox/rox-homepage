---
title: tate-chu-yoko リリース - Webの縦書きに、縦中横の手触りを
date: 2026-04-19
author: Roxチーム
tags: [Love-Rox, tate-chu-yoko, npm, リリース, 縦中横, 日本語組版]
description: 日本語の縦組み文書で当たり前だった「縦中横」を、Webでも当たり前にするためのnpmパッケージをリリースしました
excerpt: 新聞や書籍の縦組みで自然に馴染んでいる「縦中横」。でもWebでは、半角英数字を一つずつ手作業で span タグで囲むしかありませんでした。Love-Roxチームは、この繰り返しを消し去るためのnpmパッケージ tate-chu-yoko をリリースしました。
---

# tate-chu-yoko リリース - Webの縦書きに、縦中横の手触りを

**tate-chu-yoko** を本日 npm に公開しました ✨

Love-Roxチームが新しく手がけた、日本語の縦組み組版のためのライブラリです。`@love-rox/tcy-core` / `@love-rox/tcy-react` / `@love-rox/tcy-vue` の3つのパッケージとして配布しています。

- 📦 npm: [@love-rox/tcy-react](https://www.npmjs.com/package/@love-rox/tcy-react)
- 💾 GitHub: [Love-Rox/tate-chu-yoko](https://github.com/Love-Rox/tate-chu-yoko)
- 🎨 パッケージ紹介: [/packages/tate-chu-yoko](/ja/packages/tate-chu-yoko)
- 🖋️ 実際に触れるデモ: [/packages/tate-chu-yoko/demo](/ja/packages/tate-chu-yoko/demo)

## 縦中横（たてちゅうよこ）とは

「縦中横」は、縦組みの本文の中に半角の英数字や短い単語を**横向きのまま正立させて組む**技法です。新聞のテレビ欄や文庫本の注釈で、「2026年4月19日」の「2026」や「4」や「19」が、90°倒れずに横並びで綺麗に収まっている、あれです。

縦書きは、世界の文字文化の中でもいまなお日常の読書に使われている稀有な組版です。日本・中国・韓国の書物、日本の新聞・小説・漫画——そこには長い時間をかけて磨かれてきた読みやすさの作法があり、縦中横はその細部のひとつです。

## なぜ作ったのか

### Webの縦書きは、あと少しで「普通」になれる

CSS には `writing-mode: vertical-rl` があり、モダンブラウザでひととおり動きます。仕様上は、縦組みの中で半角英数字を正しく組むための `text-combine-upright: all` も用意されています。つまり**ブラウザ側のピースは揃っている**んです。

ところが、実際に縦書きで文章を書こうとするとつまずきます。`text-combine-upright` は「どの文字範囲に適用するか」を開発者が決めて、手で要素に包む必要があります。つまり、書き手が原稿の中で毎回こう書くことになります。

```html
第<span class="tcy">1</span>章 <span class="tcy">2026</span>年<span class="tcy">4</span>月
```

これは、文章を書く人の仕事ではありません。**組版の都合を書き手に押し付けてしまっている**状態です。

### 書き手に、組版の都合を押し付けたくない

Love-Rox は ActivityPub のソーシャルプラットフォーム Rox を作っているチームです。そこで繰り返し大事にしているのが「人が書く場所を、できるかぎり自然にする」という考え方でした。絵文字ピッカーを滑らかにしたり、Markdown の書きやすさを守ったり——ユーザーが**内容そのものに集中できる時間**を、技術の側で広げていきたいと思っています。

縦中横も同じです。

CMS を通して書かれる記事、Markdown で管理されるドキュメント、ユーザーが投稿する文章。そのすべての場面で `<span class="tcy">` を書き手が意識するのは、あまりにもつらい。「半角英数字の向きは後からライブラリに任せればいい」——そう言える仕組みが欲しかった。それが **tate-chu-yoko** です。

### 日本発の技術を、また一つ

Rox の [開発哲学](/ja/blog/development-philosophy) で書いたとおり、私たちは「日本発の技術」にこだわっています。Daishi Kato さんの Waku / Jotai、Yusuke Wada さんの Hono — こうした素晴らしいプロジェクトの流れに、組版という切り口で、ささやかに連なれたら、と思っています。

縦組みを扱う優れたライブラリは既にいくつも世に出ています。その蓄積には心から敬意を表しつつ、**「React / Vue で最小 API で使える、SSR-safe で決定性のあるもの」**を選択肢として増やすことが、今回の私たちの役割だと考えました。

## どうやって作ったか

tate-chu-yoko は、**核となるトークナイザー** + **薄いフレームワークアダプタ** という構成にしています。

```
@love-rox/tcy-core    ← フレームワーク非依存のトークナイザ（決定性出力）
    ↓
@love-rox/tcy-react   ← React 向け <Tcy> コンポーネント
@love-rox/tcy-vue     ← Vue 3 向け <Tcy> コンポーネント
```

### 設計で大事にしたこと

- **決定性 (determinism)**: 同じ入力からは常に同じ DOM を吐く。SSR と CSR で差異が出ない。
- **ネストを透過的に扱う**: `<strong>` や `<em>` のような子要素を挟んでも、その内側まで見にいきます。ただし、要素境界をまたいで文字列を連結はしません（`<em>12</em>34` は 2 つの span になる）。
- **全角英数字はそのまま**: `Ａ` や `１` は縦組みでも既に正立しているので、触らない。
- **小さな API**: `target` / `combine` / `include` / `exclude` の 4 つだけ。迷う余地を減らす。

## 使ってみる

React での最小例はこれだけです。

```tsx
import { Tcy } from "@love-rox/tcy-react";

export function Chapter() {
  return (
    <p style={{ writingMode: "vertical-rl" }}>
      <Tcy>第1章 2026年4月、Webの縦書きは進化した。</Tcy>
    </p>
  );
}
```

レンダリング結果:

```html
第<span class="tcy">1</span>章 <span class="tcy">2026</span>年<span class="tcy">4</span
>月、Webの縦書きは進化した。
```

あとは CSS を 1 ブロック足すだけです。

```css
.tcy {
  -webkit-text-combine: horizontal;
  text-combine-upright: all;
}
```

書き手は今までどおり「第1章 2026年4月」と書けばよい。後は自動です。

もっと詳しい API や挙動は、[パッケージ紹介ページ](/ja/packages/tate-chu-yoko) と [実際に挙動を確認できるデモ](/ja/packages/tate-chu-yoko/demo) を見てください。

## これから

tate-chu-yoko はまだ 0.1 系、生まれたばかりのライブラリです。これから先、こんなことを考えています。

- **対応フレームワークの拡充** — Svelte / Solid / Astro などへの薄いアダプタを追加するか検討中です。
- **文字クラスの整理** — 欧文欧数字だけでなく、どこまでを「縦中横にすべき範囲」として既定に入れるか、実際の書き手フィードバックを重ねていきたいです。
- **句読点・約物のケア** — 縦組み特有の調整（全角カンマ・ダッシュ・括弧類の配置）を、隣接ライブラリと組み合わせて無理なく使えるレシピをまとめたい。

そして何より、**実際に縦書きで文章を届けている書き手の方々のフィードバック**が欲しいです。「この組版ではこう組むのが自然」という現場の肌感覚は、私たちだけでは辿り着けません。

[GitHub Issues](https://github.com/Love-Rox/tate-chu-yoko/issues) でお待ちしています。縦組みの Web、一緒に気持ちのいい場所にしていきましょう。

**愛がロックする。Rox。**
