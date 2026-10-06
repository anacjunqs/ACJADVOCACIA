import { describe, expect, it } from "vitest";
import { normalizeSearch, paginate } from "@/lib/list-filter";

describe("busca e paginação", () => {
  it("normaliza acentos, caixa e espaços", () => {
    expect(normalizeSearch("  Inventário   DE  Herança ")).toBe("inventario de heranca");
  });
  it("pagina e ajusta páginas fora do intervalo", () => {
    const items = Array.from({ length: 20 }, (_, i) => i + 1);
    expect(paginate(items, 1, 9)).toEqual({ items: items.slice(0, 9), pages: 3, current: 1 });
    expect(paginate(items, 3, 9).items).toEqual([19, 20]);
    expect(paginate(items, 99, 9).current).toBe(3);
    expect(paginate(items, -4, 9).current).toBe(1);
    expect(paginate([], 1, 9)).toEqual({ items: [], pages: 1, current: 1 });
  });
});
