"use server";

import { headers } from "next/headers";
import { contactSchema, type FieldKey } from "@/lib/form/schema";
import { verifyToken } from "@/lib/form/token";
import { checkRateLimit, hashIp } from "@/lib/form/ratelimit";
import { readMailConfig, sendContactEmail } from "@/lib/form/email";

export type ContactErrorKey = "tooFast" | "rateLimited" | "generic" | "unavailable";

export type ContactState = {
  status: "idle" | "success" | "error";
  /** Chaves de tradução (contact.errors.*) por campo. */
  fieldErrors?: Partial<Record<FieldKey, string>>;
  formError?: ContactErrorKey;
  /** Valores digitados, para a pessoa não perder o que escreveu quando há erro. */
  values?: Record<string, string>;
};

const FIELDS = ["name", "email", "dial", "phone", "country", "area", "message", "consent", "locale"] as const;

/**
 * Envio do formulário de contato: apenas envia um e-mail, sem gravar nada em banco.
 * Barreiras: honeypot, tempo mínimo de preenchimento (token assinado), validação com zod e limite por IP.
 */
export async function submitContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values: Record<string, string> = {};
  for (const f of FIELDS) values[f] = String(formData.get(f) ?? "");

  // 1) Honeypot: robôs preenchem; fingimos sucesso para não dar pista.
  if (String(formData.get("website") ?? "").trim() !== "") return { status: "success" };

  // 2) Sem credenciais (e-mail e segredo), o envio não está disponível.
  const secret = process.env.CONTACT_FORM_SECRET;
  const mail = readMailConfig();
  if (!secret || !mail) return { status: "error", formError: "unavailable", values };

  // 3) Tempo mínimo de preenchimento e validade do token.
  const token = verifyToken(secret, String(formData.get("t") ?? ""));
  if (token !== "ok") return { status: "error", formError: "tooFast", values };

  // 4) Validação (autoridade no servidor).
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<FieldKey, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as FieldKey | undefined;
      if (key && !fieldErrors[key]) fieldErrors[key] = String(issue.message);
    }
    return { status: "error", fieldErrors, values };
  }

  // 5) Limite por IP (só conta envios válidos: corrigir um erro de digitação não gasta a cota).
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "desconhecido";
  const limit = checkRateLimit(hashIp(ip, secret));
  if (!limit.allowed) return { status: "error", formError: "rateLimited", values };

  // 6) Envio.
  const sent = await sendContactEmail(mail, parsed.data);
  return sent ? { status: "success" } : { status: "error", formError: "generic", values };
}
