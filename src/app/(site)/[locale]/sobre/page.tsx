import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Loc } from "@/components/ui/loc";
import { Txt } from "@/components/ui/txt";
import { RichText } from "@/components/ui/rich-text";
import { Icon } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { FounderPhoto } from "@/components/sections/founder-photo";
import { CtaBand } from "@/components/sections/cta-band";
import { ConsultActions } from "@/components/sections/consult-actions";
import { JsonLd } from "@/components/seo/json-ld";
import { getFounder, getSettings } from "@/lib/content";
import { getLocaleParam } from "@/lib/i18n/params";
import { pageMetadata, bothLocales, pathFor } from "@/lib/seo/metadata";
import { pick, pickRich } from "@/lib/i18n/localize";
import { absoluteUrl } from "@/lib/seo/site";
import { stripPending } from "@/lib/pending";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = await getLocaleParam(params);
  const [t, founder] = await Promise.all([getTranslations({ locale, namespace: "nav" }), getFounder()]);
  return pageMetadata({
    locale,
    alternates: bothLocales("/sobre"),
    title: `${founder.name} — ${t("about")}`,
    description: pick(founder.summary, locale).text,
  });
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-card border border-line bg-white p-6">
      <h3 className="font-serif text-2xl">{title}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default async function AboutPage({ params }: Props) {
  const locale = await getLocaleParam(params);
  setRequestLocale(locale);
  const [t, tn, founder, settings] = await Promise.all([getTranslations("founder"), getTranslations("nav"), getFounder(), getSettings()]);

  const summary = pick(founder.summary, locale);
  const bio = pickRich(founder.bio, locale);
  const oab = t("oab", { uf: founder.oab.uf, number: founder.oab.number });
  const hasLists = founder.education.length + founder.languages.length + founder.associations.length > 0;

  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: founder.name,
    jobTitle: locale === "pt" ? "Advogada" : "Lawyer",
    identifier: `OAB/${founder.oab.uf} ${founder.oab.number}`,
    url: absoluteUrl(pathFor(locale, "/sobre")),
    description: stripPending(summary.text),
    ...(founder.photo ? { image: founder.photo.src } : {}),
    ...(settings.social.length > 0 ? { sameAs: settings.social.map((s) => s.url) } : {}),
    worksFor: { "@type": "LegalService", name: pick(settings.siteName, locale).text },
  };

  return (
    <>
      <Section tone="cream" className="pb-12 pt-8 sm:pb-16 sm:pt-10" labelledBy="about-title">
        <Container>
          <div className="mb-8">
            <Breadcrumbs locale={locale} items={[{ label: tn("about") }]} />
          </div>
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <div>
              <Eyebrow>{t("eyebrow")}</Eyebrow>
              <h1 id="about-title" className="text-4xl sm:text-5xl">
                {founder.name}
              </h1>
              <p className="mt-3 text-lg font-bold">{oab}</p>
              <p className="mt-5 text-lg leading-relaxed text-fg-muted sm:text-xl" lang={summary.lang}>
                <Txt>{summary.text}</Txt>
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ConsultActions locale={locale} />
              </div>
            </div>
            <FounderPhoto photo={founder.photo} locale={locale} name={founder.name} placeholderLabel={t("photoMissing")} priority className="mx-auto max-w-sm lg:max-w-none" />
          </div>
        </Container>
      </Section>

      {bio.blocks.length > 0 && (
        <Section labelledBy="bio-title">
          <Container narrow>
            <h2 id="bio-title" className="mb-6 text-3xl sm:text-4xl">
              {t("bio")}
            </h2>
            <RichText value={bio.blocks} lang={bio.lang} />
          </Container>
        </Section>
      )}

      {founder.quote && (
        <Section tone="navy" className="py-14">
          <Container narrow>
            <figure className="text-center">
              <Icon name="quote" size={36} className="accent-on-navy mx-auto" />
              <blockquote className="mt-4 font-serif text-2xl leading-snug sm:text-3xl">
                <Loc value={founder.quote.text} locale={locale} />
              </blockquote>
              {founder.quote.attribution && (
                <figcaption className="mt-4 text-navy-100">
                  <Loc value={founder.quote.attribution} locale={locale} />
                </figcaption>
              )}
            </figure>
          </Container>
        </Section>
      )}

      {founder.timeline.length > 0 && (
        <Section tone="cream" labelledBy="timeline-title">
          <Container narrow>
            <h2 id="timeline-title" className="text-3xl sm:text-4xl">
              {t("timeline")}
            </h2>
            <ol className="mt-8 space-y-8 border-l-2 border-navy-200 pl-6">
              {founder.timeline.map((it, i) => (
                <li key={i} className="relative">
                  <span aria-hidden="true" className="absolute -left-[1.95rem] top-2 size-3 rounded-full bg-navy" />
                  <p className="font-bold text-fg-muted">
                    <Txt>{it.year}</Txt>
                  </p>
                  <Loc as="h3" value={it.title} locale={locale} className="font-serif text-2xl leading-snug" />
                  {it.description && <Loc as="p" value={it.description} locale={locale} className="mt-1 text-fg-muted" />}
                </li>
              ))}
            </ol>
          </Container>
        </Section>
      )}

      {hasLists && (
        <Section labelledBy="details-title">
          <Container>
            <h2 id="details-title" className="sr-only">
              {t("education")}, {t("languages")}, {t("associations")}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {founder.education.length > 0 && (
                <Block title={t("education")}>
                  <ul className="space-y-3">
                    {founder.education.map((e, i) => (
                      <li key={i}>
                        <Loc as="span" value={e.title} locale={locale} className="block font-semibold" />
                        {e.detail && <Loc as="span" value={e.detail} locale={locale} className="block text-fg-muted" />}
                      </li>
                    ))}
                  </ul>
                </Block>
              )}
              {founder.languages.length > 0 && (
                <Block title={t("languages")}>
                  <ul className="space-y-2">
                    {founder.languages.map((l, i) => (
                      <li key={i}>
                        <Loc value={l.name} locale={locale} />
                      </li>
                    ))}
                  </ul>
                </Block>
              )}
              {founder.associations.length > 0 && (
                <Block title={t("associations")}>
                  <ul className="space-y-2">
                    {founder.associations.map((a, i) => (
                      <li key={i}>
                        <Loc value={a.name} locale={locale} />
                      </li>
                    ))}
                  </ul>
                </Block>
              )}
            </div>
          </Container>
        </Section>
      )}

      {founder.approach && (
        <Section tone="cream" labelledBy="approach-title">
          <Container narrow>
            <h2 id="approach-title" className="text-3xl sm:text-4xl">
              {t("approach")}
            </h2>
            <Loc as="p" value={founder.approach} locale={locale} className="mt-5 text-lg leading-relaxed" />
          </Container>
        </Section>
      )}

      <CtaBand locale={locale} title={founder.cta.title} text={founder.cta.text} />
      <JsonLd data={person} />
    </>
  );
}
