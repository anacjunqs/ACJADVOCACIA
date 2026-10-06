import { defineArrayMember, defineField } from "sanity";
import { blockPendingOnPublish } from "../env";
import { valueIconNames } from "@/components/ui/icon";

/** Marcadores de pendência: [PREENCHER: ...] e [REVISAR ...]. */
const PENDING = /\[(?:PREENCHER|REVISAR)[^\]]*\]/;
const PENDING_MESSAGE = "Ainda há um marcador [PREENCHER] ou [REVISAR]. Complete o texto e apague o marcador antes de publicar.";

type Opts = {
  required?: boolean;
  max?: number;
  rows?: number;
  description?: string;
  /** Grupo (aba) do documento onde o campo aparece. */
  group?: string;
};

// O tipo de `Rule` do Sanity é genérico demais para tipar aqui sem ruído; usamos a forma mínima.
type AnyRule = {
  required: () => AnyRule;
  max: (n: number) => AnyRule;
  custom: (fn: (value: unknown) => true | string) => AnyRule;
  warning: (msg?: string) => AnyRule;
  error: (msg?: string) => AnyRule;
};

function pendingText(value: unknown): true | string {
  return typeof value === "string" && PENDING.test(value) ? PENDING_MESSAGE : true;
}

function blocksHavePending(value: unknown): boolean {
  if (!Array.isArray(value)) return false;
  return value.some((b) => {
    const children = (b as { children?: Array<{ text?: string }> }).children;
    return Array.isArray(children) && children.some((c) => typeof c.text === "string" && PENDING.test(c.text));
  });
}

/** Bloqueia (production) ou avisa (outros datasets) quando há marcadores de pendência. */
export function pendingRule(rule: AnyRule): AnyRule {
  const r = rule.custom(pendingText);
  return blockPendingOnPublish ? r : r.warning();
}

export function pendingBlocksRule(rule: AnyRule): AnyRule {
  const r = rule.custom((v) => (blocksHavePending(v) ? PENDING_MESSAGE : true));
  return blockPendingOnPublish ? r : r.warning();
}

/** Campo de texto curto bilíngue: { pt, en }. PT obrigatório quando `required`; EN sempre opcional. */
export function localizedString(name: string, title: string, opts: Opts = {}) {
  const sub = (lang: "pt" | "en", label: string) =>
    defineField({
      name: lang,
      title: label,
      type: "string",
      validation: (Rule) => {
        const rule = Rule as unknown as AnyRule;
        const rules: AnyRule[] = [];
        if (opts.required && lang === "pt") rules.push(rule.required().error("O texto em português é obrigatório."));
        if (opts.max) rules.push(rule.max(opts.max).warning(`Máximo de ${opts.max} caracteres.`));
        rules.push(pendingRule(rule));
        return rules as never;
      },
    });
  return defineField({
    name,
    title,
    type: "object",
    description: opts.description,
    group: opts.group,
    options: { columns: 2 },
    fields: [sub("pt", "Português (Brasil)"), sub("en", "English")],
  });
}

/** Campo de texto longo bilíngue (várias linhas, sem formatação). */
export function localizedText(name: string, title: string, opts: Opts = {}) {
  const sub = (lang: "pt" | "en", label: string) =>
    defineField({
      name: lang,
      title: label,
      type: "text",
      rows: opts.rows ?? 4,
      validation: (Rule) => {
        const rule = Rule as unknown as AnyRule;
        const rules: AnyRule[] = [];
        if (opts.required && lang === "pt") rules.push(rule.required().error("O texto em português é obrigatório."));
        if (opts.max) rules.push(rule.max(opts.max).warning(`Máximo de ${opts.max} caracteres.`));
        rules.push(pendingRule(rule));
        return rules as never;
      },
    });
  return defineField({
    name,
    title,
    type: "object",
    description: opts.description,
    group: opts.group,
    fields: [sub("pt", "Português (Brasil)"), sub("en", "English")],
  });
}

