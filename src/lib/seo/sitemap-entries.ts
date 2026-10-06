import { pillars } from "@content/services";
import { getArticle, getArticleParams } from "@/lib/content/articles";
import { getFounder, getLegalPage, getPillarContent } from "@/lib/content";
import { hasEnglish } from "@/lib/i18n/localize";
import { htmlLang, type AppLocale } from "@/lib/i18n/routing";
import { absoluteUrl, testimonialsEnabled } from "./site";
import { pathFor, type Href } from "./metadata";

export type SitemapEntry = {
  url: string;
  lastModified?: string;
  alternates?: { languages: Record<string, string> };
};

/** Uma entrada por idioma em que a página existe; cada entrada lista as versões equivalentes (hreflang). */
export function entriesFor(hrefs: Partial<Record<AppLocale, Href>>, lastModified?: string): SitemapEntry[] {
  const languages: Record<string, string> = {};
  for (const l of ["pt", "en"] as const) {
    const h = hrefs[l];
    if (h) languages[htmlLang[l]] = absoluteUrl(pathFor(l, h));
  }
  const pt = hrefs.pt;
  if (pt) languages["x-default"] = absoluteUrl(pathFor("pt", pt));
  return (["pt", "en"] as const).flatMap((l) => {
    const h = hrefs[l];
    return h ? [{ url: absoluteUrl(pathFor(l, h)), lastModified, alternates: { languages } }] : [];
  });
}

const same = (h: Href): Partial<Record<AppLocale, Href>> => ({ pt: h, en: h });

/**
 * Todas as páginas públicas. Páginas sem texto em inglês NÃO entram no sitemap EN (nem no hreflang).
 * Rascunhos ficam de fora. Depoimentos só entram com a flag ligada.
 */
export async function buildSitemapEntries(): Promise<SitemapEntry[]> {
  const out: SitemapEntry[] = [];
  const push = (hrefs: Partial<Record<AppLocale, Href>>, lastModified?: string) => out.push(...entriesFor(hrefs, lastModified));

  push(same({ pathname: "/" }));
  push(same({ pathname: "/areas-de-atuacao" }));
  push(same({ pathname: "/valores" }));
  push(same({ pathname: "/artigos" }));
  push(same({ pathname: "/videos" }));
  push(same({ pathname: "/contato" }));
  if (testimonialsEnabled()) push(same({ pathname: "/depoimentos" }));

  const [founder, hubContent] = await Promise.all([getFounder(), getPillarContent("hub")]);
  push({ pt: { pathname: "/sobre" }, ...(hasEnglish(founder.summary) ? { en: { pathname: "/sobre" as const } } : {}) });
  push({ pt: { pathname: "/hub" }, ...(hasEnglish(hubContent.intro) ? { en: { pathname: "/hub" as const } } : {}) });

  for (const p of pillars) {
    const c = await getPillarContent(p.id);
    const href = (l: AppLocale): Href => ({ pathname: "/areas-de-atuacao/[pillar]", params: { pillar: p.path[l] } });
    push({ pt: href("pt"), ...(hasEnglish(c.intro) ? { en: href("en") } : {}) });
  }

  for (const [id, pathname] of [["privacy", "/privacidade"], ["terms", "/termos"], ["cookies", "/cookies"]] as const) {
    const page = await getLegalPage(id);
    push({ pt: { pathname }, ...(page.body.en && page.body.en.length > 0 ? { en: { pathname } } : {}) });
  }

  // Artigos: cada idioma é um documento; a tradução liga os dois (hreflang).
  const params = await getArticleParams();
  const seen = new Set<string>();
  for (const { locale, slug } of params) {
    const a = await getArticle(slug, locale);
    if (!a || a.draft) continue;
    const key = `${locale}:${slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const href = (s: string): Href => ({ pathname: "/artigos/[slug]", params: { slug: s } });
    const hrefs: Partial<Record<AppLocale, Href>> = { [locale]: href(slug) };
    if (a.translation) {
      hrefs[a.translation.language] = href(a.translation.slug);
      seen.add(`${a.translation.language}:${a.translation.slug}`);
    }
    // Cada idioma entra uma vez; o par gera duas entradas com alternates.
    push(hrefs, a.publishedAt);
  }
  return out;
}
