import * as monaco from "monaco-editor";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";
import { adocToHtml } from "../lib/asciidoc";

import "monaco-editor/min/vs/editor/editor.main.css";

self.MonacoEnvironment = {
  getWorker(_id: string, label: string): Worker {
    if (label === "json") return new jsonWorker();
    if (label === "typescript" || label === "javascript") return new tsWorker();
    return new editorWorker();
  },
};

const STORAGE_KEY = "docgist-playground-source";

const sampleSource = `= DocGist Playground デモ

ここに AsciiDoc を書くと、右側にリアルタイムで変換結果が表示されます。

[NOTE]
====
生成 AI に .adoc で下書きしてもらえば、そのまま変換して検証できます。
====

== 見出し

* 生成 AI と相性のいい構造
* 決定的な変換
* ワンソース多展開

[source,bash]
----
$ asciidoctor my-doc.adoc
----
`;

interface InitOptions {
  editor: string;
  output: string;
  error: string;
  copyBtn: string;
  clearBtn: string;
}

export function mountPlayground(props: InitOptions): void {
  const editorEl = document.getElementById(props.editor);
  const outputEl = document.getElementById(props.output);
  const errorEl = document.getElementById(props.error);
  const copyBtn = document.getElementById(props.copyBtn) as HTMLButtonElement;
  const clearBtn = document.getElementById(props.clearBtn) as HTMLButtonElement;
  if (!editorEl || !outputEl || !errorEl || !copyBtn || !clearBtn) return;

  const copiedLabel = copyBtn.dataset.copiedLabel ?? "Copied!";

  const saved = localStorage.getItem(STORAGE_KEY);
  const initial = saved ?? sampleSource.trim();

  const instance = monaco.editor.create(editorEl, {
    value: initial,
    language: "plaintext",
    theme: "vs-dark",
    fontSize: 14,
    automaticLayout: true,
    minimap: { enabled: false },
    wordWrap: "on",
    padding: { top: 12, bottom: 12 },
  });

  async function render(): Promise<void> {
    const source = instance.getValue();
    localStorage.setItem(STORAGE_KEY, source);
    errorEl.textContent = "";
    try {
      const html = await adocToHtml(source);
      outputEl.innerHTML = html;
    } catch (err) {
      errorEl.textContent =
        "変換エラー: " + (err instanceof Error ? err.message : String(err));
    }
  }

  let debounce: number | undefined;
  instance.onDidChangeModelContent(() => {
    window.clearTimeout(debounce);
    debounce = window.setTimeout(() => void render(), 250);
  });

  copyBtn.addEventListener("click", () => {
    void navigator.clipboard.writeText(instance.getValue());
    const original = copyBtn.textContent;
    copyBtn.textContent = copiedLabel;
    window.setTimeout(() => (copyBtn.textContent = original), 1200);
  });

  clearBtn.addEventListener("click", () => {
    instance.setValue("");
    instance.focus();
  });

  // initial render (wait a tick for Monaco to mount)
  window.setTimeout(() => void render(), 60);
}