import type { MetadataRoute } from "next";
import { buildSitemapEntries } from "@/lib/seo/sitemap-entries";
import { isIndexable } from "@/lib/seo/site";

export const revalidate = 3600;

/** Sitemap com todas as páginas públicas, artigos incluídos. Vazio enquanto o site não for indexável. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexable()) return [];
  return buildSitemapEntries();
}
