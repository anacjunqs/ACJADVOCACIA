import type { PillarSlug } from "@content/services";
import type { ValueIconName } from "@/components/ui/icon";
import { valueIconNames } from "@/components/ui/icon";
import { sanityImageSize, sanityImageUrl, type SanityImageSource } from "@/sanity/lib/image";
import type { Founder, ImageRef, LegalPage, LegalPageId, LRich, LS, PageTexts, PillarContent, RichBlock, SiteSettings, ValueItem } from "./types";

/* ───────── Consultas GROQ ───────── */

const IMG = `{ "ref": asset._ref, crop, hotspot, "dims": asset->metadata.dimensions }`;

export const queries = {
  settings: `*[_type == "siteSettings"][0]{
    siteName, "logo": logo ${IMG}, email, phone, whatsapp, whatsappMessage,
    address, hours, timezone, videoconference, social, googlePlaceId,
    processSteps, footerText, oabNotice, jurisdictionNotice, seoDescription
  }`,
  founder: `*[_type == "founder"][0]{
    name, oabNumber, oabUf, "photo": photo ${IMG}, "photoAlt": photo.alt,
    summary, bio, timeline, education, languages, associations, approach, quote, cta
  }`,
  values: `*[_type == "valuesList"][0]{ values }`,
  pageTexts: `*[_type == "pageTexts"][0]{ home, areasIndex, values, articles, videos, contact, testimonials }`,
  pillar: `*[_type == "pillarContent" && pillarId == $id][0]{
    pillarId, intro, whoFor, whenToSeek, internationalIntro, faq, "videoId": relatedVideo->_id
  }`,
  legal: `*[_type == "legalPage" && pageId == $id][0]{ pageId, title, updatedAt, body }`,
};

/* ───────── Utilitários de mapeamento ───────── */

type Raw = Record<string, unknown>;
const obj = (v: unknown): Raw | undefined => (v && typeof v === "object" && !Array.isArray(v) ? (v as Raw) : undefined);
const arr = (v: unknown): Raw[] => (Array.isArray(v) ? v.filter((x): x is Raw => !!obj(x)) : []);
const str = (v: unknown): string | undefined => (typeof v === "string" && v.trim() ? v : undefined);

/** Campo bilíngue do Sanity → LS. Sem PT, devolve undefined (o chamador usa o seed). */
export function toLS(v: unknown): LS | undefined {
  const o = obj(v);
  const pt = str(o?.pt);
  if (!pt) return undefined;
  return { pt, en: str(o?.en) };
}

export function toLRich(v: unknown): LRich | undefined {
  const o = obj(v);
  const pt = Array.isArray(o?.pt) ? (o.pt as RichBlock[]) : [];
  if (pt.length === 0) return undefined;
  const en = Array.isArray(o?.en) && (o.en as unknown[]).length > 0 ? (o.en as RichBlock[]) : undefined;
  return { pt, en };
}

export function toImage(v: unknown, alt?: LS): ImageRef | undefined {
  const o = obj(v);
  const ref = str(o?.ref);
  if (!o || !ref) return undefined;
  const source: SanityImageSource = {
    ref,
    crop: (obj(o.crop) as SanityImageSource["crop"]) ?? null,
    hotspot: o.hotspot,
    dims: (obj(o.dims) as SanityImageSource["dims"]) ?? null,
  };
  const { width, height } = sanityImageSize(source);
  return { src: sanityImageUrl(source), alt: alt ?? { pt: "" }, width, height, sanityRef: ref };
}

const lsOr = (v: unknown, fallback: LS): LS => toLS(v) ?? fallback;

/* ───────── Documentos ───────── */

export function mapSettings(raw: Raw, seed: SiteSettings): SiteSettings {
  const steps = arr(raw.processSteps)
    .map((s) => ({ title: toLS(s.title), text: toLS(s.text) }))
    .filter((s): s is { title: LS; text: LS } => !!s.title && !!s.text);
  const address = obj(raw.address);
  const addressText = toLS(address?.text);
  return {
    siteName: lsOr(raw.siteName, seed.siteName),
    logo: toImage(raw.logo),
    email: str(raw.email),
    phone: str(raw.phone),
    whatsapp: str(raw.whatsapp)?.replace(/\D/g, ""),
    whatsappMessage: lsOr(raw.whatsappMessage, seed.whatsappMessage),
    address: addressText ? { text: addressText, mapQuery: str(address?.mapQuery) } : undefined,
    hours: toLS(raw.hours),
    timezone: str(raw.timezone),
    videoconference: toLS(raw.videoconference),
    social: arr(raw.social).flatMap((s) => (str(s.label) && str(s.url) ? [{ label: str(s.label)!, url: str(s.url)! }] : [])),
    googlePlaceId: str(raw.googlePlaceId),
    processSteps: steps.length > 0 ? steps : seed.processSteps,
    footerText: lsOr(raw.footerText, seed.footerText),
    oabNotice: lsOr(raw.oabNotice, seed.oabNotice),
    jurisdictionNotice: lsOr(raw.jurisdictionNotice, seed.jurisdictionNotice),
    seo: { description: lsOr(raw.seoDescription, seed.seo.description) },
  };
}

