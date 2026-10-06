import { defineArrayMember, defineField, defineType } from "sanity";
import { imageWithAlt, localizedBlocks, localizedString, localizedText } from "./fields";

const listOf = (name: string, title: string, fields: ReturnType<typeof localizedString>[], previewTitle: string) =>
  defineField({
    name,
    title,
    type: "array",
    of: [defineArrayMember({ type: "object", fields, preview: { select: { title: previewTitle } } })],
  });

export const founder = defineType({
  name: "founder",
  title: "Sobre a Fundadora",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Nome", type: "string", initialValue: "Ana Clara Junqueira", validation: (Rule) => Rule.required() }),
    defineField({
      name: "oabNumber",
      title: "Número da OAB",
      type: "string",
      initialValue: "66704",
      validation: (Rule) => Rule.required().regex(/^\d+$/, { name: "número" }).error("Somente números."),
    }),
    defineField({
      name: "oabUf",
      title: "UF da OAB",
      type: "string",
      initialValue: "GO",
      validation: (Rule) => Rule.required().length(2).uppercase(),
    }),
    imageWithAlt("photo", "Foto", { bilingualAlt: true, description: "Foto real da fundadora." }),
    localizedText("summary", "Resumo (1 parágrafo)", { required: true, max: 600, rows: 5 }),
    localizedBlocks("bio", "Biografia"),
    defineField({
      name: "timeline",
      title: "Trajetória (linha do tempo)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "year", title: "Ano", type: "string", validation: (Rule) => Rule.required().max(20) }),
            localizedString("title", "Título", { required: true, max: 80 }),
            localizedText("description", "Descrição", { max: 300, rows: 3 }),
          ],
          preview: { select: { title: "title.pt", subtitle: "year" } },
        }),
      ],
    }),
    listOf("education", "Formação", [localizedString("title", "Curso ou instituição", { required: true, max: 120 }), localizedString("detail", "Detalhe", { max: 160 })], "title.pt"),
    listOf("languages", "Idiomas", [localizedString("name", "Idioma", { required: true, max: 60 })], "name.pt"),
    listOf("associations", "Associações", [localizedString("name", "Associação ou entidade", { required: true, max: 120 })], "name.pt"),
    localizedText("approach", "Abordagem de trabalho", { max: 700, rows: 5 }),
    defineField({
      name: "quote",
      title: "Citação em destaque (opcional)",
      type: "object",
      fields: [localizedText("text", "Citação", { max: 240, rows: 3 }), localizedString("attribution", "Atribuição", { max: 80 })],
    }),
    defineField({
      name: "cta",
      title: "Chamada para a consulta",
      type: "object",
      fields: [localizedString("title", "Título", { required: true, max: 80 }), localizedText("text", "Texto", { max: 240, rows: 3 })],
    }),
  ],
  preview: { select: { title: "name", media: "photo" } },
});
