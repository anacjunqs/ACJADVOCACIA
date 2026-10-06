import { describe, expect, it } from "vitest";
import { tagsFor } from "@/lib/revalidate-tags";

describe("tags de revalidação (webhook do Sanity)", () => {
  it("mapeia cada tipo de documento para as tags usadas na camada de dados", () => {
    expect(tagsFor({ _type: "siteSettings" })).toEqual(["settings"]);
    expect(tagsFor({ _type: "founder" })).toEqual(["founder"]);
    expect(tagsFor({ _type: "valuesList" })).toEqual(["values"]);
    expect(tagsFor({ _type: "pageTexts" })).toEqual(["pageTexts"]);
    expect(tagsFor({ _type: "pillarContent", pillarId: "alimentos" })).toEqual(["pillars", "pillar:alimentos"]);
    expect(tagsFor({ _type: "legalPage", pageId: "privacy" })).toEqual(["legal", "legal:privacy"]);
    expect(tagsFor({ _type: "article", slug: "meu-artigo" })).toEqual(["articles", "article:meu-artigo"]);
    expect(tagsFor({ _type: "video" })).toContain("videos");
  });
  it("tipos desconhecidos não revalidam nada", () => {
    expect(tagsFor({ _type: "outra-coisa" })).toEqual([]);
  });
});
