"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { Img } from "@/components/ui/img";
import { Txt } from "@/components/ui/txt";
import { pick } from "@/lib/i18n/localize";
import type { ArticleCardData } from "@/lib/content/types";
import type { AppLocale } from "@/lib/i18n/routing";

/** Cartão de artigo. O título é o link e o cartão inteiro é clicável. */
export function ArticleCard({ article, headingLevel = "h3" }: { article: ArticleCardData; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  const t = useTranslations("articles");
  const locale = useLocale() as AppLocale;
  const category = article.categoryLabel;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white transition-shadow hover:shadow-soft focus-within:outline focus-within:outline-3 focus-within:outline-offset-3">
      <div className="relative aspect-[16/9] bg-navy-50">
        {article.cover ? (
          <Img src={article.cover.src} alt={pick(article.cover.alt, locale).text} fill sizes="(min-width: 1024px) 24rem, (min-width: 640px) 45vw, 90vw" className="object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-navy-300" aria-hidden="true">
            <Icon name="book-open" size={44} />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-fg-muted">
          {category && <span className="rounded-full bg-navy-50 px-2.5 py-0.5 font-semibold text-navy">{category}</span>}
          {article.draft && <span className="rounded-full bg-[#fff3a3] px-2.5 py-0.5 font-semibold text-[#3b2f00]">{t("draftBadge")}</span>}
          <time dateTime={article.publishedAt}>{article.dateLabel}</time>
          <span>{t("readingTime", { minutes: article.readingMinutes })}</span>
        </p>
        <Heading className="mt-3 font-serif text-2xl leading-snug">
          <Link
            href={{ pathname: "/artigos/[slug]", params: { slug: article.slug } }}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            <Txt>{article.title}</Txt>
          </Link>
        </Heading>
        <p className="mt-2 flex-1 text-fg-muted">
          <Txt>{article.excerpt}</Txt>
        </p>
        <span className="mt-4 inline-flex items-center gap-2 font-bold" aria-hidden="true">
          {t("readArticle")}
          <Icon name="arrow-right" size={18} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
