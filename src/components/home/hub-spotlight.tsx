import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Container, Section } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Icon } from "@/components/ui/icon";
import { Loc } from "@/components/ui/loc";
import { buttonClasses } from "@/components/ui/button-styles";
import { RoutesMotif } from "@/components/sections/routes-motif";
import type { PageTexts } from "@/lib/content/types";
import type { AppLocale } from "@/lib/i18n/routing";
import { hub } from "@/lib/services/catalog";

/** Destaque do hub "Famílias entre Países": a atuação que define o escritório. */
export async function HubSpotlight({ locale, texts }: { locale: AppLocale; texts: PageTexts["home"] }) {
  const t = await getTranslations("home");
  return (
    <Section tone="navy" className="relative overflow-hidden" labelledBy="hub-title">
      <RoutesMotif />
      <Container className="relative">
        <div className="grid items-center gap-8 lg:grid-cols-[auto_1fr_auto] lg:gap-12">
          <span className="hidden size-20 items-center justify-center rounded-full bg-gold text-navy lg:flex">
            <Icon name="globe" size={36} />
          </span>
          <div className="max-w-2xl">
            <Eyebrow className="text-navy-100">{t("hubEyebrow")}</Eyebrow>
            <h2 id="hub-title" className="text-3xl sm:text-4xl">
              {hub.title[locale]}
            </h2>
            <Loc as="p" value={texts.hubText} locale={locale} className="mt-4 text-lg text-navy-100" />
          </div>
          <div>
            <Link href="/hub" className={buttonClasses("secondary", "lg")}>
              {t("hubCta")}
              <Icon name="arrow-right" size={20} />
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
