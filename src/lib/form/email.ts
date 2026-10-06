import { Resend } from "resend";
import { hub, pillars } from "@content/services";
import { countryName } from "@/lib/countries";
import { oneLine, type ContactInput } from "./schema";

export type MailConfig = { apiKey: string; from: string; to: string };

/** Credenciais de envio, só por variáveis de ambiente. Ausentes → o formulário informa que está indisponível. */
export function readMailConfig(env: NodeJS.ProcessEnv = process.env): MailConfig | null {
  const { RESEND_API_KEY: apiKey, CONTACT_FROM_EMAIL: from, CONTACT_TO_EMAIL: to } = env;
  return apiKey && from && to ? { apiKey, from, to } : null;
}

/** O escritório lê as mensagens em português, qualquer que seja o idioma do site. */
export function areaLabelPt(area: ContactInput["area"]): string {
  if (area === "unsure") return "Ainda não sei";
  if (area === "hub") return hub.title.pt;
  return pillars.find((p) => p.id === area)?.title.pt ?? area;
}

export function composeEmail(input: ContactInput, at: Date = new Date()): { subject: string; text: string } {
  const country = `${countryName(input.country, "pt")} (${input.country})`;
  const subject = oneLine(`Contato pelo site: ${input.name} — ${areaLabelPt(input.area)}`).slice(0, 150);
  const text = [
    "Nova mensagem enviada pelo formulário do site.",
    "",
    `Nome: ${input.name}`,
    `E-mail: ${input.email}`,
    `Telefone: +${input.dial} ${input.phone}`,
    `País de residência: ${country}`,
    `Assunto de interesse: ${areaLabelPt(input.area)}`,
    `Idioma do site: ${input.locale === "pt" ? "português" : "inglês"}`,
    `Consentimento (LGPD): concordou com o envio dos dados em ${at.toISOString()}`,
    "",
    "Mensagem:",
    input.message,
    "",
    "—",
    "Esta mensagem não foi guardada em banco de dados. Responder a este e-mail responde à pessoa que escreveu.",
  ].join("\n");
  return { subject, text };
}

/** Envia pelo Resend. Nunca registra o conteúdo da mensagem em logs. */
export async function sendContactEmail(cfg: MailConfig, input: ContactInput): Promise<boolean> {
  const { subject, text } = composeEmail(input);
  try {
    const resend = new Resend(cfg.apiKey);
    const { error } = await resend.emails.send({ from: cfg.from, to: cfg.to, replyTo: input.email, subject, text });
    if (error) {
      console.error("contato: falha no envio", error.name);
      return false;
    }
    return true;
  } catch (e) {
    console.error("contato: erro inesperado no envio", e instanceof Error ? e.name : "desconhecido");
    return false;
  }
}
