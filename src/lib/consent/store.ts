/**
 * Consentimento de cookies e de conteúdo de terceiros.
 * Guardamos apenas a escolha, em um cookie próprio (necessário): nada de rastreadores antes do "sim".
 */
export type Consent = { v: 1; analytics: boolean; media: boolean; ts: number };

export const CONSENT_COOKIE = "acj_consent";
export const CONSENT_MAX_AGE_DAYS = 180;

export function parseConsent(raw: string | undefined | null): Consent | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(decodeURIComponent(raw)) as Partial<Consent>;
    if (o && o.v === 1 && typeof o.analytics === "boolean" && typeof o.media === "boolean") {
      return { v: 1, analytics: o.analytics, media: o.media, ts: typeof o.ts === "number" ? o.ts : 0 };
    }
  } catch {
    /* cookie corrompido: tratamos como "sem escolha" */
  }
  return null;
}

export function serializeConsent(c: Consent): string {
  return `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(c))}`;
}

function readRaw(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.split("; ").find((p) => p.startsWith(`${CONSENT_COOKIE}=`));
  return m ? m.slice(CONSENT_COOKIE.length + 1) : "";
}

let cache: { raw: string; value: Consent | null } = { raw: "", value: null };
const listeners = new Set<() => void>();

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Leitura estável: devolve o mesmo objeto enquanto o cookie não muda (exigência do useSyncExternalStore). */
export function getSnapshot(): Consent | null {
  const raw = readRaw();
  if (raw !== cache.raw) cache = { raw, value: parseConsent(raw) };
  return cache.value;
}

export const getServerSnapshot = (): Consent | null => null;

export function saveConsent(choice: { analytics: boolean; media: boolean }): Consent {
  const c: Consent = { v: 1, analytics: choice.analytics, media: choice.media, ts: Date.now() };
  const secure = typeof location !== "undefined" && location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${serializeConsent(c)}; Max-Age=${CONSENT_MAX_AGE_DAYS * 86400}; Path=/; SameSite=Lax${secure}`;
  listeners.forEach((l) => l());
  return c;
}
