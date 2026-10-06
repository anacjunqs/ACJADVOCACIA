/** Constantes do formulário, sem dependências: podem ir para o navegador sem levar o zod junto. */
export const AREA_VALUES = [
  "planejamento-patrimonial",
  "casamento-uniao",
  "divorcio-partilha",
  "filhos-guarda",
  "alimentos",
  "filiacao",
  "inventario-sucessoes",
  "hub",
  "unsure",
] as const;
export type AreaValue = (typeof AREA_VALUES)[number];

export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 3000;
