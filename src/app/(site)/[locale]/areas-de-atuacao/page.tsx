import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/container";
import { Loc } from "@/components/ui/loc";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PillarCard } from "@/components/services/pillar-card";
import { getPageTexts } from "@/lib/content";
import { getLocaleParam } from "@/lib/i18n/params";
import { pageMetadata, bothLocales } from "@/lib/seo/metadata";
import { pick } from "@/lib/i18n/localize";
import { hub, hubIcon, pillarIcon, pillarSlug, pillars } from "@/lib/services/catalog";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = await getLocaleParam(params);
  const [t, texts] = await Promise.all([getTranslations({ locale, namespace: "nav" }), getPageTexts()]);
  return pageMetadata({
    locale,
    alternates: bothLocales("/areas-de-atuacao"),
    title: t("practiceAreas"),
    description: pick(texts.areasIndex.intro, locale).text,
  });
}

export default async function AreasIndexPage({ params }: Props) {
  const locale = await getLocaleParam(params);
  setRequestLocale(locale);
  const [t, tn, texts] = await Promise.all([getTranslations("areas"), getTranslations("nav"), getPageTexts()]);
  const learnMore = (await getTranslations("common"))("learnMore");

  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs locale={locale} items={[{ label: tn("practiceAreas") }]} />}
        eyebrow={t("indexEyebrow")}
        title={tn("practiceAreas")}
        intro={<Loc value={texts.areasIndex.intro} locale={locale} />}
      />
      <Section>
        <Container>
          <div className="mb-6">
            <PillarCard
              featured
              headingLevel="h2"
              badge={t("hubBadge")}
              title={hub.title[locale]}
              summary={t("hubCardText")}
              icon={hubIcon}
              href={{ pathname: "/hub" }}
              cta={learnMore}
            />
          </div>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <li key={p.id}>
                <PillarCard
                  headingLevel="h2"
                  title={p.title[locale]}
                  summary={p.summary[locale]}
                  icon={pillarIcon[p.id]}
                  href={{ pathname: "/areas-de-atuacao/[pillar]", params: { pillar: pillarSlug(p, locale) } }}
                  cta={learnMore}
                />
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <CtaBand locale={locale} plainTitle={t("helpTitle")} plainText={t("helpText")} />
    </>
  );
}
