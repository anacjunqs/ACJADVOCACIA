import type { AppLocale, Pathname } from "./routing";
import { translatePillarSlug } from "@/lib/services/catalog";

export type RouteRef = { pathname: Pathname; params?: Record<string, string> };

/**
 * Para o seletor de idioma: dado o pathname atual (chave interna) e os params, devolve a rota
 * equivalente no outro idioma. Slugs de pilar são traduzidos; artigos caem na listagem
 * (a página do artigo oferece o link direto para a tradução, quando existe).
 */
export function alternateRoute(
  current: AppLocale,
  target: AppLocale,
  route: { pathname: string; params?: Record<string, string | string[] | undefined> },
): RouteRef {
  const { pathname, params } = route;
  if (pathname === "/areas-de-atuacao/[pillar]") {
    const slug = typeof params?.pillar === "string" ? params.pillar : undefined;
    const translated = slug ? translatePillarSlug(slug, current, target) : undefined;
    return translated
      ? { pathname: "/areas-de-atuacao/[pillar]", params: { pillar: translated } }
      : { pathname: "/areas-de-atuacao" };
  }
  if (pathname === "/artigos/[slug]") return { pathname: "/artigos" };
  return { pathname: pathname as Pathname };
}
