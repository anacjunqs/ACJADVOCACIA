import { settingsSeed } from "../content/seed/settings.ts";
import { founderSeed } from "../content/seed/founder.ts";
import { pageTextsSeed } from "../content/seed/pages.ts";
import { pillarContentSeed } from "../content/seed/pillars.ts";
import { valuesSeed } from "../content/seed/values.ts";
import { legalSeed } from "../content/seed/legal.ts";
import { articlesSeed, categoriesSeed, videosSeed } from "../content/seed/articles.ts";

export type SeedDoc = { _id: string; _type: string; [key: string]: unknown };

/** Remove chaves com valor indefinido (o Sanity não aceita `undefined`). */
function clean<T>(value: T): T {
  if (Array.isArray(value)) return value.map(clean) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined).map(([k, v]) => [k, clean(v)])) as T;
  }
  return value;
}

const keyed = <T extends object>(items: T[], prefix: string) => items.map((item, i) => ({ _key: `${prefix}${i + 1}`, ...item }));

/**
 * Converte o seed de /content/seed em documentos do Sanity. Os campos têm os mesmos nomes do
 * domínio, com poucas exceções (oabNumber/oabUf, seoDescription, pillarId, pageId).
 */
export function buildDocs(): SeedDoc[] {
  const s = settingsSeed;
  const f = founderSeed;
  const docs: SeedDoc[] = [
    {
      _id: "siteSettings",
      _type: "siteSettings",
      siteName: s.siteName,
      whatsappMessage: s.whatsappMessage,
      videoconference: s.videoconference,
      social: keyed(s.social, "social"),
      processSteps: keyed(s.processSteps, "step"),
      footerText: s.footerText,
      oabNotice: s.oabNotice,
      jurisdictionNotice: s.jurisdictionNotice,
      seoDescription: s.seo.description,
    },
    {
      _id: "founder",
      _type: "founder",
      name: f.name,
      oabNumber: f.oab.number,
      oabUf: f.oab.uf,
      summary: f.summary,
      timeline: keyed(f.timeline, "tl"),
      education: keyed(f.education, "ed"),
      languages: keyed(f.languages, "lg"),
      associations: keyed(f.associations, "as"),
      approach: f.approach,
      cta: f.cta,
    },
    { _id: "valuesList", _type: "valuesList", values: keyed(valuesSeed, "val") },
    { _id: "pageTexts", _type: "pageTexts", ...pageTextsSeed },
    ...pillarContentSeed.map((p) => ({
      _id: `pillarContent-${p.id}`,
      _type: "pillarContent",
      pillarId: p.id,
      intro: p.intro,
      whoFor: p.whoFor,
      whenToSeek: p.whenToSeek,
      internationalIntro: p.internationalIntro,
      faq: keyed(p.faq, "faq"),
    })),
    ...categoriesSeed.map((c) => ({
      _id: `articleCategory-${c.id}`,
      _type: "articleCategory",
      title: c.title,
      slug: { _type: "slug", current: c.id },
    })),
    // Exemplos entram como RASCUNHO (drafts.*): não aparecem no site até alguém publicar no Studio.
    ...videosSeed.map((v) => ({
      _id: `drafts.${v.id}`,
      _type: "video",
      url: v.url,
      title: v.title,
      description: v.description,
      category: v.category ? { _type: "reference", _ref: `articleCategory-${v.category.id}` } : undefined,
      language: v.language,
      pillar: v.pillar,
      publishedAt: v.publishedAt,
    })),
    ...articlesSeed.map((a) => ({
      _id: `drafts.${a.id}`,
      _type: "article",
      language: a.language,
      title: a.title,
      slug: { _type: "slug", current: a.slug },
      excerpt: a.excerpt,
      body: a.body,
      category: a.category ? { _type: "reference", _ref: `articleCategory-${a.category.id}` } : undefined,
      authorName: a.authorName,
      publishedAt: a.publishedAt,
      pillar: a.pillar,
      relatedVideo: a.videoId ? { _type: "reference", _ref: a.videoId, _weak: true } : undefined,
      translationOf: a.translation
        ? { _type: "reference", _ref: articlesSeed.find((x) => x.slug === a.translation!.slug)?.id ?? "", _weak: true }
        : undefined,
    })),
    ...legalSeed.map((l) => ({
      _id: `legalPage-${l.id}`,
      _type: "legalPage",
      pageId: l.id,
      title: l.title,
      body: l.body,
    })),
  ];
  return docs.map((d) => clean(d));
}
