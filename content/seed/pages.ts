import type { PageTexts } from "../../src/lib/content/types.ts";
import { draft } from "./helpers.ts";

/** Textos de páginas rascunhados a partir do posicionamento fornecido. Todos a revisar. */
export const pageTextsSeed: PageTexts = {
  home: {
    heroTitle: draft(
      "Direito de Família e Sucessões para famílias que vivem entre países",
      "Family and Succession Law for families living between countries",
    ),
    heroSubtitle: draft(
      "Orientação clara, em linguagem simples, para as decisões mais importantes da sua família, no Brasil e no exterior.",
      "Clear guidance, in plain language, for your family's most important decisions, in Brazil and abroad.",
    ),
    hubText: draft(
      "Casamento, filhos, bens e herança em mais de um país exigem atenção a regras diferentes. Reunimos aqui os temas que mais aparecem nessas situações.",
      "Marriage, children, property and inheritance across more than one country call for attention to different rules. Here we bring together the topics that come up most often in these situations.",
    ),
    finalCtaTitle: { pt: "Vamos conversar sobre a sua situação?", en: "Shall we talk about your situation?" },
    finalCtaText: draft(
      "Conte, em poucas linhas, o que está acontecendo. Retornamos para combinar a consulta.",
      "Tell us, in a few lines, what is going on. We will get back to you to arrange the consultation.",
    ),
  },
  areasIndex: {
    intro: draft(
      "Escolha a área que mais se aproxima da sua situação. Se não souber por onde começar, fale com a gente: ajudamos a identificar o caminho.",
      "Choose the area closest to your situation. If you do not know where to start, get in touch: we will help you find the way.",
    ),
  },
  values: {
    intro: draft(
      "Estes são os princípios que orientam o nosso trabalho com as famílias.",
      "These are the principles that guide our work with families.",
    ),
  },
  articles: {
    intro: draft(
      "Textos curtos e claros para entender os principais temas de Direito de Família e Sucessões.",
      "Short, clear texts to understand the main topics in Family and Succession Law.",
    ),
  },
  videos: {
    intro: draft(
      "Vídeos explicativos, em linguagem simples, sobre temas que costumam gerar dúvidas.",
      "Explanatory videos, in plain language, about topics that often raise questions.",
    ),
  },
  contact: {
    intro: draft(
      "Conte, em poucas linhas, o que está acontecendo. Retornamos para combinar a consulta.",
      "Tell us, in a few lines, what is going on. We will get back to you to arrange the consultation.",
    ),
  },
  testimonials: {
    intro: draft(
      "Avaliações de pessoas que usaram os nossos serviços, publicadas no Google.",
      "Reviews from people who used our services, published on Google.",
    ),
  },
};
