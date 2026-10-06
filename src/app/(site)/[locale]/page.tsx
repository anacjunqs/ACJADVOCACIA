import { setRequestLocale } from "next-intl/server";
import { CtaBand } from "@/components/sections/cta-band";
import { Hero } from "@/components/home/hero";
import { HubSpotlight } from "@/components/home/hub-spotlight";
import { PillarsSummary } from "@/components/home/pillars-summary";
import { ProcessSteps } from "@/components/home/process-steps";
import { FounderTeaser } from "@/components/home/founder-teaser";
import { ValuesHighlight } from "@/components/home/values-highlight";
import { LatestArticles } from "@/components/home/latest-articles";
import { FeaturedVideo } from "@/components/home/featured-video";
import { JsonLd } from "@/components/seo/json-ld";
import { getFounder, getPageTexts, getSettings, getValues } from "@/lib/content";
import { getLocaleParam } from "@/lib/i18n/params";
import { pageMetadata, bothLocales, pathFor } from "@/lib/seo/metadata";
import { pick } from "@/lib/i18n/localize";
import { absoluteUrl } from "@/lib/seo/site";
import { stripPending } from "@/lib/pending";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = await getLocaleParam(params);
  const [s, texts] = await Promise.all([getSettings(), getPageTexts()]);
  return pageMetadata({
    locale,
    alternates: bothLocales("/"),
    title: pick(s.siteName, locale).text,
    description: pick(texts.home.heroSubtitle, locale).text || pick(s.seo.description, locale).text,
  });
}

export default async function Home({ params }: Props) {
  const locale = await getLocaleParam(params);
  setRequestLocale(locale);
  const [settings, founder, texts, values] = await Promise.all([getSettings(), getFounder(), getPageTexts(), getValues()]);

  const legalService = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    name: pick(settings.siteName, locale).text,
    description: stripPending(pick(settings.seo.description, locale).text),
    url: absoluteUrl(pathFor(locale, "/")),
    ...(settings.logo ? { logo: settings.logo.src } : {}),
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
    ...(settings.social.length > 0 ? { sameAs: settings.social.map((s) => s.url) } : {}),
    founder: { "@type": "Person", name: founder.name },
  };

  return (
    <>
      <Hero locale={locale} texts={texts.home} founder={founder} />
      <HubSpotlight locale={locale} texts={texts.home} />
      <PillarsSummary locale={locale} />
      <ProcessSteps steps={settings.processSteps} locale={locale} />
      <FounderTeaser founder={founder} locale={locale} />
      <ValuesHighlight values={values} locale={locale} />
      <LatestArticles locale={locale} />
      <FeaturedVideo locale={locale} />
      <CtaBand locale={locale} />
      <JsonLd data={legalService} />
    </>
  );
}
