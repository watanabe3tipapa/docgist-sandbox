# DocGist — 開発メモ

## このサイトの目的
- AsciiDoc(.adoc)という文書形式を紹介・アピールするためのコンテンツサイト。
- 特に「生成AIとの親和性」を主軸に据え、.adoc が AI と共存しやすい形式であることを説明する。
- LP とチュートリアルを GitHub Pages( GitHub Actions 経由)で公開する。

## 技術スタック
- SSG: Astro(Node 一本化)。Bootstrap は使わない。
- .adoc 変換: Asciidoctor.js(npm `asciidoctor`)。ビルド時 + クライアントで共用。
- デザイン: Neo Brutalism(素の CSS / CSS 変数。Tailwind 不使用)。
- エディタ: Monaco Editor(Vite / worker 設定付き)。
- 言語: i18n 両方(JP / EN、Astro の i18n ルーティング)。
- 公開: GitHub Actions → GitHub Pages。CNAME 維持。

## 生成 AI 親和性のストーリー(技術根拠)
- トークン明示性: 見出し(=,==)、テーブル、アドモニション(NOTE:)など構造が明示的。Markdown のような余白依存の曖昧さが少なく、AI 出力が安定しやすい。
- 決定論的変換: asciidoctor が決定的に HTML 化するため、「AI が書いた .adoc → ビルド/プレビュー検証」を自動化できる。
- 1ソース多展開: .adoc → HTML / PDF / スライド(Reveal.js)を一律生成。
- diff 容易: テキストベースで生成物をレビュー・バージョン管理しやすい。

## ページ構成
- `/`  LP(JP)、`/en` LP(EN)
- `what-is-asciidoc`(解説: Admonition, table, include, stem など)
- `/tutorials/*.adoc`(チュートリアル群、ソース⇔HTML タブ切替 + 「Asciidoctor で変換」バッジ)
- `/playground`(左: .adoc エディタ / 右: ライブ変換 HTML)

## 既存アセット再利用
- `gists/*.adoc` を流用: example / codemirror / highlightjs / prettify /
  source-language / tabbed-source / images / includes
- `images/`, `assets/`, `includes/` は `public/` へ移行(必要に応じて)。
- 旧 `asciidoctor-all.min.js` は ESM の `asciidoctor`(npm)へ置換。

## 実装フェーズ
1. 土台: Astro init + i18n + 素の CSS(Neo Brutalism) + pages.yml
2. 変換層: `asciidoctor`(npm)導入、ビルド時/クライアント変換
3. ページ: LP / What is / チュートリアル(変換を明示)
4. Playground: Monaco + ライブ変換 + ローカル保存
5. デプロイ: GitHub Actions → Pages
6. 移行: 旧 index.html / js / style の置換、CNAME 確認

## 注意
- 生成 AI 親和性のストーリーは技術根拠とともに書く。
- 変換実装は Asciidoctor 最新版を「素で使用」のみ(独自改造しない)。