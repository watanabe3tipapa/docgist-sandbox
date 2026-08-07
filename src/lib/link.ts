export const baseUrl = import.meta.env.BASE_URL;

export function link(path: string): string {
  const base = (baseUrl ?? "/").replace(/\/+$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}