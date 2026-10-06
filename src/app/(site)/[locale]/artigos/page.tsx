import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/container";
import { Loc } from "@/components/ui/loc";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ContentTabs } from "@/components/articles/tabs-nav";
import { ArticleBrowser } from "@/components/articles/article-browser";
import { categoriesOf, getArticleSummaries } from "@/lib/content/articles";
import { toCardData } from "@/lib/content/article-card-data";
import { getPageTexts } from "@/lib/content";
import { getLocaleParam } from "@/lib/i18n/params";
import { pageMetadata, bothLocales } from "@/lib/seo/metadata";
import { pick } from "@/lib/i18n/localize";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = await getLocaleParam(params);
  const [t, texts] = await Promise.all([getTranslations({ locale, namespace: "nav" }), getPageTexts()]);
  return pageMetadata({ locale, alternates: bothLocales("/artigos"), title: t("articlesVideos"), description: pick(texts.articles.intro, locale).text });
}

export default async function ArticlesPage({ params }: Props) {
  const locale = await getLocaleParam(params);
  setRequestLocale(locale);
  const [t, tn, texts, articles] = await Promise.all([getTranslations("articles"), getTranslations("nav"), getPageTexts(), getArticleSummaries(locale)]);
  const categories = categoriesOf(articles);

  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs locale={locale} items={[{ label: tn("articlesVideos") }]} />}
        eyebrow={t("eyebrow")}
        title={tn("articlesVideos")}
        intro={<Loc value={texts.articles.intro} locale={locale} />}
      >
        <div className="mt-8">
          <ContentTabs />
        </div>
      </PageHero>
      <Section>
        <Container>
          <ArticleBrowser articles={toCardData(articles, locale)} categories={categories} />
        </Container>
      </Section>
      <CtaBand locale={locale} />
    </>
  );
}
