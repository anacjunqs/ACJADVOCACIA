import { describe, expect, it } from "vitest";
import pt from "@messages/pt.json";
import en from "@messages/en.json";
import { services, pillars, groups, hub } from "@content/services";
import { settingsSeed } from "@content/seed/settings";
import { founderSeed } from "@content/seed/founder";
import { pageTextsSeed } from "@content/seed/pages";
import { pillarContentSeed } from "@content/seed/pillars";
import { collectStrings, findForbidden } from "@/lib/forbidden-words";

// Campos técnicos que não são texto de site (ex.: ícones, slugs, URLs).
const skipPath = /(^|\.)(icon|slug|url|id|path|group|pillar|international|key|_type|_key|style)(\.|\[|$)/;

function violations(name: string, data: unknown) {
  return collectStrings(data)
    .filter((s) => !skipPath.test(s.path))
    .flatMap((s) => findForbidden(s.text).map((v) => `${name}:${s.path} → ${v.label}: "${v.excerpt}"`));
}

describe("palavras proibidas", () => {
  it("nenhum texto do site contém termos proibidos", () => {
    const all = [
      ...violations("messages.pt", pt),
      ...violations("messages.en", en),
      ...violations("settings", settingsSeed),
      ...violations("founder", founderSeed),
      ...violations("pages", pageTextsSeed),
      ...violations("pillars", pillarContentSeed),
      ...violations("services.titles", services.map((s) => ({ title: s.title, summary: s.summary }))),
      ...violations("services.groups", Object.values(groups).map((g) => g.title)),
      ...violations("services.pillars", pillars.map((p) => ({ title: p.title, summary: p.summary }))),
      ...violations("hub", hub),
    ];
    expect(all).toEqual([]);
  });

  it("o detector pega os termos que deve pegar", () => {
    for (const bad of ["serviço premium", "atendimento exclusivo", "o melhor escritório", "resultado garantido", "100% de êxito", "consulta gratuita", "com desconto", "o valor dos honorários"]) {
      expect(findForbidden(bad).length, bad).toBeGreaterThan(0);
    }
    for (const ok of ["Nossos Valores", "bem-estar da criança", "Our Values"]) {
      expect(findForbidden(ok), ok).toEqual([]);
    }
  });
});

describe("rascunhos de pilares e hub", () => {
  const JURISDICTION = "Nossa atuação cobre os aspectos do direito brasileiro, em coordenação com profissionais locais quando necessário.";

  it("há conteúdo para os 7 pilares e para o hub", () => {
    expect(pillarContentSeed.map((p) => p.id).sort()).toEqual([...pillars.map((p) => p.id), "hub"].sort());
  });

  it("cada FAQ tem de 4 a 6 perguntas", () => {
    for (const p of pillarContentSeed) {
      expect(p.faq.length, p.id).toBeGreaterThanOrEqual(4);
      expect(p.faq.length, p.id).toBeLessThanOrEqual(6);
    }
  });

  it("todo texto rascunhado leva [REVISAR JURIDICAMENTE] nos dois idiomas, e o EN existe", () => {
    for (const p of pillarContentSeed) {
      const texts = [p.intro, p.whoFor, p.whenToSeek, p.internationalIntro, ...p.faq.map((f) => f.answer)].filter(Boolean);
      for (const t of texts) {
        expect(t!.pt, `${p.id} pt`).toContain("[REVISAR JURIDICAMENTE]");
        expect(t!.en?.trim(), `${p.id} en`).toBeTruthy();
        expect(t!.en, `${p.id} en`).toContain("[REVISAR JURIDICAMENTE]");
      }
      for (const f of p.faq) {
        expect(f.question.pt.trim()).not.toBe("");
        expect(f.question.en?.trim()).toBeTruthy();
      }
    }
  });

  it("não cita artigos de lei, prazos, valores ou percentuais", () => {
    const re = /\bart(?:igo)?s?\.?\s*\d|\blei\s+n?[º°.]?\s*\d|\b\d+\s+(?:dias?|meses|anos?|days?|months?|years?)\b|R\$|\d\s?%/i;
    const hits = collectStrings(pillarContentSeed)
      .filter((s) => !skipPath.test(s.path))
      .filter((s) => re.test(s.text.replace("Convenção da Haia de 1980", "").replace("1980 Hague Convention", "")))
      .map((s) => `${s.path}: ${s.text.slice(0, 80)}`);
    expect(hits).toEqual([]);
  });

  it("temas internacionais repetem a regra de jurisdição", () => {
    for (const p of pillarContentSeed) {
      expect(p.internationalIntro?.pt ?? "", p.id).toContain(JURISDICTION);
    }
  });

  it("textos explicam termos jurídicos na primeira ocorrência (amostra)", () => {
    const get = (id: string) => pillarContentSeed.find((p) => p.id === id)!.intro.pt;
    expect(get("inventario-sucessoes")).toMatch(/herdeiros são as pessoas/i);
    expect(get("casamento-uniao")).toMatch(/regime de bens é o conjunto de regras/i);
    expect(get("divorcio-partilha")).toMatch(/partilha é a divisão/i);
  });
});
