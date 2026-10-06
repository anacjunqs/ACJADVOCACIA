/**
 * Termos proibidos no texto do site (Código de Ética da OAB e briefing): superlativos, exclusividade,
 * promessa ou sugestão de resultado, valores, gratuidade e descontos.
 * "Nossos Valores" (seção do menu) e "melhor interesse" (termo jurídico) são permitidos.
 */
const ALLOWED = [/nossos valores/gi, /our values/gi, /\bvalores da\b/gi];

const RULES: Array<{ label: string; re: RegExp }> = [
  { label: "premium", re: /\bpremium\b/i },
  { label: "exclusivo", re: /\bexclusiv[oa]s?\b/i },
  { label: "exclusive", re: /\bexclusive\b/i },
  { label: "elite", re: /\belite\b/i },
  { label: "VIP", re: /\bvip\b/i },
  { label: "alto padrão", re: /alto padr[ãa]o|high[- ]end|high[- ]class/i },
  { label: "o melhor", re: /\b(?:o|a|os|as) melhor(?:es)?\b|\bthe best\b/i },
  { label: "garantido", re: /\bgarant\w*/i },
  { label: "guarantee", re: /\bguarantee\w*/i },
  { label: "100%", re: /100\s?%/ },
  { label: "gratuidade", re: /\bgratuit\w*|\bgrátis\b|free of charge|\bfree\b/i },
  { label: "desconto", re: /\bdescont\w*|\bdiscount\w*/i },
  { label: "valores/preço", re: /\bvalor(?:es)?\b|\bpre[çc]os?\b|\bprices?\b|\bfees?\b|R\$/i },
];

export type WordViolation = { label: string; excerpt: string };

export function findForbidden(text: string): WordViolation[] {
  let clean = text;
  for (const a of ALLOWED) clean = clean.replace(a, " ");
  const out: WordViolation[] = [];
  for (const { label, re } of RULES) {
    const m = re.exec(clean);
    if (m) out.push({ label, excerpt: clean.slice(Math.max(0, m.index - 25), m.index + m[0].length + 25).trim() });
  }
  return out;
}

/** Percorre qualquer estrutura (objetos, arrays) e devolve todas as strings, com o caminho de origem. */
export function collectStrings(value: unknown, path = ""): Array<{ path: string; text: string }> {
  if (typeof value === "string") return [{ path, text: value }];
  if (Array.isArray(value)) return value.flatMap((v, i) => collectStrings(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) => collectStrings(v, path ? `${path}.${k}` : k));
  }
  return [];
}