export function mapFounder(raw: Raw, seed: Founder): Founder {
  const alt = toLS(raw.photoAlt);
  return {
    name: str(raw.name) ?? seed.name,
    oab: { number: str(raw.oabNumber) ?? seed.oab.number, uf: (str(raw.oabUf) ?? seed.oab.uf).toUpperCase() },
    photo: toImage(raw.photo, alt),
    summary: lsOr(raw.summary, seed.summary),
    bio: toLRich(raw.bio),
    timeline: arr(raw.timeline).flatMap((t) => {
      const title = toLS(t.title);
      const year = str(t.year);
      return title && year ? [{ year, title, description: toLS(t.description) }] : [];
    }),
    education: arr(raw.education).flatMap((e) => {
      const title = toLS(e.title);
      return title ? [{ title, detail: toLS(e.detail) }] : [];
    }),
    languages: arr(raw.languages).flatMap((l) => {
      const name = toLS(l.name);
      return name ? [{ name }] : [];
    }),
    associations: arr(raw.associations).flatMap((a) => {
      const name = toLS(a.name);
      return name ? [{ name }] : [];
    }),
    approach: toLS(raw.approach),
    quote: (() => {
      const q = obj(raw.quote);
      const text = toLS(q?.text);
      return text ? { text, attribution: toLS(q?.attribution) } : undefined;
    })(),
    cta: (() => {
      const c = obj(raw.cta);
      const title = toLS(c?.title);
      return title ? { title, text: toLS(c?.text) } : seed.cta;
    })(),
  };
}

export function mapValues(raw: Raw): ValueItem[] {
  return arr(raw.values).flatMap((v) => {
    const title = toLS(v.title);
    const description = toLS(v.description);
    if (!title || !description) return [];
    const icon = (valueIconNames as readonly string[]).includes(String(v.icon)) ? (v.icon as ValueIconName) : "heart";
    return [{ title, description, icon }];
  });
}

export function mapPageTexts(raw: Raw, seed: PageTexts): PageTexts {
  const home = obj(raw.home);
  const intro = (key: keyof Omit<PageTexts, "home">): { intro: LS } => ({ intro: lsOr(obj(raw[key])?.intro, seed[key].intro) });
  return {
    home: {
      heroTitle: lsOr(home?.heroTitle, seed.home.heroTitle),
      heroSubtitle: lsOr(home?.heroSubtitle, seed.home.heroSubtitle),
      hubText: lsOr(home?.hubText, seed.home.hubText),
      finalCtaTitle: lsOr(home?.finalCtaTitle, seed.home.finalCtaTitle),
      finalCtaText: lsOr(home?.finalCtaText, seed.home.finalCtaText),
    },
    areasIndex: intro("areasIndex"),
    values: intro("values"),
    articles: intro("articles"),
    videos: intro("videos"),
    contact: intro("contact"),
    testimonials: intro("testimonials"),
  };
}

export function mapPillar(raw: Raw, seed: PillarContent): PillarContent {
  const faq = arr(raw.faq).flatMap((f) => {
    const question = toLS(f.question);
    const answer = toLS(f.answer);
    return question && answer ? [{ question, answer }] : [];
  });
  return {
    id: (str(raw.pillarId) as PillarSlug | "hub" | undefined) ?? seed.id,
    intro: lsOr(raw.intro, seed.intro),
    whoFor: lsOr(raw.whoFor, seed.whoFor),
    whenToSeek: lsOr(raw.whenToSeek, seed.whenToSeek),
    internationalIntro: toLS(raw.internationalIntro) ?? seed.internationalIntro,
    faq: faq.length > 0 ? faq : seed.faq,
    videoId: str(raw.videoId),
  };
}

export function mapLegal(raw: Raw, seed: LegalPage): LegalPage {
  return {
    id: (str(raw.pageId) as LegalPageId | undefined) ?? seed.id,
    title: lsOr(raw.title, seed.title),
    updatedAt: str(raw.updatedAt),
    body: toLRich(raw.body) ?? seed.body,
  };
}
