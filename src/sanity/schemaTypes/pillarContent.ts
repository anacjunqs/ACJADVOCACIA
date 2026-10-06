import { defineArrayMember, defineField, defineType } from "sanity";
import { localizedString, localizedText, pillarOptions } from "./fields";

export const pillarContent = defineType({
  name: "pillarContent",
  title: "Conteúdo das áreas de atuação",
  type: "document",
  fields: [
    defineField({
      name: "pillarId",
      title: "Área",
      type: "string",
      readOnly: true,
      options: { list: pillarOptions },
      validation: (Rule) => Rule.required(),
    }),
    localizedText("intro", "Introdução", { required: true, rows: 6, max: 900 }),
    localizedText("whoFor", "Para quem é (separe os itens com ponto e vírgula)", { required: true, rows: 4, max: 600 }),
    localizedText("whenToSeek", "Quando procurar (separe os itens com ponto e vírgula)", { required: true, rows: 4, max: 600 }),
    localizedText("internationalIntro", "Introdução da atuação internacional", { rows: 3, max: 500 }),
    defineField({
      name: "faq",
      title: "Perguntas frequentes (de 4 a 6)",
      type: "array",
      validation: (Rule) => Rule.min(4).max(6),
      of: [
        defineArrayMember({
          type: "object",
          fields: [localizedString("question", "Pergunta", { required: true, max: 140 }), localizedText("answer", "Resposta", { required: true, rows: 5, max: 700 })],
          preview: { select: { title: "question.pt" } },
        }),
      ],
    }),
    defineField({
      name: "relatedVideo",
      title: "Vídeo relacionado (opcional)",
      type: "reference",
      to: [{ type: "video" }],
    }),
  ],
  preview: { select: { title: "pillarId" }, prepare: ({ title }) => ({ title: pillarOptions.find((o) => o.value === title)?.title ?? String(title) }) },
});
