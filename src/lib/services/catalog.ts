import { hub, pillars, type Pillar, type PillarSlug } from "@content/services";
import type { IconName } from "@/components/ui/icon";
import type { AppLocale } from "@/lib/i18n/routing";

export const pillarIcon: Record<PillarSlug, IconName> = {
  "planejamento-patrimonial": "compass",
  "casamento-uniao": "link",
  "divorcio-partilha": "split",
  "filhos-guarda": "baby",
  alimentos: "sprout",
  filiacao: "tree-deciduous",
  "inventario-sucessoes": "scroll-text",
};

export const hubIcon: IconName = "globe";

export const pillarSlug = (p: Pillar, locale: AppLocale): string => p.path[locale];

export function pillarBySlug(slug: string, locale: AppLocale): Pillar | undefined {
  return pillars.find((p) => p.path[locale] === slug);
}

export function pillarById(id: PillarSlug): Pillar {
  const p = pillars.find((x) => x.id === id);
  if (!p) throw new Error(`Pilar desconhecido: ${id}`);
  return p;
}

/** Converte o slug de um pilar de um idioma para o outro (seletor de idioma). */
export function translatePillarSlug(slug: string, from: AppLocale, to: AppLocale): string | undefined {
  const p = pillarBySlug(slug, from);
  return p ? p.path[to] : undefined;
}

export { hub, pillars };
