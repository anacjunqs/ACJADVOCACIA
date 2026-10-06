import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/container";
import { Loc } from "@/components/ui/loc";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { ContentTabs } from "@/components/articles/tabs-nav";
import { VideoGrid } from "@/components/video/video-grid";
import { categoriesOf, getVideos } from "@/lib/content/articles";
import { getPageTexts } from "@/lib/content";
import { getLocaleParam } from "@/lib/i18n/params";
import { pageMetadata, bothLocales } from "@/lib/seo/metadata";
import { pick } from "@/lib/i18n/localize";
import { withThumbnails } from "@/lib/video-thumbnail";
import { videoObject } from "@/lib/seo/video-ld";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = await getLocaleParam(params);
  const [t, texts] = await Promise.all([getTranslations({ locale, namespace: "articles" }), getPageTexts()]);
  return pageMetadata({ locale, alternates: bothLocales("/videos"), title: t("tabVideos"), description: pick(texts.videos.intro, locale).text });
}

export default async function VideosPage({ params }: Props) {
  const locale = await getLocaleParam(params);
  setRequestLocale(locale);
  const [t, tn, texts, raw] = await Promise.all([getTranslations("articles"), getTranslations("nav"), getPageTexts(), getVideos(locale)]);
  const videos = await withThumbnails(raw);
  const categories = categoriesOf(videos);
  const ld = videos.map(videoObject).filter((x): x is Record<string, unknown> => Boolean(x));

  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs locale={locale} items={[{ label: tn("articlesVideos"), href: { pathname: "/artigos" } }, { label: t("tabVideos") }]} />}
        eyebrow={t("eyebrow")}
        title={tn("articlesVideos")}
        intro={<Loc value={texts.videos.intro} locale={locale} />}
      >
        <div className="mt-8">
          <ContentTabs />
        </div>
      </PageHero>
      <Section>
        <Container>
          <VideoGrid videos={videos} categories={categories} />
        </Container>
      </Section>
      <CtaBand locale={locale} />
      {ld.length > 0 && <JsonLd data={ld} />}
    </>
  );
}
