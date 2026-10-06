import { defineArrayMember, defineField, defineType } from "sanity";
import { localizedString, localizedText, valueIconOptions } from "./fields";

export const valuesList = defineType({
  name: "valuesList",
  title: "Nossos Valores",
  type: "document",
  fields: [
    defineField({
      name: "values",
      title: "Valores (de 4 a 8). Arraste para mudar a ordem.",
      type: "array",
      validation: (Rule) => Rule.min(4).max(8).error("Cadastre de 4 a 8 valores."),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            localizedString("title", "Título", { required: true, max: 50 }),
            localizedText("description", "Descrição curta", { required: true, max: 200, rows: 3 }),
            defineField({
              name: "icon",
              title: "Ícone",
              type: "string",
              options: { list: valueIconOptions, layout: "dropdown" },
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: "title.pt", subtitle: "description.pt" } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Nossos Valores" }) },
});
