import { defineField, defineType } from "sanity";
import { imageWithAlt, pendingRule, pillarOptions } from "./fields";

type AnyRule = Parameters<typeof pendingRule>[0];

export const video = defineType({
  name: "video",
  title: "Vídeo",
  type: "document",
  fields: [
    defineField({
      name: "url",
      title: "Link do vídeo (YouTube ou Vimeo)",
      description: "Cole o endereço do vídeo. Exemplo: https://www.youtube.com/watch?v=...",
      type: "url",
      validation: (Rule) =>
        Rule.required()
          .uri({ scheme: ["https"] })
          .custom((value) =>
            typeof value === "string" && /^https:\/\/((www\.|m\.)?youtube\.com|youtu\.be|(www\.)?youtube-nocookie\.com|(www\.|player\.)?vimeo\.com)\//.test(value)
              ? true
              : "Use um link do YouTube ou do Vimeo.",
          ),
    }),
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (Rule) => [Rule.required(), Rule.max(90).warning("Títulos curtos funcionam melhor (até 90 caracteres)."), pendingRule(Rule as unknown as AnyRule) as never],
    }),
    defineField({
      name: "description",
      title: "Descrição",
      type: "text",
      rows: 3,
      validation: (Rule) => [Rule.required(), Rule.max(300).warning("Até 300 caracteres."), pendingRule(Rule as unknown as AnyRule) as never],
    }),
    defineField({ name: "category", title: "Categoria", type: "reference", to: [{ type: "articleCategory" }], validation: (Rule) => Rule.required() }),
    defineField({
      name: "language",
      title: "Idioma do vídeo",
      type: "string",
      options: { list: [{ title: "Português", value: "pt" }, { title: "English", value: "en" }], layout: "radio" },
      initialValue: "pt",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "pillar", title: "Área de atuação relacionada", type: "string", options: { list: pillarOptions } }),
    defineField({ name: "publishedAt", title: "Data de publicação", type: "datetime", initialValue: () => new Date().toISOString(), validation: (Rule) => Rule.required() }),
    defineField({ name: "durationSeconds", title: "Duração em segundos (opcional)", type: "number", validation: (Rule) => Rule.integer().positive() }),
    imageWithAlt("thumbnail", "Miniatura própria (opcional)", {
      description: "Se vazio, o site usa a miniatura do YouTube. Para Vimeo, a miniatura é buscada automaticamente.",
    }),
  ],
  orderings: [{ title: "Mais recentes", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: { select: { title: "title", subtitle: "language", media: "thumbnail" } },
});
