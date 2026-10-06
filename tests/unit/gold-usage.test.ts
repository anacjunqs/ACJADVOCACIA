import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const SRC = new URL("../../src", import.meta.url).pathname;

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(tsx?|css)$/.test(f) ? [p] : [];
  });
}

/**
 * Dourado como texto, ícone ou borda funcional é proibido sobre fundo claro (~1,6:1).
 * Utilitários `text-gold*`, `border-gold*`, `stroke-gold*`, `fill-gold*`, `outline-gold*` só podem
 * aparecer em arquivos que declaram `data-gold-ok` (superfície navy garantida), registrados abaixo.
 */
const FORBIDDEN = /\b(?:text|border|stroke|fill|outline|ring|decoration|divide)-gold(?:-\d+)?\b/;
const ALLOWED_FILES = new Set<string>([]);

describe("uso do dourado", () => {
  it("`accent-on-navy` (texto dourado) só aparece em arquivos que também usam uma superfície navy", () => {
    const offenders: string[] = [];
    for (const file of walk(SRC)) {
      if (file.endsWith("globals.css")) continue;
      const src = readFileSync(file, "utf8");
      if (src.includes("accent-on-navy") && !/surface-navy|bg-navy\b/.test(src)) offenders.push(relative(SRC, file));
    }
    expect(offenders).toEqual([]);
  });

  it("não há utilitários de dourado como texto/borda fora da lista permitida", () => {
    const offenders: string[] = [];
    for (const file of walk(SRC)) {
      const rel = relative(SRC, file);
      if (ALLOWED_FILES.has(rel)) continue;
      readFileSync(file, "utf8")
        .split("\n")
        .forEach((line, i) => {
          if (FORBIDDEN.test(line)) offenders.push(`${rel}:${i + 1}: ${line.trim()}`);
        });
    }
    expect(offenders).toEqual([]);
  });
});
