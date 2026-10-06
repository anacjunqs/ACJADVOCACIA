import { PENDING_SOURCE } from "@/lib/pending";
import { slugify } from "@/lib/slug";
import type { RichBlock } from "@/lib/content/types";

type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type Block = RichBlock & { children?: Array<RichBlock & { text?: string; marks?: string[] }>; style?: string };

const blockText = (b: Block): string => (b.children ?? []).map((c) => (typeof c.text === "string" ? c.text : "")).join("");

export type Heading = { id: string; text: string; level: 2 | 3 };

/** Ids estáveis (por `_key`) para títulos h2/h3, com sufixo numérico quando o texto se repete. */
export function headingIds(blocks: RichBlock[]): Map<string, string> {
  const used = new Map<string, number>();
  const ids = new Map<string, string>();
  blocks.forEach((raw, i) => {
    const b = raw as Block;
    if (b._type !== "block" || (b.style !== "h2" && b.style !== "h3")) return;
    const base = slugify(blockText(b)) || "secao";
    const n = (used.get(base) ?? 0) + 1;
    used.set(base, n);
    ids.set(String(b._key ?? i), n === 1 ? base : `${base}-${n}`);
  });
  return ids;
}

/** Índice automático: títulos h2/h3 do texto. */
export function extractHeadings(blocks: RichBlock[]): Heading[] {
  const ids = headingIds(blocks);
  return blocks.flatMap((raw, i) => {
    const b = raw as Block;
    if (b._type !== "block" || (b.style !== "h2" && b.style !== "h3")) return [];
    const id = ids.get(String(b._key ?? i));
    return id ? [{ id, text: blockText(b), level: b.style === "h2" ? (2 as const) : (3 as const) }] : [];
  });
}

/** Marca trechos [PREENCHER]/[REVISAR] como um "mark" próprio, para serem destacados na tela. */
export function highlightPending(blocks: RichBlock[]): RichBlock[] {
  const re = new RegExp(`(${PENDING_SOURCE})`, "g");
  return blocks.map((raw) => {
    const b = raw as Block;
    if (b._type !== "block" || !b.children) return raw;
    const children: Span[] = b.children.flatMap((c, ci) => {
      const marks = c.marks ?? [];
      const text = typeof c.text === "string" ? c.text : "";
      if (!text || !re.test(text)) {
        re.lastIndex = 0;
        return [{ _type: "span" as const, _key: String(c._key ?? `${b._key}-${ci}`), text, marks }];
      }
      re.lastIndex = 0;
      return text
        .split(re)
        .filter(Boolean)
        .map((part, pi) => ({
          _type: "span" as const,
          _key: `${b._key ?? "b"}-${ci}-${pi}`,
          text: part,
          marks: new RegExp(`^${PENDING_SOURCE}$`).test(part) ? [...marks, "pending"] : marks,
        }));
    });
    return { ...b, children };
  });
}

/** Palavras do texto (para o tempo de leitura). */
export function plainWords(blocks: RichBlock[]): number {
  const text = blocks.map((b) => blockText(b as Block)).join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}
