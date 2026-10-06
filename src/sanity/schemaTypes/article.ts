import { defineField, defineType } from "sanity";
import { apiVersion } from "../env";
import { imageWithAlt, pendingBlocksRule, pendingRule, pillarOptions, richBlock } from "./fields";

type AnyRule = Parameters<typeof pendingRule>[0];

export const article = defineType({
  name: "article",
  title: "Artigo",
  type: "document",
  groups: [
    { name: "content", title: "Conteúdo", default: true },
    { name: "links", title: "Ligações" },
    { name: "seo", title: "Buscadores e redes sociais" },
  ],
  fields: [
    defineField({
      name: "language",
      title: "Idioma do artigo",
      type: "string",
      group: "content",
      options: { list: [{ title: "Português", value: "pt" }, { title: "English", value: "en" }], layout: "radio" },
      initialValue: "pt",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      group: "content",
      validation: (Rule) => [Rule.required(), Rule.max(90).warning("Títulos curtos funcionam melhor (até 90 caracteres)."), pendingRule(Rule as unknown as AnyRule) as never],
    }),
    defineField({
      name: "slug",
      title: "Endereço (slug)",
      type: "slug",
      group: "content",
      options: {
        source: "title",
        maxLength: 80,
        isUnique: async (slug, context) => {
          const { document, getClient } = context;
          const client = getClient({ apiVersion });
          const id = (document?._id ?? "").replace(/^drafts\./, "");
          const params = { draft: `drafts.${id}`, published: id, slug, lang: document?.language };
          const query = `!defined(*[_type == "article" && !(_id in [$draft, $published]) && slug.current == $slug && language == $lang][0]._id)`;
          return client.fetch(query, params);
        },
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Resumo (aparece na listagem e nos buscadores)",
      type: "text",
      rows: 3,
      group: "content",
      validation: (Rule) => [Rule.required(), Rule.max(200).warning("Resumos curtos funcionam melhor (até 200 caracteres)."), pendingRule(Rule as unknown as AnyRule) as never],
    }),
    imageWithAlt("cover", "Capa", { description: "Texturas, objetos do dia a dia, mapas e rotas abstratas. Evite banco de imagens genérico, martelo, balança, aperto de mão e fotos de crianças identificáveis." }),
    defineField({
      name: "body",
      title: "Texto",
      type: "array",
      group: "content",
      of: [richBlock(), { type: "articleImage" }, { type: "table" }],
      validation: (Rule) => [Rule.required(), pendingBlocksRule(Rule as unknown as AnyRule) as never],
    }),
    defineField({
      name: "category",
      title: "Categoria",
      type: "reference",
      to: [{ type: "articleCategory" }],
      group: "links",
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: "authorName", title: "Autoria", type: "string", initialValue: "Ana Clara Junqueira", group: "links", validation: (Rule) => Rule.required() }),
    defineField({ name: "publishedAt", title: "Data de publicação", type: "datetime", group: "links", initialValue: () => new Date().toISOString(), validation: (Rule) => Rule.required() }),
    defineField({
      name: "pillar",
      title: "Área de atuação relacionada (gera o link interno)",
      type: "string",
      group: "links",
      options: { list: pillarOptions },
    }),
    defineField({ name: "relatedVideo", title: "Vídeo relacionado (opcional)", type: "reference", to: [{ type: "video" }], group: "links" }),
    defineField({
      name: "translationOf",
      title: "Tradução de (opcional)",
      description: "Se este artigo é a tradução de outro, escolha o artigo original. O site liga os dois com hreflang.",
      type: "reference",
      to: [{ type: "article" }],
      group: "links",
      options: {
        filter: ({ document }) => ({ filter: "_type == 'article' && language != $lang && _id != $id", params: { lang: document?.language ?? "pt", id: document?._id ?? "" } }),
      },
    }),
    defineField({
      name: "seo",
      title: "Buscadores e redes sociais",
      type: "object",
      group: "seo",
      fields: [
        defineField({ name: "title", title: "Título para buscadores (opcional, até 60 caracteres)", type: "string", validation: (Rule) => Rule.max(60).warning() }),
        defineField({ name: "description", title: "Descrição para buscadores (opcional, até 160 caracteres)", type: "text", rows: 3, validation: (Rule) => Rule.max(160).warning() }),
        imageWithAlt("ogImage", "Imagem para compartilhamento (opcional)"),
      ],
    }),
  ],
  orderings: [{ title: "Mais recentes", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", subtitle: "language", media: "cover" },
    prepare: ({ title, subtitle, media }) => ({ title, subtitle: subtitle === "en" ? "English" : "Português", media }),
  },
});
