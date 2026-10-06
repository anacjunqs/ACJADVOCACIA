import type { SiteSettings } from "../../src/lib/content/types.ts";
import { draft, fill } from "./helpers.ts";

/**
 * Dados autorizados: nome do escritório. Todo o resto é [PREENCHER] ou rascunho a revisar.
 * Contatos (e-mail, telefone, WhatsApp, endereço, horário, fuso) ficam vazios de propósito:
 * a interface os esconde em produção e a auditoria os lista como pendentes.
 */
export const settingsSeed: SiteSettings = {
  siteName: { pt: "ACJ Advocacia", en: "ACJ Law Firm" },
  whatsappMessage: {
    pt: "Olá! Gostaria de agendar uma consulta com a ACJ Advocacia.",
    en: "Hello! I would like to schedule a consultation with ACJ Law Firm.",
  },
  videoconference: fill("confirmar se há atendimento por videoconferência", "confirm whether video appointments are available"),
  social: [],
  processSteps: [
    {
      title: { pt: "Primeiro contato", en: "First contact" },
      text: draft(
        "Você escreve pelo formulário ou pelo WhatsApp e conta, em poucas linhas, o que está acontecendo. Nesta etapa, não envie documentos nem dados sensíveis.",
        "You write through the form or WhatsApp and tell us, in a few lines, what is going on. At this stage, please do not send documents or sensitive data.",
      ),
    },
    {
      title: { pt: "Consulta agendada", en: "Scheduled consultation" },
      text: draft(
        "Combinamos dia e horário da consulta, no formato que for melhor para você.",
        "We agree on a date and time for the consultation, in the format that works best for you.",
      ),
    },
    {
      title: { pt: "Conversa e orientação", en: "Conversation and guidance" },
      text: draft(
        "Ouvimos a sua história e explicamos, em linguagem simples, quais caminhos existem e o que cada um significa.",
        "We listen to your story and explain, in plain language, which paths exist and what each one means.",
      ),
    },
    {
      title: { pt: "Próximos passos", en: "Next steps" },
      text: draft(
        "Se você decidir seguir, combinamos por escrito como o trabalho será feito. A decisão é sempre sua.",
        "If you decide to move forward, we agree in writing on how the work will be done. The decision is always yours.",
      ),
    },
  ],
  footerText: {
    pt: "Direito de Família e Sucessões para famílias que vivem entre países.",
    en: "Family and Succession Law for families living between countries.",
  },
  oabNotice: draft(
    "Este site tem caráter exclusivamente informativo e não substitui uma consulta jurídica. O conteúdo segue o Código de Ética e Disciplina da OAB e o Provimento 205/2021. Não há promessa de resultado.",
    "This website is for information only and does not replace legal advice. Its content follows the rules of the Brazilian Bar Association (OAB), including Provimento 205/2021. No outcome is promised.",
  ),
  jurisdictionNotice: {
    pt: "Nos temas internacionais, a atuação cobre os aspectos do direito brasileiro, em coordenação com profissionais locais quando necessário. [PREENCHER: onde a fundadora pode exercer a advocacia] [REVISAR JURIDICAMENTE]",
    en: "On international matters, our work covers the aspects of Brazilian law, in coordination with local professionals when necessary. [PREENCHER: where the founder is authorized to practice law] [REVISAR JURIDICAMENTE]",
  },
  seo: {
    description: {
      pt: "Direito de Família e Sucessões para famílias que vivem entre países.",
      en: "Family and Succession Law for families living between countries.",
    },
  },
};
