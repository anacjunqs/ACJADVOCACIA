import { setRequestLocale } from "next-intl/server";
import { StubPage } from "@/components/ui/stub-page";
import { getSettings } from "@/lib/content";
import { pick } from "@/lib/i18n/localize";
import { pageMetadata } from "@/lib/seo/metadata";
import { getLocaleParam } from "@/lib/i18n/params";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = await getLocaleParam(params);
  const s = await getSettings();
  return pageMetadata({
    locale,
    alternates: { pt: "/", en: "/" },
    title: pick(s.siteName, locale).text,
    description: pick(s.seo.description, locale).text,
  });
}

export default async function Home({ params }: Props) {
  const locale = await getLocaleParam(params);
  setRequestLocale(locale);
  const s = await getSettings();
  return <StubPage title={pick(s.siteName, locale).text} />;
}
