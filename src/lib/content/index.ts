import type { PillarSlug } from "@content/services";
import { settingsSeed } from "@content/seed/settings";
import { founderSeed } from "@content/seed/founder";
import { pageTextsSeed } from "@content/seed/pages";
import { pillarContentById } from "@content/seed/pillars";
import { valuesSeed } from "@content/seed/values";
import { legalSeed } from "@content/seed/legal";
import { isSanityConfigured } from "@/sanity/env";
import { sanityFetch } from "@/sanity/lib/fetch";
import { mapFounder, mapLegal, mapPageTexts, mapPillar, mapSettings, mapValues, queries } from "./sanity";
import type { Founder, LegalPage, LegalPageId, PageTexts, PillarContent, SiteSettings, ValueItem } from "./types";

type Raw = Record<string, unknown>;

/**
 * Camada de dados.
 * - Sem credenciais do Sanity: devolve o seed (o site compila e roda assim).
 * - Com Sanity: devolve o documento do CMS; se o documento ainda não existe, cai no seed.
 * - Erros de rede propagam (ver sanityFetch): nunca trocamos conteúdo publicado por texto de exemplo.
 */
async function load<T>(query: string, params: Record<string, unknown>, tags: string[], map: (raw: Raw) => T, seed: T): Promise<T> {
  if (!isSanityConfigured) return seed;
  const raw = await sanityFetch<Raw | null>({ query, params, tags });
  return raw ? map(raw) : seed;
}

export const getSettings = (): Promise<SiteSettings> =>
  load(queries.settings, {}, ["settings"], (raw) => mapSettings(raw, settingsSeed), settingsSeed);

export const getFounder = (): Promise<Founder> =>
  load(queries.founder, {}, ["founder"], (raw) => mapFounder(raw, founderSeed), founderSeed);

export const getPageTexts = (): Promise<PageTexts> =>
  load(queries.pageTexts, {}, ["pageTexts"], (raw) => mapPageTexts(raw, pageTextsSeed), pageTextsSeed);

export async function getValues(): Promise<ValueItem[]> {
  const mapped = await load(queries.values, {}, ["values"], (raw) => mapValues(raw), valuesSeed);
  return mapped.length > 0 ? mapped : valuesSeed;
}

export function getPillarContent(id: PillarSlug | "hub"): Promise<PillarContent> {
  const seed = pillarContentById[id];
  if (!seed) throw new Error(`Conteúdo do pilar ausente: ${id}`);
  return load(queries.pillar, { id }, ["pillars", `pillar:${id}`], (raw) => mapPillar(raw, seed), seed);
}

export function getLegalPage(id: LegalPageId): Promise<LegalPage> {
  const seed = legalSeed.find((p) => p.id === id);
  if (!seed) throw new Error(`Página legal ausente: ${id}`);
  return load(queries.legal, { id }, ["legal", `legal:${id}`], (raw) => mapLegal(raw, seed), seed);
}
