import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Loc } from "@/components/ui/loc";
import { PageHero } from "@/components/sections/page-hero";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ContactForm, type AreaOption } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";
import { JsonLd } from "@/components/seo/json-ld";
import { getPageTexts, getSettings } from "@/lib/content";
import { getLocaleParam } from "@/lib/i18n/params";
import { pageMetadata, bothLocales, pathFor } from "@/lib/seo/metadata";
import { pick } from "@/lib/i18n/localize";
import { hub, pillars } from "@/lib/services/catalog";
import { whatsappLink } from "@/lib/nav";
import { absoluteUrl } from "@/lib/seo/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = await getLocaleParam(params);
  const [t, texts] = await Promise.all([getTranslations({ locale, namespace: "nav" }), getPageTexts()]);
  return pageMetadata({ locale, alternates: bothLocales("/contato"), title: t("contact"), description: pick(texts.contact.intro, locale).text });
}

export default async function ContactPage({ params }: Props) {
  const locale = await getLocaleParam(params);
  setRequestLocale(locale);
  const [t, tn, texts, settings] = await Promise.all([getTranslations("contact"), getTranslations("nav"), getPageTexts(), getSettings()]);

  const areas: AreaOption[] = [
    ...pillars.map((p) => ({ value: p.id, label: p.title[locale] })),
    { value: "hub", label: hub.title[locale] },
    { value: "unsure", label: t("fields.areaUnsure") },
  ];
  const wa = whatsappLink(settings.whatsapp, pick(settings.whatsappMessage, locale).text);

  const page = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: absoluteUrl(pathFor(locale, "/contato")),
    name: tn("contact"),
  };

  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs locale={locale} items={[{ label: tn("contact") }]} />}
        eyebrow={t("eyebrow")}
        title={tn("contact")}
        intro={<Loc value={texts.contact.intro} locale={locale} />}
      />
      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
            <div>
              <h2 className="font-serif text-3xl">{t("formTitle")}</h2>
              <aside role="note" aria-label={t("noticeTitle")} className="mt-5 flex gap-3 rounded-card border border-line bg-gold-50 p-4">
                <Icon name="info" className="mt-0.5 shrink-0 text-navy" />
                <div>
                  <p className="font-bold">{t("noticeTitle")}</p>
                  <p className="mt-1">{t("notice")}</p>
                </div>
              </aside>
              <div className="mt-6">
                <ContactForm areas={areas} whatsappHref={wa} />
              </div>
            </div>
            <ContactInfo settings={settings} locale={locale} />
          </div>
        </Container>
      </Section>
      <JsonLd data={page} />
    </>
  );
}
