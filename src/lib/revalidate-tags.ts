export type RevalidatePayload = { _type?: string; slug?: string | null; language?: string | null; pillarId?: string | null; pageId?: string | null };

/** Tags de cache afetadas por cada tipo de documento (as mesmas usadas em src/lib/content). */
export function tagsFor(p: RevalidatePayload): string[] {
  switch (p._type) {
    case "siteSettings":
      return ["settings"];
    case "founder":
      return ["founder"];
    case "valuesList":
      return ["values"];
    case "pageTexts":
      return ["pageTexts"];
    case "pillarContent":
      return ["pillars", ...(p.pillarId ? [`pillar:${p.pillarId}`] : [])];
    case "legalPage":
      return ["legal", ...(p.pageId ? [`legal:${p.pageId}`] : [])];
    case "article":
      return ["articles", ...(p.slug ? [`article:${p.slug}`] : [])];
    case "articleCategory":
      return ["articles", "videos", "categories"];
    case "video":
      return ["videos", "articles", "pillars"];
    default:
      return [];
  }
}
