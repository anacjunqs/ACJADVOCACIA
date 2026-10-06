import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Loc } from "@/components/ui/loc";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { getPageTexts, getValues } from "@/lib/content";
import { getLocaleParam } from "@/lib/i18n/params";
import { pageMetadata, bothLocales } from "@/lib/seo/metadata";
import { pick } from "@/lib/i18n/localize";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = await getLocaleParam(params);
  const [t, texts] = await Promise.all([getTranslations({ locale, namespace: "nav" }), getPageTexts()]);
  return pageMetadata({ locale, alternates: bothLocales("/valores"), title: t("values"), description: pick(texts.values.intro, locale).text });
}

export default async function ValuesPage({ params }: Props) {
  const locale = await getLocaleParam(params);
  setRequestLocale(locale);
  const [t, tn, texts, values] = await Promise.all([getTranslations("values"), getTranslations("nav"), getPageTexts(), getValues()]);

  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs locale={locale} items={[{ label: tn("values") }]} />}
        eyebrow={t("eyebrow")}
        title={tn("values")}
        intro={<Loc value={texts.values.intro} locale={locale} />}
      />
      <Section>
        <Container>
          <ul className="grid gap-6 sm:grid-cols-2">
            {values.map((v, i) => (
              <li key={i} className="flex gap-5 rounded-card border border-line bg-white p-6 sm:p-8">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy">
                  <Icon name={v.icon} size={26} />
                </span>
                <div>
                  <Loc as="h2" value={v.title} locale={locale} className="font-serif text-2xl leading-snug" />
                  <Loc as="p" value={v.description} locale={locale} className="mt-2 text-fg-muted" />
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <CtaBand locale={locale} />
    </>
  );
}
