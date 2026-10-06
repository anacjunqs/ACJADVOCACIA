import { defineRouting } from "next-intl/routing";
import { hub } from "@content/services";

export const locales = ["pt", "en"] as const;
export type AppLocale = (typeof locales)[number];
export const defaultLocale: AppLocale = "pt";

/** Tag BCP-47 usada em <html lang>, hreflang e Open Graph. */
export const htmlLang: Record<AppLocale, string> = { pt: "pt-BR", en: "en" };
export const ogLocale: Record<AppLocale, string> = { pt: "pt_BR", en: "en_US" };

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
  // Sem cookie de idioma: nenhum cookie é gravado antes do consentimento.
  localeCookie: false,
  pathnames: {
    "/": "/",
    "/areas-de-atuacao": { pt: "/areas-de-atuacao", en: "/practice-areas" },
    "/areas-de-atuacao/[pillar]": { pt: "/areas-de-atuacao/[pillar]", en: "/practice-areas/[pillar]" },
    // Slug do hub vem de `hub.path` em content/services.ts
    "/hub": { pt: `/${hub.path.pt}`, en: `/${hub.path.en}` },
    "/sobre": { pt: "/sobre", en: "/about" },
    "/valores": { pt: "/valores", en: "/values" },
    "/artigos": { pt: "/artigos", en: "/articles" },
    "/artigos/[slug]": { pt: "/artigos/[slug]", en: "/articles/[slug]" },
    "/videos": { pt: "/videos", en: "/videos" },
    "/depoimentos": { pt: "/depoimentos", en: "/testimonials" },
    "/contato": { pt: "/contato", en: "/contact" },
    "/privacidade": { pt: "/privacidade", en: "/privacy" },
    "/termos": { pt: "/termos", en: "/terms" },
    "/cookies": { pt: "/cookies", en: "/cookies" },
  },
});

export type Pathname = keyof typeof routing.pathnames;

export function isLocale(value: string): value is AppLocale {
  return (locales as readonly string[]).includes(value);
}

/** Rotas sem parâmetros dinâmicos (usáveis diretamente em links do menu). */
export type StaticPathname = Exclude<Pathname, "/areas-de-atuacao/[pillar]" | "/artigos/[slug]">;
