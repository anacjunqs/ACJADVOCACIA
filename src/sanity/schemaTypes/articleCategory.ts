import { defineField, defineType } from "sanity";
import { localizedString } from "./fields";

export const articleCategory = defineType({
  name: "articleCategory",
  title: "Categoria",
  type: "document",
  fields: [
    localizedString("title", "Nome da categoria", { required: true, max: 40 }),
    defineField({
      name: "slug",
      title: "Identificador (sem acentos ou espaços)",
      type: "slug",
      options: { source: "title.pt", maxLength: 50 },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: { select: { title: "title.pt", subtitle: "slug.current" } },
});
