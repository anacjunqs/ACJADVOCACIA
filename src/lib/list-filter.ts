/** Normaliza texto para busca: minúsculas, sem acentos, espaços simples. */
export function normalizeSearch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Paginação simples; páginas fora do intervalo são ajustadas. */
export function paginate<T>(items: T[], page: number, size: number): { items: T[]; pages: number; current: number } {
  const pages = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(Math.max(1, Math.floor(page) || 1), pages);
  return { items: items.slice((current - 1) * size, current * size), pages, current };
}
