import { createHash } from "node:crypto";

/**
 * Limite de envios por IP, em memória. Vale por instância do servidor: é a segunda barreira.
 * A principal é a regra de rate limit do Firewall da Vercel (ver README). O IP nunca é guardado em claro:
 * guardamos só um hash, que some quando a instância reinicia.
 */
type Rule = { windowMs: number; max: number };
export const RULES: Rule[] = [
  { windowMs: 10 * 60 * 1000, max: 3 },
  { windowMs: 24 * 60 * 60 * 1000, max: 10 },
];

const hits = new Map<string, number[]>();

export function hashIp(ip: string, salt: string): string {
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

/** Registra uma tentativa e informa se passou do limite. */
export function checkRateLimit(key: string, now = Date.now()): { allowed: boolean; retryAfterMs: number } {
  const longest = Math.max(...RULES.map((r) => r.windowMs));
  const list = (hits.get(key) ?? []).filter((t) => now - t < longest);
  for (const rule of RULES) {
    const inWindow = list.filter((t) => now - t < rule.windowMs);
    if (inWindow.length >= rule.max) {
      const oldest = Math.min(...inWindow);
      hits.set(key, list);
      return { allowed: false, retryAfterMs: rule.windowMs - (now - oldest) };
    }
  }
  list.push(now);
  hits.set(key, list);
  // Limpeza simples para o mapa não crescer sem limite.
  if (hits.size > 5000) for (const [k, v] of hits) if (v.every((t) => now - t >= longest)) hits.delete(k);
  return { allowed: true, retryAfterMs: 0 };
}

export function resetRateLimit(): void {
  hits.clear();
}
