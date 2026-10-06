import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Loc } from "@/components/ui/loc";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ReviewsSection } from "@/components/reviews/reviews-section";
import { getPageTexts } from "@/lib/content";
import { getLocaleParam } from "@/lib/i18n/params";
import { pageMetadata, bothLocales } from "@/lib/seo/metadata";
import { pick } from "@/lib/i18n/localize";
import { testimonialsEnabled } from "@/lib/seo/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = await getLocaleParam(params);
  if (!testimonialsEnabled()) return {};
  const [t, texts] = await Promise.all([getTranslations({ locale, namespace: "nav" }), getPageTexts()]);
  return pageMetadata({ locale, alternates: bothLocales("/depoimentos"), title: t("testimonials"), description: pick(texts.testimonials.intro, locale).text });
}

/** Com NEXT_PUBLIC_ENABLE_TESTIMONIALS desligada (padrão), esta rota responde 404 e não chama o Google. */
export default async function TestimonialsPage({ params }: Props) {
  if (!testimonialsEnabled()) notFound();
  const locale = await getLocaleParam(params);
  setRequestLocale(locale);
  const [tn, texts] = await Promise.all([getTranslations("nav"), getPageTexts()]);
  return (
    <>
      <PageHero
        breadcrumbs={<Breadcrumbs locale={locale} items={[{ label: tn("testimonials") }]} />}
        title={tn("testimonials")}
        intro={<Loc value={texts.testimonials.intro} locale={locale} />}
      />
      <ReviewsSection variant="page" />
      <CtaBand locale={locale} />
    </>
  );
}
