import type { Founder, PageTexts, PillarContent, SiteSettings } from "./types";
import type { PillarSlug } from "@content/services";
import { settingsSeed } from "@content/seed/settings";
import { founderSeed } from "@content/seed/founder";
import { pageTextsSeed } from "@content/seed/pages";
import { pillarContentById } from "@content/seed/pillars";

/**
 * Camada de dados. Etapa 3: apenas seed. A partir da etapa 4, cada getter consulta o Sanity
 * quando as variáveis do CMS existem e cai no seed quando o documento não existe.
 */
export async function getSettings(): Promise<SiteSettings> {
  return settingsSeed;
}

export async function getFounder(): Promise<Founder> {
  return founderSeed;
}

export async function getPageTexts(): Promise<PageTexts> {
  return pageTextsSeed;
}

export async function getPillarContent(id: PillarSlug | "hub"): Promise<PillarContent> {
  const c = pillarContentById[id];
  if (!c) throw new Error(`Conteúdo do pilar ausente: ${id}`);
  return c;
}
