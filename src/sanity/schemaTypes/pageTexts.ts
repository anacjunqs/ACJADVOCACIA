import { defineField, defineType } from "sanity";
import { localizedString, localizedText } from "./fields";

const intro = (name: string, title: string) =>
  defineField({ name, title, type: "object", fields: [localizedText("intro", "Texto de apresentação", { required: true, max: 300, rows: 3 })] });

export const pageTexts = defineType({
  name: "pageTexts",
  title: "Textos das páginas",
  type: "document",
  fields: [
    defineField({
      name: "home",
      title: "Página inicial",
      type: "object",
      fields: [
        localizedString("heroTitle", "Título principal", { required: true, max: 110 }),
        localizedText("heroSubtitle", "Subtítulo", { required: true, max: 220, rows: 3 }),
        localizedText("hubText", "Destaque: Famílias entre Países", { required: true, max: 260, rows: 3 }),
        localizedString("finalCtaTitle", "Chamada final: título", { required: true, max: 80 }),
        localizedText("finalCtaText", "Chamada final: texto", { required: true, max: 240, rows: 3 }),
      ],
    }),
    intro("areasIndex", "Áreas de Atuação"),
    intro("values", "Nossos Valores"),
    intro("articles", "Artigos"),
    intro("videos", "Vídeos"),
    intro("contact", "Contato"),
    intro("testimonials", "Depoimentos"),
  ],
  preview: { prepare: () => ({ title: "Textos das páginas" }) },
});
