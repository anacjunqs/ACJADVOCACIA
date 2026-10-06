/** Marcadores de pendência: [PREENCHER: ...] e [REVISAR JURIDICAMENTE] (ou [REVISAR]). */
export const PENDING_SOURCE = String.raw`\[(?:PREENCHER|REVISAR)[^\]]*\]`;

export const hasPending = (text: string): boolean => new RegExp(PENDING_SOURCE).test(text);

export function splitPending(text: string): Array<{ text: string; pending: boolean }> {
  const re = new RegExp(PENDING_SOURCE, "g");
  const out: Array<{ text: string; pending: boolean }> = [];
  let last = 0;
  for (const m of text.matchAll(re)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ text: text.slice(last, i), pending: false });
    out.push({ text: m[0], pending: true });
    last = i + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), pending: false });
  return out;
}

/** Remove marcadores (uso: metadados e JSON-LD, que nunca devem carregar pendências). */
export const stripPending = (text: string): string => text.replace(new RegExp(PENDING_SOURCE, "g"), "").replace(/\s{2,}/g, " ").trim();
