import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalPageView } from "@/components/sections/legal-page-view";
import { getLegalPage } from "@/lib/content";
import { getLocaleParam } from "@/lib/i18n/params";
import { pageMetadata, bothLocales } from "@/lib/seo/metadata";
import { pick } from "@/lib/i18n/localize";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = await getLocaleParam(params);
  const page = await getLegalPage("privacy");
  return pageMetadata({ locale, alternates: bothLocales("/privacidade"), title: pick(page.title, locale).text });
}

export default async function Page({ params }: Props) {
  const locale = await getLocaleParam(params);
  setRequestLocale(locale);
  await getTranslations("legal");
  return <LegalPageView id="privacy" locale={locale} />;
}
