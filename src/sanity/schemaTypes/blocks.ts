import { defineArrayMember, defineField, defineType } from "sanity";

/** Imagem dentro do texto de um artigo, com texto alternativo obrigatório. */
export const articleImage = defineType({
  name: "articleImage",
  title: "Imagem",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Texto alternativo (descreva a imagem para quem não a vê)",
      type: "string",
      validation: (Rule) => Rule.required().error("O texto alternativo é obrigatório.").max(140),
    }),
    defineField({ name: "caption", title: "Legenda (opcional)", type: "string", validation: (Rule) => Rule.max(160) }),
  ],
  preview: { select: { title: "alt", media: "asset" } },
});

/** Tabela simples: linhas e células de texto. */
export const table = defineType({
  name: "table",
  title: "Tabela",
  type: "object",
  fields: [
    defineField({ name: "caption", title: "Título da tabela (opcional)", type: "string" }),
    defineField({ name: "hasHeader", title: "A primeira linha é o cabeçalho", type: "boolean", initialValue: true }),
    defineField({
      name: "rows",
      title: "Linhas",
      type: "array",
      validation: (Rule) => Rule.required().min(1),
      of: [
        defineArrayMember({
          type: "object",
          name: "tableRow",
          fields: [defineField({ name: "cells", title: "Células (da esquerda para a direita)", type: "array", of: [{ type: "string" }], validation: (Rule) => Rule.required().min(1) })],
          preview: { select: { cells: "cells" }, prepare: ({ cells }) => ({ title: Array.isArray(cells) ? cells.join(" | ") : "" }) },
        }),
      ],
    }),
  ],
  preview: { select: { title: "caption", rows: "rows" }, prepare: ({ title, rows }) => ({ title: title || "Tabela", subtitle: `${Array.isArray(rows) ? rows.length : 0} linhas` }) },
});
