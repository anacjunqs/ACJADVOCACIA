import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { auditSeed, notices, renderMarkdown, scan } from "../../scripts/lib/audit";

const run = (env: Record<string, string>) => {
  // Parte do ambiente atual, sem as variáveis que mudam o comportamento da trava.
  const base = { ...process.env };
  for (const k of ["NEXT_PUBLIC_SITE_INDEXABLE", "SKIP_LAUNCH_GATE", "NEXT_PUBLIC_SANITY_PROJECT_ID"]) delete base[k];
  return spawnSync("node", ["scripts/launch-gate.ts"], { cwd: new URL("../..", import.meta.url).pathname, env: { ...base, ...env }, encoding: "utf8" });
};

describe("trava de lançamento", () => {
  it("não interfere enquanto o site não é indexável (build normal)", () => {
    expect(run({}).status).toBe(0);
    expect(run({ NEXT_PUBLIC_SITE_INDEXABLE: "false" }).status).toBe(0);
  });

  it("bloqueia o build com NEXT_PUBLIC_SITE_INDEXABLE=true enquanto houver pendências, e diz o que falta", () => {
    const r = run({ NEXT_PUBLIC_SITE_INDEXABLE: "true" });
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("Trava de lançamento");
    expect(r.stderr).toMatch(/\[PREENCHER\]|\[REVISAR\]|\[VAZIO\]/);
  });

  it("SKIP_LAUNCH_GATE libera (uso interno de testes e medições)", () => {
    expect(run({ NEXT_PUBLIC_SITE_INDEXABLE: "true", SKIP_LAUNCH_GATE: "true" }).status).toBe(0);
  });
});

describe("auditoria de pendências", () => {
  it("acha marcadores, ignora campos técnicos e informa o tipo", () => {
    const f = scan("Página", "Campo", { a: "Texto [REVISAR JURIDICAMENTE]", b: "[PREENCHER: endereço]", icon: "[PREENCHER: x]", c: "limpo" });
    expect(f.map((x) => x.kind).sort()).toEqual(["PREENCHER", "REVISAR"]);
    expect(f.find((x) => x.kind === "REVISAR")?.excerpt).toBe("Texto");
  });

  it("o seed tem pendências em todas as páginas de conteúdo e campos obrigatórios vazios", () => {
    const findings = auditSeed();
    const pages = new Set(findings.map((f) => f.page));
    for (const p of ["Início", "Sobre a Fundadora", "Contato", "Política de Privacidade", "Termos de Uso", "Cookies", "Famílias entre Países"]) {
      expect([...pages].some((x) => x.includes(p)), p).toBe(true);
    }
    expect(findings.some((f) => f.kind === "VAZIO")).toBe(true);
  });

  it("o relatório lista os totais e as conferências manuais", () => {
    const md = renderMarkdown(auditSeed(), notices(), "teste");
    expect(md).toContain("# Pendências antes do lançamento");
    expect(md).toContain("Conferências manuais");
    expect(md).toContain("patrimônio elevado");
  });
});
