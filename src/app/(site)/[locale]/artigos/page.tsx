import { setRequestLocale, getTranslations } from "next-intl/server";
import { StubPage } from "@/components/ui/stub-page";
import { pageMetadata } from "@/lib/seo/metadata";
import { getLocaleParam } from "@/lib/i18n/params";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const locale = await getLocaleParam(params);
  const t = await getTranslations({ locale, namespace: "nav" });
  return pageMetadata({ locale, alternates: { pt: "/artigos", en: "/artigos" }, title: t("articlesVideos") });
}

export default async function Page({ params }: Props) {
  const locale = await getLocaleParam(params);
  setRequestLocale(locale);
  const t = await getTranslations("nav");
  return <StubPage title={t("articlesVideos")} />;
}
