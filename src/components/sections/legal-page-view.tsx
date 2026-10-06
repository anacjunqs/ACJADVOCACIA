import { getTranslations } from "next-intl/server";
import { Container, Section } from "@/components/ui/container";
import { RichText } from "@/components/ui/rich-text";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { getLegalPage } from "@/lib/content";
import { pick, pickRich } from "@/lib/i18n/localize";
import type { AppLocale } from "@/lib/i18n/routing";
import type { LegalPageId } from "@/lib/content/types";
import type { Href } from "@/lib/seo/metadata";

const hrefOf: Record<LegalPageId, Href> = {
  privacy: { pathname: "/privacidade" },
  terms: { pathname: "/termos" },
  cookies: { pathname: "/cookies" },
};

/** Página legal (Privacidade, Termos, Cookies), editável no CMS. */
export async function LegalPageView({ id, locale }: { id: LegalPageId; locale: AppLocale }) {
  const [t, page] = await Promise.all([getTranslations("legal"), getLegalPage(id)]);
  const title = pick(page.title, locale).text;
  const body = pickRich(page.body, locale);
  const date = page.updatedAt ? new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en", { dateStyle: "long", timeZone: "UTC" }).format(new Date(page.updatedAt)) : undefined;
  return (
    <Section tone="white" className="pt-8 sm:pt-10" labelledBy="legal-title">
      <Container narrow>
        <div className="mb-8">
          <Breadcrumbs locale={locale} items={[{ label: title, href: hrefOf[id] }]} />
        </div>
        <Eyebrow>{t("eyebrow")}</Eyebrow>
        <h1 id="legal-title" className="text-4xl sm:text-5xl">
          {title}
        </h1>
        {date && <p className="mt-3 text-fg-muted">{t("updated", { date })}</p>}
        <div className="mt-10">
          <RichText value={body.blocks} lang={body.lang} />
        </div>
      </Container>
    </Section>
  );
}
