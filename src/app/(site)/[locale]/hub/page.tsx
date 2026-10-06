import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Loc } from "@/components/ui/loc";
import { Txt } from "@/components/ui/txt";
import { PageHero } from "@/components/sections/page-hero";
import { RoutesMotif } from "@/components/sections/routes-motif";
import { CtaBand } from "@/components/sections/cta-band";
import { ConsultActions } from "@/components/sections/consult-actions";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { HubAreas } from "@/components/services/hub-areas";
import { Faq } from "@/components/services/faq";
import { getPillarContent, getSettings } from "@/lib/content";
import { getLocaleParam } from "@/lib/i18n/params";
import { pageMetadata, bothLocales } from "@/lib/seo/metadata";
import { pick } from "@/lib/i18n/localize";
import { hub } from "@/lib/services/catalog";
import { hubServices } from "@content/services";
import { toList } from "@/lib/text-list";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = await getLocaleParam(params);
  return pageMetadata({
    locale,
    alternates: bothLocales("/hub"),
    title: hub.title[locale],
    description: hub.summary[locale],
  });
}

export default async function HubPage({ params }: Props) {
  const locale = await getLocaleParam(params);
  setRequestLocale(locale);
  const [t, th, tn, content, settings] = await Promise.all([
    getTranslations("areas"),
    getTranslations("hub"),
    getTranslations("nav"),
    getPillarContent("hub"),
    getSettings(),
  ]);
  const { fromPillars, exclusive } = hubServices();
  const forWho = pick(content.whoFor, locale);
  const when = pick(content.whenToSeek, locale);

  return (
    <>
      <PageHero
        tone="navy"
        decoration={<RoutesMotif />}
        breadcrumbs={
          <Breadcrumbs
            locale={locale}
            items={[{ label: tn("practiceAreas"), href: { pathname: "/areas-de-atuacao" } }, { label: hub.title[locale] }]}
          />
        }
        eyebrow={th("eyebrow")}
        title={hub.title[locale]}
        intro={hub.summary[locale]}
        icon="globe"
        actions={<ConsultActions locale={locale} onNavy size="lg" />}
      />

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-14">
            <Loc as="p" value={content.intro} locale={locale} className="text-lg leading-relaxed sm:text-xl" />
            <div className="space-y-6">
              {[
                { title: t("forWho"), data: forWho },
                { title: t("whenToSeek"), data: when },
              ].map((b) => (
                <div key={b.title} className="rounded-card border border-line p-6" lang={b.data.lang}>
                  <h2 className="font-serif text-2xl">{b.title}</h2>
                  <ul className="mt-4 space-y-3">
                    {toList(b.data.text).map((it, i) => (
                      <li key={i} className="flex gap-3">
                        <Icon name="check" size={20} className="mt-1 shrink-0 text-navy" />
                        <span>
                          <Txt>{it}</Txt>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="cream" labelledBy="how-title">
        <Container narrow>
          <div className="rounded-card border border-line bg-white p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <Icon name="info" className="mt-1 shrink-0 text-navy" />
              <div>
                <h2 id="how-title" className="font-serif text-2xl">
                  {th("howWeWork")}
                </h2>
                <Loc as="p" value={settings.jurisdictionNotice} locale={locale} className="mt-3 text-fg-muted" />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section labelledBy="by-area-title">
        <Container>
          <h2 id="by-area-title" className="text-3xl sm:text-4xl">
            {th("byAreaTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-fg-muted">{th("byAreaIntro")}</p>
          <div className="mt-8">
            <HubAreas entries={fromPillars} locale={locale} />
          </div>
        </Container>
      </Section>

      <Section tone="cream" labelledBy="exclusive-title">
        <Container>
          <h2 id="exclusive-title" className="text-3xl sm:text-4xl">
            {th("exclusiveTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-lg text-fg-muted">{th("exclusiveIntro")}</p>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {exclusive.map((g) => (
              <div key={g.key} className="rounded-card border border-line bg-white p-6">
                <h3 className="font-serif text-2xl leading-snug">{g.title[locale]}</h3>
                <ul className="mt-4 space-y-2">
                  {g.services.map((s) => (
                    <li key={s.slug} className="flex gap-3">
                      <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-navy" />
                      <span className="leading-snug">{s.title[locale]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Faq items={content.faq} locale={locale} />
      <CtaBand locale={locale} />
    </>
  );
}
