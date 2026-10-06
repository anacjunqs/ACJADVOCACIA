import type { Metadata } from "next";
import { getPathname } from "@/lib/i18n/navigation";
import { htmlLang, ogLocale, type AppLocale, type Pathname } from "@/lib/i18n/routing";
import { absoluteUrl, isIndexable } from "./site";
import { stripPending } from "@/lib/pending";

export type Href = { pathname: Pathname; params?: Record<string, string> };
type HrefInput = Pathname | Href;

const toHref = (h: HrefInput): Href => (typeof h === "string" ? { pathname: h } : h);

export function pathFor(locale: AppLocale, href: HrefInput): string {
  const h = toHref(href);
  // getPathname tem tipos estritos por rota; as rotas aqui já foram validadas por quem chama.
  return getPathname({ locale, href: h as never });
}

/** Mesmo href nos dois idiomas (páginas estáticas). */
export const bothLocales = (href: HrefInput): Partial<Record<AppLocale, HrefInput>> => ({ pt: href, en: href });

type Options = {
  locale: AppLocale;
  /** Idiomas em que a página existe, com o href de cada um. A ausência de EN tira a página do hreflang. */
  alternates: Partial<Record<AppLocale, HrefInput>>;
  title: string;
  description?: string;
  type?: "website" | "article";
  /** Imagem Open Graph específica; por padrão vale a imagem gerada com as cores da marca. */
  image?: string;
  publishedTime?: string;
  noindex?: boolean;
};

export function pageMetadata(o: Options): Metadata {
  const current = o.alternates[o.locale];
  const languages: Record<string, string> = {};
  for (const l of ["pt", "en"] as const) {
    const h = o.alternates[l];
    if (h) languages[htmlLang[l]] = absoluteUrl(pathFor(l, h));
  }
  const xDefaultHref = o.alternates.pt ?? current;
  if (xDefaultHref) languages["x-default"] = absoluteUrl(pathFor("pt", xDefaultHref));

  const title = stripPending(o.title);
  const description = o.description ? stripPending(o.description) : undefined;
  const canonical = current ? absoluteUrl(pathFor(o.locale, current)) : undefined;

  return {
    title,
    ...(description ? { description } : {}),
    alternates: { canonical, languages },
    robots: isIndexable() && !o.noindex ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      type: o.type ?? "website",
      title,
      ...(description ? { description } : {}),
      url: canonical,
      locale: ogLocale[o.locale],
      alternateLocale: (["pt", "en"] as const).filter((l) => l !== o.locale && o.alternates[l]).map((l) => ogLocale[l]),
      ...(o.image ? { images: [{ url: o.image }] } : {}),
      ...(o.publishedTime ? { publishedTime: o.publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title, ...(description ? { description } : {}) },
  };
}
