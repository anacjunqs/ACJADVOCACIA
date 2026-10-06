import { describe, expect, it } from "vitest";
import { buildDocs } from "../../scripts/seed-docs";
import { mapFounder, mapLegal, mapPageTexts, mapPillar, mapSettings, mapValues, toImage, toLS } from "@/lib/content/sanity";
import { settingsSeed } from "@content/seed/settings";
import { founderSeed } from "@content/seed/founder";
import { pageTextsSeed } from "@content/seed/pages";
import { pillarContentById } from "@content/seed/pillars";
import { valuesSeed } from "@content/seed/values";
import { legalSeed } from "@content/seed/legal";

const docs = buildDocs();
const doc = (id: string) => docs.find((d) => d._id === id)!;

describe("seed → documento do Sanity → domínio (ida e volta)", () => {
  it("configurações", () => {
    const m = mapSettings(doc("siteSettings"), settingsSeed);
    expect(m.siteName).toEqual(settingsSeed.siteName);
    expect(m.processSteps).toEqual(settingsSeed.processSteps);
    expect(m.oabNotice).toEqual(settingsSeed.oabNotice);
    expect(m.seo.description).toEqual(settingsSeed.seo.description);
  });
  it("fundadora", () => {
    const m = mapFounder(doc("founder"), founderSeed);
    expect(m.name).toBe("Ana Clara Junqueira");
    expect(m.oab).toEqual({ number: "66704", uf: "GO" });
    expect(m.timeline).toEqual(founderSeed.timeline);
  });
  it("valores", () => {
    expect(mapValues(doc("valuesList"))).toEqual(valuesSeed);
  });
  it("textos das páginas", () => {
    expect(mapPageTexts(doc("pageTexts"), pageTextsSeed)).toEqual(pageTextsSeed);
  });
  it("pilares", () => {
    const m = mapPillar(doc("pillarContent-divorcio-partilha"), pillarContentById["divorcio-partilha"]);
    expect(m.faq).toEqual(pillarContentById["divorcio-partilha"].faq);
    expect(m.id).toBe("divorcio-partilha");
  });
  it("páginas legais", () => {
    const m = mapLegal(doc("legalPage-privacy"), legalSeed[0]!);
    expect(m.title).toEqual(legalSeed[0]!.title);
    expect(m.body.pt.length).toBeGreaterThan(0);
  });
});

describe("mapeamento tolerante", () => {
  it("campo bilíngue sem PT é tratado como ausente (cai no seed)", () => {
    expect(toLS({ en: "Only English" })).toBeUndefined();
    expect(toLS({ pt: "Olá", en: "" })).toEqual({ pt: "Olá", en: undefined });
  });

  it("documento parcial usa o seed nos campos obrigatórios", () => {
    const m = mapSettings({ email: "contato@exemplo.com.br", whatsapp: "+55 (62) 90000-0000" }, settingsSeed);
    expect(m.siteName).toEqual(settingsSeed.siteName);
    expect(m.email).toBe("contato@exemplo.com.br");
    expect(m.whatsapp).toBe("5562900000000");
    expect(m.processSteps).toEqual(settingsSeed.processSteps);
  });

  it("imagem do Sanity: URL do CDN com recorte e dimensões finais", () => {
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "abc123";
    const img = toImage({ ref: "image-0123456789abcdef-800x1000-jpg", crop: { top: 0, bottom: 0.1, left: 0, right: 0.5 }, dims: { width: 800, height: 1000 } }, { pt: "Foto", en: "Photo" });
    expect(img?.src).toContain("cdn.sanity.io/images/");
    expect(img?.width).toBe(400);
    expect(img?.height).toBe(900);
    expect(img?.alt.pt).toBe("Foto");
  });

  it("valor com ícone fora da lista fechada usa o padrão", () => {
    const v = mapValues({ values: [{ title: { pt: "A" }, description: { pt: "B" }, icon: "gavel" }] });
    expect(v[0]?.icon).toBe("heart");
  });
});
