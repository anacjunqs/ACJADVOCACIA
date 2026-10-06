import type { ArticleCardData, ArticleSummary } from "./types";
import type { AppLocale } from "@/lib/i18n/routing";
import { pick } from "@/lib/i18n/localize";

/** Formata data e categoria no servidor e devolve dados prontos para o cartão de artigo. */
export function toCardData(articles: ArticleSummary[], locale: AppLocale): ArticleCardData[] {
  const fmt = new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en", { dateStyle: "medium", timeZone: "UTC" });
  return articles.map((a) => ({
    ...a,
    dateLabel: fmt.format(new Date(a.publishedAt)),
    categoryLabel: a.category ? pick(a.category.title, locale).text : undefined,
  }));
}
