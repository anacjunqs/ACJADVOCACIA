import { PENDING_SOURCE } from "@/lib/pending";

/**
 * Transforma um texto com itens separados por ponto e vírgula em lista.
 * Mantém marcadores [REVISAR]/[PREENCHER] no último item.
 * Ex.: "Casais que casam; famílias com filhos." → ["Casais que casam.", "Famílias com filhos."]
 */
export function toList(text: string): string[] {
  const re = new RegExp(`\\s*(${PENDING_SOURCE})\\s*$`);
  const tagMatch = re.exec(text);
  const tag = tagMatch?.[1];
  const body = tag ? text.slice(0, tagMatch.index) : text;
  const items = body
    .split(/\s*;\s*/)
    .map((s) => s.trim().replace(/[.]$/, ""))
    .filter(Boolean)
    .map((s) => `${s.charAt(0).toUpperCase()}${s.slice(1)}.`);
  if (tag && items.length > 0) items[items.length - 1] = `${items[items.length - 1]} ${tag}`;
  return items;
}
