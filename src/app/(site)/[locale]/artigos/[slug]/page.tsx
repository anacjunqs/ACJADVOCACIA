import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, redirect } from "@/lib/i18n/navigation";
import { Container, Section } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Img } from "@/components/ui/img";
import { Txt } from "@/components/ui/txt";
import { RichText } from "@/components/ui/rich-text";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CtaBand } from "@/components/sections/cta-band";
import { JsonLd } from "@/components/seo/json-ld";
import { Toc } from "@/components/articles/toc";
import { ShareBar } from "@/components/articles/share-bar";
import { ArticleCard } from "@/components/articles/article-card";
import { VideoSection } from "@/components/video/video-section";
import { getArticle, getArticleParams, getRelatedArticles, getVideoById } from "@/lib/content/articles";
import { getSettings } from "@/lib/content";
import { getLocaleParam } from "@/lib/i18n/params";
import type { AppLocale } from "@/lib/i18n/routing";
import { pageMetadata, pathFor } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/site";
import { extractHeadings } from "@/lib/rich-text";
import { pick } from "@/lib/i18n/localize";
import { pillarById, pillarIcon, pillarSlug, hub } from "@/lib/services/catalog";
import { stripPending } from "@/lib/pending";
import { withThumbnails } from "@/lib/video-thumbnail";
import { videoObject } from "@/lib/seo/video-ld";
import type { PillarSlug } from "@content/services";

type Props = { params: Promise<{ locale: string; slug: string }> };

// Novos artigos publicados no CMS são gerados sob demanda e atualizados pelo webhook de revalidação.
export async function generateStaticParams() {
  return getArticleParams();
}

const hrefFor = (slug: string) => ({ pathname: "/artigos/[slug]" as const, params: { slug } });

async function load(props: Props) {
  const { slug } = await props.params;
  const locale = await getLocaleParam(props.params);
  const article = await getArticle(slug, locale);
  if (article) return { locale, article };
  // O mesmo endereço existe em outro idioma? Redireciona para lá.
  const other: AppLocale = locale === "pt" ? "en" : "pt";
  if (await getArticle(slug, other)) redirect({ href: hrefFor(slug), locale: other });
  notFound();
}

function ogImageUrl(src: string): string {
  if (!src.startsWith("https://cdn.sanity.io/")) return src;
  const u = new URL(src);
  u.searchParams.set("w", "1200");
  u.searchParams.set("h", "630");
  u.searchParams.set("fit", "crop");
  u.searchParams.set("auto", "format");
  return u.toString();
}

export async function generateMetadata(props: Props) {
  const { locale, article } = await load(props);
  const alternates: Partial<Record<AppLocale, ReturnType<typeof hrefFor>>> = { [locale]: hrefFor(article.slug) };
  if (article.translation) alternates[article.translation.language] = hrefFor(article.translation.slug);
  const og = article.seo?.ogImage ?? article.cover;
  return pageMetadata({
    locale,
    alternates,
    title: article.seo?.title ?? article.title,
    description: article.seo?.description ?? article.excerpt,
    type: "article",
    publishedTime: article.publishedAt,
    image: og ? ogImageUrl(og.src) : undefined,
    noindex: article.draft,
  });
}

