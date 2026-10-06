import { describe, expect, it } from "vitest";
import pt from "@messages/pt.json";
import en from "@messages/en.json";
import { hub, pillars } from "@content/services";
import { routing } from "@/lib/i18n/routing";
import { alternateRoute } from "@/lib/i18n/alternates";
import { pick } from "@/lib/i18n/localize";
import { hasPending, splitPending, stripPending } from "@/lib/pending";

function flatten(obj: unknown, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "string") out[key] = v;
    else Object.assign(out, flatten(v, key));
  }
  return out;
}

describe("mensagens de interface", () => {
  const a = flatten(pt);
  const b = flatten(en);

  it("PT e EN têm exatamente as mesmas chaves", () => {
    expect(Object.keys(b).sort()).toEqual(Object.keys(a).sort());
  });

  it("nenhuma mensagem está vazia", () => {
    for (const [k, v] of Object.entries({ ...a })) expect(v.trim(), `pt:${k}`).not.toBe("");
    for (const [k, v] of Object.entries({ ...b })) expect(v.trim(), `en:${k}`).not.toBe("");
  });

  it("os mesmos placeholders {x} existem nos dois idiomas", () => {
    const ph = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");
    for (const k of Object.keys(a)) expect(ph(b[k]!), k).toBe(ph(a[k]!));
  });
});

describe("rotas localizadas", () => {
  it("o slug do hub vem de content/services.ts", () => {
    const p = routing.pathnames["/hub"] as { pt: string; en: string };
    expect(p.pt).toBe(`/${hub.path.pt}`);
    expect(p.en).toBe(`/${hub.path.en}`);
  });

  it("toda rota tem caminho PT e EN, e os caminhos de cada idioma não se repetem", () => {
    for (const l of ["pt", "en"] as const) {
      const paths = Object.values(routing.pathnames).map((v) => (typeof v === "string" ? v : v[l]));
      expect(new Set(paths).size).toBe(paths.length);
    }
  });
});

describe("seletor de idioma", () => {
  it("traduz o slug do pilar entre idiomas", () => {
    for (const p of pillars) {
      const r = alternateRoute("pt", "en", { pathname: "/areas-de-atuacao/[pillar]", params: { pillar: p.path.pt } });
      expect(r).toEqual({ pathname: "/areas-de-atuacao/[pillar]", params: { pillar: p.path.en } });
    }
  });

  it("slug desconhecido ou artigo cai na listagem", () => {
    expect(alternateRoute("pt", "en", { pathname: "/areas-de-atuacao/[pillar]", params: { pillar: "nao-existe" } })).toEqual({ pathname: "/areas-de-atuacao" });
    expect(alternateRoute("en", "pt", { pathname: "/artigos/[slug]", params: { slug: "x" } })).toEqual({ pathname: "/artigos" });
  });

  it("rotas estáticas mantêm o pathname", () => {
    expect(alternateRoute("pt", "en", { pathname: "/sobre" })).toEqual({ pathname: "/sobre" });
  });
});

describe("texto localizado", () => {
  it("usa o PT marcado quando o EN está vazio", () => {
    expect(pick({ pt: "Olá", en: "  " }, "en")).toEqual({ text: "Olá", lang: "pt" });
    expect(pick({ pt: "Olá" }, "en")).toEqual({ text: "Olá", lang: "pt" });
    expect(pick({ pt: "Olá", en: "Hello" }, "en")).toEqual({ text: "Hello" });
    expect(pick({ pt: "Olá", en: "Hello" }, "pt")).toEqual({ text: "Olá" });
  });
});

describe("marcadores de pendência", () => {
  it("detecta, separa e remove [PREENCHER] e [REVISAR]", () => {
    const s = "Texto [REVISAR JURIDICAMENTE] e [PREENCHER: endereço] fim";
    expect(hasPending(s)).toBe(true);
    expect(hasPending("Texto limpo")).toBe(false);
    expect(splitPending(s).filter((p) => p.pending).map((p) => p.text)).toEqual(["[REVISAR JURIDICAMENTE]", "[PREENCHER: endereço]"]);
    expect(stripPending(s)).toBe("Texto e fim");
  });
});
