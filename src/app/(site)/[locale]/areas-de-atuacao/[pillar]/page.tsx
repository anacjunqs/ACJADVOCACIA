import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/lib/i18n/navigation";
import { Container, Section } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Loc } from "@/components/ui/loc";
import { Txt } from "@/components/ui/txt";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { ConsultActions } from "@/components/sections/consult-actions";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ServiceGroups } from "@/components/services/service-groups";
import { InternationalBlock } from "@/components/services/international-block";
import { Faq } from "@/components/services/faq";
import { VideoSection } from "@/components/video/video-section";
import { getVideoById } from "@/lib/content/articles";
import { withThumbnails } from "@/lib/video-thumbnail";
import { getPillarContent } from "@/lib/content";
import { getLocaleParam } from "@/lib/i18n/params";
import { locales } from "@/lib/i18n/routing";
import { pageMetadata } from "@/lib/seo/metadata";
import { pick } from "@/lib/i18n/localize";
import { pillarBySlug, pillarIcon, pillarSlug, pillars } from "@/lib/services/catalog";
import { servicesByPillar } from "@content/services";
import { toList } from "@/lib/text-list";

type Props = { params: Promise<{ locale: string; pillar: string }> };

export function generateStaticParams() {
  return locales.flatMap((locale) => pillars.map((p) => ({ locale, pillar: pillarSlug(p, locale) })));
}

const hrefFor = (slug: string) => ({ pathname: "/areas-de-atuacao/[pillar]" as const, params: { pillar: slug } });

async function resolvePillar({ params }: Props) {
  const { pillar: slug } = await params;
  const locale = await getLocaleParam(params);
  const pillar = pillarBySlug(slug, locale);
  if (pillar) return { locale, pillar };
  // Slug de outro idioma (link antigo ou digitado): redireciona para o endereço correto.
  const other = locale === "pt" ? "en" : "pt";
  const wrong = pillarBySlug(slug, other);
  if (wrong) redirect({ href: hrefFor(pillarSlug(wrong, locale)), locale });
  notFound();
}

export async function generateMetadata(props: Props) {
  const { locale, pillar } = await resolvePillar(props);
  return pageMetadata({
    locale,
    alternates: { pt: hrefFor(pillarSlug(pillar, "pt")), en: hrefFor(pillarSlug(pillar, "en")) },
    title: pillar.title[locale],
    description: pillar.summary[locale],
  });
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <Icon name="check" size={20} className="mt-1 shrink-0 text-navy" />
          <span>
            <Txt>{it}</Txt>
          </span>
        </li>
      ))}
    </ul>
  );
}

export default async function PillarPage(props: Props) {
  const { locale, pillar } = await resolvePillar(props);
  setRequestLocale(locale);
  const [t, tn, content] = await Promise.all([getTranslations("areas"), getTranslations("nav"), getPillarContent(pillar.id)]);

  const rawVideo = await getVideoById(content.videoId);
  const [video] = rawVideo ? await withThumbnails([rawVideo]) : [];
  const groups = servicesByPillar(pillar.id);
  const international = groups.flatMap((g) => g.services).filter((s) => s.international);
  const forWho = pick(content.whoFor, locale);
  const when = pick(content.whenToSeek, locale);

  return (
    <>
      <PageHero
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            items={[
              { label: tn("practiceAreas"), href: { pathname: "/areas-de-atuacao" } },
              { label: pillar.title[locale] },
            ]}
          />
        }
        eyebrow={t("eyebrow")}
        title={pillar.title[locale]}
        intro={pillar.summary[locale]}
        icon={pillarIcon[pillar.id]}
        actions={<ConsultActions locale={locale} />}
      />

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
            <Loc as="p" value={content.intro} locale={locale} className="text-lg leading-relaxed sm:text-xl" />
            <div className="space-y-6">
              <div className="rounded-card border border-line p-6" lang={forWho.lang}>
                <h2 className="font-serif text-2xl">{t("forWho")}</h2>
                <BulletList items={toList(forWho.text)} />
              </div>
              <div className="rounded-card border border-line p-6" lang={when.lang}>
                <h2 className="font-serif text-2xl">{t("whenToSeek")}</h2>
                <BulletList items={toList(when.text)} />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="cream" labelledBy="services-title">
        <Container>
          <h2 id="services-title" className="text-3xl sm:text-4xl">
            {t("servicesTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-fg-muted">{t("servicesIntro")}</p>
          <div className="mt-8">
            <ServiceGroups groups={groups} locale={locale} />
          </div>
        </Container>
      </Section>

      <InternationalBlock services={international} intro={content.internationalIntro} locale={locale} />
      {video && <VideoSection video={video} />}
      <Faq items={content.faq} locale={locale} tone={video ? "cream" : "white"} />
      <CtaBand locale={locale} />
    </>
  );
}
