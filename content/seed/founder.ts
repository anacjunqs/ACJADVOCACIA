import type { Founder } from "../../src/lib/content/types.ts";
import { draft, fill } from "./helpers.ts";

/**
 * Dados autorizados: nome e OAB. Biografia, formação, trajetória etc. NÃO foram fornecidos:
 * cada seção traz um [PREENCHER] para a fundadora completar no CMS.
 */
export const founderSeed: Founder = {
  name: "Ana Clara Junqueira",
  oab: { number: "66704", uf: "GO" },
  summary: fill("resumo da fundadora em um parágrafo", "founder summary in one paragraph"),
  timeline: [
    {
      year: "[PREENCHER: ano]",
      title: fill("marco da trajetória", "career milestone"),
      description: fill("descrição breve", "short description"),
    },
  ],
  education: [{ title: fill("formação acadêmica", "education") }],
  languages: [{ name: fill("idiomas de atendimento", "languages spoken") }],
  associations: [{ name: fill("associações e entidades", "associations and bodies") }],
  approach: fill("abordagem de trabalho", "working approach"),
  cta: {
    title: { pt: "Vamos conversar sobre a sua situação?", en: "Shall we talk about your situation?" },
    text: draft(
      "Conte, em poucas linhas, o que está acontecendo. Retornamos para combinar a consulta.",
      "Tell us, in a few lines, what is going on. We will get back to you to arrange the consultation.",
    ),
  },
};