/** Rich text mínimo (parágrafos, títulos, listas, negrito, itálico, links). */
export const richBlock = () =>
  defineArrayMember({
    type: "block",
    styles: [
      { title: "Parágrafo", value: "normal" },
      { title: "Título (H2)", value: "h2" },
      { title: "Subtítulo (H3)", value: "h3" },
      { title: "Citação", value: "blockquote" },
    ],
    lists: [
      { title: "Lista com marcadores", value: "bullet" },
      { title: "Lista numerada", value: "number" },
    ],
    marks: {
      decorators: [
        { title: "Negrito", value: "strong" },
        { title: "Itálico", value: "em" },
      ],
      annotations: [
        {
          name: "link",
          type: "object",
          title: "Link",
          fields: [
            defineField({
              name: "href",
              type: "url",
              title: "Endereço",
              validation: (Rule) => Rule.uri({ scheme: ["http", "https", "mailto", "tel"], allowRelative: true }),
            }),
          ],
        },
      ],
    },
  });

/** Rich text bilíngue: { pt: [blocos], en: [blocos] }. */
export function localizedBlocks(name: string, title: string, opts: Opts = {}) {
  const sub = (lang: "pt" | "en", label: string) =>
    defineField({
      name: lang,
      title: label,
      type: "array",
      of: [richBlock()],
      validation: (Rule) => {
        const rule = Rule as unknown as AnyRule;
        const rules: AnyRule[] = [];
        if (opts.required && lang === "pt") rules.push(rule.required().error("O texto em português é obrigatório."));
        rules.push(pendingBlocksRule(rule));
        return rules as never;
      },
    });
  return defineField({
    name,
    title,
    type: "object",
    description: opts.description,
    fields: [sub("pt", "Português (Brasil)"), sub("en", "English")],
  });
}

/** Imagem com texto alternativo obrigatório (acessibilidade). */
export function imageWithAlt(name: string, title: string, opts: { required?: boolean; description?: string; bilingualAlt?: boolean } = {}) {
  return defineField({
    name,
    title,
    type: "image",
    description: opts.description,
    options: { hotspot: true },
    validation: opts.required ? (Rule) => Rule.required() : undefined,
    fields: [
      opts.bilingualAlt
        ? localizedString("alt", "Texto alternativo (descreva a imagem para quem não a vê)", { required: true, max: 140 })
        : defineField({
            name: "alt",
            title: "Texto alternativo (descreva a imagem para quem não a vê)",
            type: "string",
            validation: (Rule) => Rule.required().error("O texto alternativo é obrigatório.").max(140),
          }),
    ],
  });
}

export const pillarOptions = [
  { title: "Planejamento Patrimonial e Sucessório", value: "planejamento-patrimonial" },
  { title: "Casamento, União Estável e Registro Civil", value: "casamento-uniao" },
  { title: "Divórcio e Partilha", value: "divorcio-partilha" },
  { title: "Filhos, Guarda e Convivência", value: "filhos-guarda" },
  { title: "Alimentos", value: "alimentos" },
  { title: "Filiação", value: "filiacao" },
  { title: "Inventário e Sucessões", value: "inventario-sucessoes" },
  { title: "Famílias entre Países (hub)", value: "hub" },
];

export const valueIconOptions = valueIconNames.map((value) => ({
  value,
  title: (
    {
      heart: "Coração (acolhimento)",
      "shield-check": "Escudo (proteção, segurança)",
      eye: "Olho (transparência)",
      "message-circle": "Conversa (comunicação)",
      users: "Pessoas (família)",
      lock: "Cadeado (sigilo)",
      "book-open": "Livro (conhecimento)",
      compass: "Bússola (orientação)",
      lightbulb: "Lâmpada (clareza)",
      sprout: "Broto (cuidado, crescimento)",
      clock: "Relógio (atenção ao tempo)",
      languages: "Idiomas",
      globe: "Globo (vínculos entre países)",
      house: "Casa",
      route: "Rota (caminho)",
      anchor: "Âncora (estabilidade)",
    } as Record<string, string>
  )[value] ?? value,
}));
