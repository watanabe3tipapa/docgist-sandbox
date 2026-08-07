import * as asciidoctor from "asciidoctor";

export interface AsciidocOptions {
  attributes?: Record<string, string | boolean>;
}

const defaultAttributes: Record<string, string | boolean> = {
  "source-highlighter": "highlight.js",
  icons: "font",
  toc: "left",
};

export async function adocToHtml(
  source: string,
  options: AsciidocOptions = {}
): Promise<string> {
  const attributes = { ...defaultAttributes, ...(options.attributes ?? {}) };
  const html = await asciidoctor.convert(source, { attributes });
  return html.toString();
}

export { asciidoctor };