import { defineArrayMember, defineField, defineType } from "sanity";
import { localizedString, localizedText } from "./fields";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Configurações do escritório",
  type: "document",
  groups: [
    { name: "brand", title: "Marca e rodapé", default: true },
    { name: "contact", title: "Contato e atendimento" },
    { name: "process", title: "Como funciona o atendimento" },
    { name: "legal", title: "Avisos" },
  ],
  fields: [
    localizedString("siteName", "Nome do escritório", { required: true, max: 60, group: "brand" }),
    defineField({
      name: "logo",
      title: "Logotipo (SVG)",
      type: "image",
      description: "Opcional. Enquanto não houver logotipo, o site mostra o nome do escritório em tipografia.",
      group: "brand",
    }),
    localizedText("footerText", "Texto do rodapé", { required: true, max: 160, rows: 2, group: "brand" }),
    localizedText("seoDescription", "Descrição padrão para buscadores", {
      required: true,
      max: 160,
      rows: 3,
      description: "Aparece nos resultados de busca quando a página não tem descrição própria.",
      group: "brand",
    }),

    defineField({ name: "email", title: "E-mail de contato (exibido no site)", type: "string", group: "contact", validation: (Rule) => Rule.email() }),
    defineField({ name: "phone", title: "Telefone (exibido no site)", type: "string", group: "contact" }),
    defineField({
      name: "whatsapp",
      title: "WhatsApp (somente números, com código do país e DDD)",
      description: "Exemplo: 5562900000000",
      type: "string",
      group: "contact",
      validation: (Rule) => Rule.regex(/^\d{10,15}$/, { name: "número", invert: false }).error("Use somente números, com o código do país e o DDD."),
    }),
    localizedText("whatsappMessage", "Mensagem pré-preenchida do WhatsApp", { required: true, max: 200, rows: 2, group: "contact" }),
    defineField({
      name: "address",
      title: "Endereço",
      type: "object",
      group: "contact",
      fields: [
        localizedText("text", "Endereço completo", { rows: 3 }),
        defineField({ name: "mapQuery", title: "Endereço para o mapa (como no Google Maps)", type: "string" }),
      ],
    }),
    localizedText("hours", "Horário de atendimento (inclua o fuso)", { rows: 2, group: "contact", description: "Exemplo: Segunda a sexta, 9h às 18h (horário de Brasília)" }),
    defineField({ name: "timezone", title: "Fuso horário (técnico)", description: "Exemplo: America/Sao_Paulo", type: "string", group: "contact" }),
    localizedText("videoconference", "Atendimento por videoconferência", { rows: 2, group: "contact" }),
    defineField({
      name: "social",
      title: "Redes sociais",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Nome da rede", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "url", title: "Endereço (link)", type: "url", validation: (Rule) => Rule.required().uri({ scheme: ["https"] }) }),
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        }),
      ],
    }),
    defineField({
      name: "googlePlaceId",
      title: "Place ID do Google (reserva)",
      description: "A variável de ambiente GOOGLE_PLACE_ID tem prioridade. Só é usado quando as avaliações estão ativas.",
      type: "string",
      group: "contact",
    }),

    defineField({
      name: "processSteps",
      title: "Etapas do atendimento (3 a 4)",
      type: "array",
      group: "process",
      validation: (Rule) => Rule.min(3).max(4),
      of: [
        defineArrayMember({
          type: "object",
          fields: [localizedString("title", "Título da etapa", { required: true, max: 50 }), localizedText("text", "Descrição", { required: true, max: 240, rows: 3 })],
          preview: { select: { title: "title.pt", subtitle: "text.pt" } },
        }),
      ],
    }),

    localizedText("oabNotice", "Aviso OAB (rodapé)", { required: true, rows: 4, group: "legal" }),
    localizedText("jurisdictionNotice", "Aviso de jurisdição (temas internacionais)", {
      required: true,
      rows: 4,
      group: "legal",
      description: "Mostrado nos blocos de atuação internacional e no hub Famílias entre Países.",
    }),
  ],
  preview: { prepare: () => ({ title: "Configurações do escritório" }) },
});
