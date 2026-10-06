import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "@/lib/contrast";

const css = readFileSync(new URL("../../src/app/globals.css", import.meta.url), "utf8");
const rootBlock = /:root\s*\{([\s\S]*?)\n\}/.exec(css)?.[1] ?? "";
const tokens: Record<string, string> = {};
for (const m of rootBlock.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)) tokens[m[1]!] = m[2]!;

const t = (name: string): string => {
  const v = tokens[name];
  if (!v) throw new Error(`token ausente: ${name}`);
  return v;
};

describe("tokens da marca", () => {
  it("preserva as três cores fornecidas", () => {
    expect(t("navy-700").toLowerCase()).toBe("#093247");
    expect(t("gold-300").toLowerCase()).toBe("#ebc894");
    expect(t("white").toLowerCase()).toBe("#ffffff");
  });
});

// [texto, fundo, mínimo]. 4,5 = texto normal AA.
const textPairs: Array<[string, string, number]> = [
  ["navy-700", "white", 4.5], // texto principal
  ["navy-700", "gold-50", 4.5], // texto sobre creme
  ["navy-700", "navy-50", 4.5],
  ["navy-600", "white", 4.5], // texto secundário
  ["navy-600", "gold-50", 4.5],
  ["navy-600", "navy-50", 4.5],
  ["white", "navy-700", 4.5], // botão primário e seções navy
  ["white", "navy-800", 4.5],
  ["navy-100", "navy-700", 4.5], // texto secundário sobre navy
  ["navy-100", "navy-800", 4.5],
  ["gold-300", "navy-700", 4.5], // dourado sobre navy
  ["gold-300", "navy-800", 4.5],
  ["navy-700", "gold-300", 4.5], // botão secundário
  ["navy-700", "gold-200", 4.5],
];

describe("contraste WCAG 2.1 AA dos pares de texto", () => {
  for (const [fg, bg, min] of textPairs) {
    it(`${fg} sobre ${bg} ≥ ${min}`, () => {
      expect(contrastRatio(t(fg), t(bg))).toBeGreaterThanOrEqual(min);
    });
  }

  it("confirma por que dourado é proibido como texto sobre claro", () => {
    expect(contrastRatio(t("gold-300"), t("white"))).toBeLessThan(2);
    expect(contrastRatio(t("gold-300"), t("gold-50"))).toBeLessThan(2);
  });

  it("anel de foco: navy sobre claro e dourado sobre navy atingem 3:1 (WCAG 1.4.11)", () => {
    expect(contrastRatio(t("navy-700"), t("white"))).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(t("gold-300"), t("navy-700"))).toBeGreaterThanOrEqual(3);
  });
});
