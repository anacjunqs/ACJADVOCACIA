import type { Founder, SiteSettings } from "./types";
import { settingsSeed } from "@content/seed/settings";
import { founderSeed } from "@content/seed/founder";

/**
 * Camada de dados. Etapa 2: apenas seed. A partir da etapa 4, cada getter consulta o Sanity
 * quando as variáveis do CMS existem e cai no seed quando o documento não existe.
 */
export async function getSettings(): Promise<SiteSettings> {
  return settingsSeed;
}

export async function getFounder(): Promise<Founder> {
  return founderSeed;
}
