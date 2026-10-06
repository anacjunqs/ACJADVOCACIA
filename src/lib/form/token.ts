import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Token de "tempo mínimo de preenchimento": o navegador busca um token assinado ao abrir a página e o devolve no envio.
 * O servidor confere a assinatura e a idade. Sem cookies, sem banco de dados.
 */
export const MIN_FILL_MS = 3_000;
export const MAX_AGE_MS = 2 * 60 * 60 * 1000;

const sign = (secret: string, ts: string) => createHmac("sha256", secret).update(`acj-form:${ts}`).digest("hex");

export function createToken(secret: string, now = Date.now()): string {
  const ts = String(now);
  return `${ts}.${sign(secret, ts)}`;
}

export type TokenCheck = "ok" | "missing" | "invalid" | "too-fast" | "expired";

export function verifyToken(secret: string, token: string | null | undefined, now = Date.now()): TokenCheck {
  if (!token) return "missing";
  const [ts, sig] = token.split(".");
  if (!ts || !sig || !/^\d{10,16}$/.test(ts)) return "invalid";
  const expected = sign(secret, ts);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return "invalid";
  const age = now - Number(ts);
  if (age < MIN_FILL_MS) return "too-fast";
  if (age > MAX_AGE_MS) return "expired";
  return "ok";
}