export default async function ArticlePage(props: Props) {
  const { locale, article } = await load(props);
  setRequestLocale(locale);
  const [t, tn, settings, related, rawVideo] = await Promise.all([
    getTranslations("articles"),
    getTranslations("nav"),
    getSettings(),
    getRelatedArticles(article),
    getVideoById(article.videoId),
  ]);
  const [video] = rawVideo ? await withThumbnails([rawVideo]) : [];
  const headings = extractHeadings(article.body);
  const date = new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en", { dateStyle: "long", timeZone: "UTC" }).format(new Date(article.publishedAt));
  const category = article.category ? pick(article.category.title, locale).text : undefined;
  const url = absoluteUrl(pathFor(locale, hrefFor(article.slug)));
  const pillarId = article.pillar;
  const pillar = pillarId && pillarId !== "hub" ? pillarById(pillarId as PillarSlug) : undefined;
  const area = pillar
    ? { title: pillar.title[locale], href: { pathname: "/areas-de-atuacao/[pillar]" as const, params: { pillar: pillarSlug(pillar, locale) } }, icon: pillarIcon[pillar.id] }
    : pillarId === "hub"
      ? { title: hub.title[locale], href: { pathname: "/hub" as const }, icon: "globe" as const }
      : undefined;
  const otherLanguage = article.translation?.language;

  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: stripPending(article.title),
    description: stripPending(article.excerpt),
    datePublished: article.publishedAt,
    inLanguage: locale === "en" ? "en" : "pt-BR",
    mainEntityOfPage: url,
    author: { "@type": "Person", name: article.authorName },
    publisher: { "@type": "LegalService", name: pick(settings.siteName, locale).text },
    ...((article.seo?.ogImage ?? article.cover) ? { image: [(article.seo?.ogImage ?? article.cover)!.src] } : {}),
  };
  const videoLd = video ? videoObject(video) : undefined;

  return (
    <>
      <Section tone="cream" className="pb-10 pt-8 sm:pb-14 sm:pt-10" labelledBy="article-title">
        <Container>
          <div className="mb-8">
            <Breadcrumbs
              locale={locale}
              items={[{ label: tn("articlesVideos"), href: { pathname: "/artigos" } }, { label: article.title }]}
            />
          </div>
          <div className="max-w-3xl">
            <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-fg-muted">
              {category && <span className="rounded-full bg-white px-3 py-1 font-semibold text-navy">{category}</span>}
              {article.draft && <span className="rounded-full bg-[#fff3a3] px-3 py-1 font-semibold text-[#3b2f00]">{t("draftBadge")}</span>}
              <time dateTime={article.publishedAt}>{t("published", { date })}</time>
              <span>{t("readingTime", { minutes: article.readingMinutes })}</span>
            </p>
            <h1 id="article-title" className="mt-4 text-4xl sm:text-5xl">
              <Txt>{article.title}</Txt>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-fg-muted sm:text-xl">
              <Txt>{article.excerpt}</Txt>
            </p>
            <p className="mt-5 font-semibold">{t("by", { name: article.authorName })}</p>
            {article.translation && otherLanguage && (
              <p className="mt-4">
                <Link
                  href={hrefFor(article.translation.slug)}
                  locale={otherLanguage}
                  lang={otherLanguage}
                  hrefLang={otherLanguage}
                  className="inline-flex min-h-11 items-center gap-2 font-bold underline underline-offset-4"
                >
                  <Icon name="languages" size={18} />
                  {t("translationLink", { language: t(`languageName.${otherLanguage}`) })}
                </Link>
              </p>
            )}
          </div>
        </Container>
      </Section>

      <Section className="pt-10 sm:pt-12">
        <Container>
          {article.cover && (
            <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-card bg-navy-50">
              <Img src={article.cover.src} alt={pick(article.cover.alt, locale).text} fill priority sizes="(min-width: 1152px) 72rem, 100vw" className="object-cover" />
            </div>
          )}
          <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14">
            <aside className="order-first lg:self-start">
              <Toc headings={headings} />
            </aside>
            <div>
              <RichText value={article.body} />

              <div className="mt-12 space-y-6 border-t border-line pt-8">
                <p className="rounded-card bg-navy-50 p-4 text-fg-muted">{t("disclaimer")}</p>
                {area && (
                  <div className="flex flex-wrap items-center gap-3">
                    <Icon name={area.icon} />
                    <span className="font-bold">{t("relatedArea")}:</span>
                    <Link href={area.href as never} className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
                      {area.title}
                    </Link>
                  </div>
                )}
                <ShareBar url={url} title={stripPending(article.title)} />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {video && <VideoSection video={video} />}

      {related.length > 0 && (
        <Section tone="cream" labelledBy="related-title">
          <Container>
            <h2 id="related-title" className="text-3xl sm:text-4xl">
              {t("related")}
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <li key={a.id}>
                  <ArticleCard article={a} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <CtaBand locale={locale} plainTitle={t("ctaTitle")} plainText={t("ctaText")} />
      <JsonLd data={ld} />
      {videoLd && <JsonLd data={videoLd} />}
    </>
  );
}

export const dynamicParams = true;
