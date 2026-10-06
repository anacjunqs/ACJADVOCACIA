import { getTranslations } from "next-intl/server";
import { NavLink } from "@/components/layout/nav-link";

/** As duas "sub-abas" de Artigos e Vídeos: duas rotas, com navegação compartilhada. */
export async function ContentTabs() {
  const t = await getTranslations("articles");
  const base = "inline-flex min-h-12 items-center rounded-full px-6 font-bold transition-colors";
  const active = "bg-navy text-white";
  const idle = "bg-white text-navy hover:bg-navy-50 border-2 border-navy-200";
  return (
    <nav aria-label={t("tabsLabel")} className="flex gap-2">
      <NavLink href="/artigos" match={["/artigos", "/artigos/[slug]"]} className={`${base} ${idle}`} activeClassName={`${active} !border-navy`}>
        {t("tabArticles")}
      </NavLink>
      <NavLink href="/videos" match={["/videos"]} className={`${base} ${idle}`} activeClassName={`${active} !border-navy`}>
        {t("tabVideos")}
      </NavLink>
    </nav>
  );
}
