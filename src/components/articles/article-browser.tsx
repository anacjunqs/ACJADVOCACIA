"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { FilterChips } from "@/components/ui/filter-chips";
import { Icon } from "@/components/ui/icon";
import { buttonClasses } from "@/components/ui/button-styles";
import { ArticleCard } from "./article-card";
import { pick } from "@/lib/i18n/localize";
import { normalizeSearch, paginate } from "@/lib/list-filter";
import type { ArticleCategory, ArticleSummary } from "@/lib/content/types";
import type { AppLocale } from "@/lib/i18n/routing";

const PAGE_SIZE = 9;

/**
 * Listagem de artigos: filtro por categoria, busca simples e paginação.
 * Roda no navegador sobre a lista já carregada (a página continua estática) e guarda o estado na URL
 * (?cat=&q=&page=), para a pessoa poder compartilhar ou voltar para o mesmo ponto.
 */
export function ArticleBrowser({ articles, categories }: { articles: ArticleSummary[]; categories: ArticleCategory[] }) {
  const t = useTranslations("articles");
  const locale = useLocale() as AppLocale;
  const params = useSearchParams();
  const [cat, setCat] = useState(params.get("cat") ?? "");
  const [q, setQ] = useState(params.get("q") ?? "");
  const [page, setPage] = useState(Math.max(1, Number(params.get("page")) || 1));

  const syncUrl = (next: { cat: string; q: string; page: number }) => {
    const sp = new URLSearchParams();
    if (next.cat) sp.set("cat", next.cat);
    if (next.q) sp.set("q", next.q);
    if (next.page > 1) sp.set("page", String(next.page));
    const qs = sp.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  };

  const update = (patch: Partial<{ cat: string; q: string; page: number }>) => {
    const next = { cat, q, page, ...patch };
    // Mudar filtro ou busca volta para a primeira página.
    if (patch.page === undefined && (patch.cat !== undefined || patch.q !== undefined)) next.page = 1;
    setCat(next.cat);
    setQ(next.q);
    setPage(next.page);
    syncUrl(next);
  };

  const filtered = useMemo(() => {
    const needle = normalizeSearch(q);
    return articles.filter((a) => {
      if (cat && a.category?.id !== cat) return false;
      if (!needle) return true;
      const hay = normalizeSearch(`${a.title} ${a.excerpt} ${a.category ? pick(a.category.title, locale).text : ""}`);
      return needle.split(" ").every((w) => hay.includes(w));
    });
  }, [articles, cat, q, locale]);

  const { items, pages, current } = paginate(filtered, page, PAGE_SIZE);
  const options = categories.map((c) => ({ id: c.id, label: pick(c.title, locale).text }));
  const filtering = Boolean(cat || q);

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-[1fr_20rem] md:items-end">
        <FilterChips label={t("categoryLabel")} allLabel={t("all")} options={options} value={cat} onChange={(id) => update({ cat: id })} />
        <div role="search">
          <label htmlFor="article-search" className="mb-1 block text-sm font-bold">
            {t("searchLabel")}
          </label>
          <div className="relative">
            <Icon name="search" size={20} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-600" />
            <input
              id="article-search"
              type="search"
              value={q}
              onChange={(e) => update({ q: e.target.value })}
              placeholder={t("searchPlaceholder")}
              autoComplete="off"
              className="min-h-12 w-full rounded-control border-2 border-navy-200 bg-white pl-10 pr-3 text-navy placeholder:text-navy-600 focus:border-navy"
            />
          </div>
        </div>
      </div>

      <p role="status" aria-live="polite" className="mt-6 text-fg-muted">
        {filtered.length > 0 || filtering ? t("results", { count: filtered.length }) : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-card border border-line bg-white p-8 text-center">
          <p className="text-lg">{filtering ? t("emptyFiltered") : t("empty")}</p>
          {filtering && (
            <button type="button" onClick={() => update({ cat: "", q: "", page: 1 })} className={buttonClasses("ghost", "md", "mt-4")}>
              {t("clear")}
            </button>
          )}
        </div>
      ) : (
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((a) => (
            <li key={a.id}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
      )}

      {pages > 1 && (
        <nav aria-label={t("paginationLabel")} className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <button type="button" disabled={current <= 1} onClick={() => update({ page: current - 1 })} className={buttonClasses("ghost", "md", "min-h-11 px-4")}>
            {t("previous")}
          </button>
          {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => update({ page: n })}
              aria-label={n === current ? t("currentPage", { n }) : t("page", { n })}
              aria-current={n === current ? "page" : undefined}
              className={`min-h-11 min-w-11 rounded-control border-2 px-3 font-bold ${n === current ? "border-navy bg-navy text-white" : "border-navy-200 hover:border-navy"}`}
            >
              {n}
            </button>
          ))}
          <button type="button" disabled={current >= pages} onClick={() => update({ page: current + 1 })} className={buttonClasses("ghost", "md", "min-h-11 px-4")}>
            {t("next")}
          </button>
        </nav>
      )}
    </div>
  );
}
