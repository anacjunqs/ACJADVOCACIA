import { defineField, defineType } from "sanity";
import { localizedBlocks, localizedString } from "./fields";

const legalOptions = [
  { title: "Política de Privacidade", value: "privacy" },
  { title: "Termos de Uso", value: "terms" },
  { title: "Cookies", value: "cookies" },
];

export const legalPage = defineType({
  name: "legalPage",
  title: "Páginas legais",
  type: "document",
  fields: [
    defineField({ name: "pageId", title: "Página", type: "string", readOnly: true, options: { list: legalOptions }, validation: (Rule) => Rule.required() }),
    localizedString("title", "Título", { required: true, max: 80 }),
    defineField({ name: "updatedAt", title: "Última atualização", type: "date" }),
    localizedBlocks("body", "Texto", { required: true }),
  ],
  preview: { select: { title: "pageId" }, prepare: ({ title }) => ({ title: legalOptions.find((o) => o.value === title)?.title ?? String(title) }) },
});
