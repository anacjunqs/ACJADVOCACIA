import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Container, Section } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { ArticleCard } from "@/components/articles/article-card";
import { getArticleSummaries } from "@/lib/content/articles";
import { toCardData } from "@/lib/content/article-card-data";
import type { AppLocale } from "@/lib/i18n/routing";

/** Os 3 artigos mais recentes no idioma. Sem artigos publicados, a seção não aparece. */
export async function LatestArticles({ locale }: { locale: AppLocale }) {
  const [t, all] = await Promise.all([getTranslations("home"), getArticleSummaries(locale)]);
  const latest = toCardData(all.slice(0, 3), locale);
  if (latest.length === 0) return null;
  return (
    <Section labelledBy="latest-articles-title">
      <Container>
        <h2 id="latest-articles-title" className="text-3xl sm:text-4xl">
          {t("articlesTitle")}
        </h2>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((a) => (
            <li key={a.id}>
              <ArticleCard article={a} />
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Link href="/artigos" className="inline-flex min-h-11 items-center gap-2 font-bold underline underline-offset-4">
            {t("articlesCta")}
            <Icon name="arrow-right" size={18} />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
