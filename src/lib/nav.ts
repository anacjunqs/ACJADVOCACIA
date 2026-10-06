import type { AppLocale, Pathname, StaticPathname } from "@/lib/i18n/routing";
import { pillars, hub, pillarSlug } from "@/lib/services/catalog";
import { testimonialsEnabled } from "@/lib/seo/site";

export type NavKey = "about" | "values" | "articlesVideos" | "testimonials" | "contact";

export type NavItem = { key: NavKey; href: StaticPathname; match: Pathname[] };

/** Menu principal (sem "Áreas de Atuação", que é um submenu). Depoimentos só com a flag ligada. */
export function mainNav(): NavItem[] {
  const items: NavItem[] = [
    { key: "about", href: "/sobre", match: ["/sobre"] },
    { key: "values", href: "/valores", match: ["/valores"] },
    { key: "articlesVideos", href: "/artigos", match: ["/artigos", "/artigos/[slug]", "/videos"] },
  ];
  if (testimonialsEnabled()) items.push({ key: "testimonials", href: "/depoimentos", match: ["/depoimentos"] });
  items.push({ key: "contact", href: "/contato", match: ["/contato"] });
  return items;
}

export type PillarLink = {
  id: string;
  label: string;
  href: { pathname: "/areas-de-atuacao/[pillar]"; params: { pillar: string } };
};

export function pillarLinks(locale: AppLocale): PillarLink[] {
  return pillars.map((p) => ({
    id: p.id,
    label: p.title[locale],
    href: { pathname: "/areas-de-atuacao/[pillar]", params: { pillar: pillarSlug(p, locale) } },
  }));
}

export const hubLabel = (locale: AppLocale): string => hub.title[locale];

export function whatsappLink(number: string | undefined, message: string): string | undefined {
  const digits = number?.replace(/\D/g, "");
  if (!digits) return undefined;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
