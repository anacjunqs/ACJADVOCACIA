import { describe, expect, it } from "vitest";
import { buildDocs } from "../../scripts/seed-docs";
import { pillars } from "@content/services";

describe("documentos do seed para o Sanity", () => {
  const docs = buildDocs();

  it("ids únicos e todos com _type", () => {
    expect(new Set(docs.map((d) => d._id)).size).toBe(docs.length);
    for (const d of docs) expect(d._type).toBeTruthy();
  });

  it("cria os singletons, 8 áreas (7 pilares + hub) e 3 páginas legais", () => {
    const types = docs.map((d) => d._type);
    for (const t of ["siteSettings", "founder", "valuesList", "pageTexts"]) expect(types.filter((x) => x === t)).toHaveLength(1);
    expect(types.filter((t) => t === "pillarContent")).toHaveLength(pillars.length + 1);
    expect(types.filter((t) => t === "legalPage")).toHaveLength(3);
  });

  it("artigos e vídeo de exemplo entram como rascunho (máximo de 2 artigos e 1 vídeo)", () => {
    const articles = docs.filter((d) => d._type === "article");
    const videos = docs.filter((d) => d._type === "video");
    expect(articles).toHaveLength(2);
    expect(videos).toHaveLength(1);
    for (const d of [...articles, ...videos]) expect(d._id.startsWith("drafts.")).toBe(true);
  });

  it("arrays têm _key e não há valores indefinidos", () => {
    const json = JSON.stringify(docs);
    expect(json).not.toContain("undefined");
    const values = docs.find((d) => d._type === "valuesList")!.values as Array<{ _key?: string }>;
    expect(values.length).toBeGreaterThanOrEqual(4);
    for (const v of values) expect(v._key).toBeTruthy();
  });

  it("o valuesList respeita o limite de 4 a 8 itens do schema", () => {
    const n = (docs.find((d) => d._type === "valuesList")!.values as unknown[]).length;
    expect(n).toBeGreaterThanOrEqual(4);
    expect(n).toBeLessThanOrEqual(8);
  });
});
