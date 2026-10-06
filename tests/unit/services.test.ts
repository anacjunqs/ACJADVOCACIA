import { describe, expect, it } from "vitest";
import { groups, hub, hubServices, pillarOf, pillars, services, servicesByPillar, type GroupKey } from "@content/services";

describe("catálogo de serviços (content/services.ts)", () => {
  it("mantém a estrutura fornecida: 7 pilares, 1 hub, 138 serviços", () => {
    expect(pillars).toHaveLength(7);
    expect(hub.path.pt).toBe("familias-entre-paises");
    expect(services).toHaveLength(138);
  });

  it("cada serviço aparece uma única vez", () => {
    const slugs = services.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("todo serviço aponta para um grupo existente, e todo grupo tem serviços", () => {
    const keys = Object.keys(groups) as GroupKey[];
    for (const s of services) expect(keys).toContain(s.group);
    for (const k of keys) expect(services.some((s) => s.group === k)).toBe(true);
  });

  it("todo grupo de pilar aponta para um pilar existente", () => {
    const ids = new Set<string>([...pillars.map((p) => p.id), "hub"]);
    for (const g of Object.values(groups)) expect(ids.has(g.pillar)).toBe(true);
  });

  it("slugs de URL dos pilares são únicos por idioma e distintos do hub", () => {
    for (const l of ["pt", "en"] as const) {
      const paths = [...pillars.map((p) => p.path[l]), hub.path[l]];
      expect(new Set(paths).size).toBe(paths.length);
    }
  });

  it("títulos existem nos dois idiomas", () => {
    for (const s of services) {
      expect(s.title.pt.trim()).not.toBe("");
      expect(s.title.en.trim()).not.toBe("");
    }
  });

  it("helpers: servicesByPillar cobre todos os serviços de pilar; hubServices é coerente", () => {
    const total = pillars.reduce((n, p) => n + servicesByPillar(p.id).reduce((m, g) => m + g.services.length, 0), 0);
    const exclusive = services.filter((s) => pillarOf(s) === "hub").length;
    expect(total + exclusive).toBe(services.length);

    const h = hubServices();
    const fromPillars = h.fromPillars.reduce((n, x) => n + x.services.length, 0);
    expect(fromPillars).toBe(services.filter((s) => s.international && pillarOf(s) !== "hub").length);
    expect(h.exclusive.reduce((n, g) => n + g.services.length, 0)).toBe(exclusive);
  });
});
