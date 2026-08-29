export function parseFrontmatter(raw: string): {
  meta: Record<string, string>;
  body: string;
};
