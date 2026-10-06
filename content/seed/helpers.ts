import type { LS } from "../../src/lib/content/types.ts";

/** Marcador de revisão pela advogada, anexado a todo texto rascunhado. */
export const RJ = "[REVISAR JURIDICAMENTE]";

export const withRJ = (text: string): string => `${text} ${RJ}`;

/** Texto bilíngue de rascunho: ambos os idiomas levam o marcador. */
export const draft = (pt: string, en: string): LS => ({ pt: withRJ(pt), en: withRJ(en) });

/** Lacuna a ser preenchida pela fundadora. */
export const fill = (ptWhat: string, enWhat = ptWhat): LS => ({
  pt: `[PREENCHER: ${ptWhat}]`,
  en: `[PREENCHER: ${enWhat}]`,
});

/** Constrói um bloco Portable Text simples (parágrafo). */
export const para = (text: string, key: string) => ({
  _type: "block",
  _key: key,
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: `${key}-s`, text, marks: [] }],
});

export const heading = (text: string, key: string, style: "h2" | "h3" = "h2") => ({
  _type: "block",
  _key: key,
  style,
  markDefs: [],
  children: [{ _type: "span", _key: `${key}-s`, text, marks: [] }],
});
