import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://gist.asciidoctor.org",
  base: "/docgist-sandbox",
  output: "static",
  i18n: {
    defaultLocale: "ja",
    locales: ["ja", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ["monaco-editor"],
    },
  },
});