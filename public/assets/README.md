# Rox Brand Assets

このディレクトリには、Roxのブランドアセット（ロゴ、アイコンなど）が含まれています。

## ディレクトリ構造

```
assets/
├── logos/
│   ├── svg/          # SVG形式のロゴ
│   └── png/          # PNG形式のロゴ（各種サイズ）
└── brand-kit/        # ブランドガイドラインやその他のアセット
```

## ロゴファイルの命名規則

推奨される命名規則：
- `rox-logo-horizontal.svg` - 横型ロゴ（カラー）
- `rox-logo-horizontal-white.svg` - 横型ロゴ（白）
- `rox-logo-horizontal-black.svg` - 横型ロゴ（黒）
- `rox-logo-icon.svg` - アイコンのみ
- `rox-logo-vertical.svg` - 縦型ロゴ（必要に応じて）

PNG形式の場合：
- `rox-logo-horizontal-512.png` - 512x512px
- `rox-logo-horizontal-1024.png` - 1024x1024px
- など

## 使用方法

これらのアセットは `/assets` ページから一般公開され、ダウンロード可能になります。

## 配置手順

1. ロゴファイルを適切なディレクトリに配置
   - SVGファイル → `logos/svg/`
   - PNGファイル → `logos/png/`
2. ブランドガイドラインなど → `brand-kit/`
3. 配置後、アセットページで自動的に表示されます
