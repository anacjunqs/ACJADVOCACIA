import { articlesSeed, videosSeed } from "@content/seed/articles";
import { isSanityConfigured } from "@/sanity/env";
import { sanityFetch } from "@/sanity/lib/fetch";
import { mapArticle, mapArticleSummary, mapVideo, queries } from "./sanity";
import type { Article, ArticleCategory, ArticleSummary, Locale, Video } from "./types";

type Raw = Record<string, unknown>;

/**
 * Exemplos do seed são rascunhos: aparecem em desenvolvimento e preview, e somem na produção da Vercel.
 * SHOW_SEED_DRAFTS=true/false força o comportamento.
 */
export function showSeedDrafts(): boolean {
  const forced = process.env.SHOW_SEED_DRAFTS;
  if (forced === "true") return true;
  if (forced === "false") return false;
  return process.env.VERCEL_ENV !== "production";
}

const byDateDesc = <T extends { publishedAt: string }>(items: T[]): T[] =>
  [...items].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

const seedArticles = (): Article[] => (showSeedDrafts() ? articlesSeed : articlesSeed.filter((a) => !a.draft));
const seedVideos = (): Video[] => (showSeedDrafts() ? videosSeed : videosSeed.filter((v) => !v.draft));

const toSummary = ({ body: _body, pillar: _p, videoId: _v, translation: _t, seo: _s, ...summary }: Article): ArticleSummary => {
  void [_body, _p, _v, _t, _s];
  return summary;
};

/* ───────── Artigos ───────── */

export async function getArticleSummaries(locale: Locale): Promise<ArticleSummary[]> {
  if (!isSanityConfigured) return byDateDesc(seedArticles().filter((a) => a.language === locale).map(toSummary));
  const raw = await sanityFetch<Raw[]>({ query: queries.articleList, params: { lang: locale }, tags: ["articles"] });
  return raw.flatMap((r) => mapArticleSummary(r) ?? []);
}

export async function getArticle(slug: string, locale: Locale): Promise<Article | null> {
  if (!isSanityConfigured) return seedArticles().find((a) => a.slug === slug && a.language === locale) ?? null;
  const raw = await sanityFetch<Raw | null>({ query: queries.articleBySlug, params: { slug, lang: locale }, tags: ["articles", `article:${slug}`] });
  return raw ? (mapArticle(raw) ?? null) : null;
}

/** Slugs publicados (para gerar as páginas no build; novos artigos são gerados sob demanda). */
export async function getArticleParams(): Promise<Array<{ locale: Locale; slug: string }>> {
  if (!isSanityConfigured) return seedArticles().map((a) => ({ locale: a.language, slug: a.slug }));
  const raw = await sanityFetch<Raw[]>({ query: queries.articleParams, tags: ["articles"], published: true });
  return raw.flatMap((r) => (typeof r.slug === "string" ? [{ locale: r.language === "en" ? ("en" as const) : ("pt" as const), slug: r.slug }] : []));
}

/** Artigos relacionados: mesma categoria ou mesma área, no mesmo idioma, mais recentes primeiro. */
export async function getRelatedArticles(article: Article, limit = 3): Promise<ArticleSummary[]> {
  const all = await getArticleSummaries(article.language);
  const others = all.filter((a) => a.slug !== article.slug);
  const sameCategory = others.filter((a) => a.category?.id && a.category.id === article.category?.id);
  const rest = others.filter((a) => !sameCategory.includes(a));
  return [...sameCategory, ...rest].slice(0, limit);
}

/* ───────── Vídeos ───────── */

export async function getVideos(locale?: Locale): Promise<Video[]> {
  if (!isSanityConfigured) return byDateDesc(seedVideos().filter((v) => !locale || v.language === locale));
  const raw = await sanityFetch<Raw[]>({ query: queries.videoList, params: { lang: locale ?? null }, tags: ["videos"] });
  return raw.flatMap((r) => mapVideo(r) ?? []);
}

export async function getVideoById(id: string | undefined): Promise<Video | null> {
  if (!id) return null;
  if (!isSanityConfigured) return seedVideos().find((v) => v.id === id) ?? null;
  const raw = await sanityFetch<Raw | null>({ query: queries.videoById, params: { id }, tags: ["videos"] });
  return raw ? (mapVideo(raw) ?? null) : null;
}

/** Vídeo em destaque na home: o mais recente no idioma (ou, se não houver, em qualquer idioma). */
export async function getFeaturedVideo(locale: Locale): Promise<Video | null> {
  const inLocale = await getVideos(locale);
  if (inLocale[0]) return inLocale[0];
  return null;
}

/** Categorias presentes nos itens (para os filtros), na ordem em que aparecem. */
export function categoriesOf(items: Array<{ category?: ArticleCategory }>): ArticleCategory[] {
  const seen = new Map<string, ArticleCategory>();
  for (const it of items) if (it.category && !seen.has(it.category.id)) seen.set(it.category.id, it.category);
  return [...seen.values()];
}
