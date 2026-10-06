import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Container, Section } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Loc } from "@/components/ui/loc";
import { buttonClasses } from "@/components/ui/button-styles";
import type { Service } from "@content/services";
import type { LS } from "@/lib/content/types";
import type { AppLocale } from "@/lib/i18n/routing";

/** Bloco "Atuação internacional" de um pilar: serviços `international: true` e a regra de jurisdição. */
export async function InternationalBlock({ services, intro, locale }: { services: Service[]; intro?: LS; locale: AppLocale }) {
  const t = await getTranslations("areas");
  if (services.length === 0) return null;
  return (
    <Section tone="navy" labelledBy="intl-title">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <Eyebrow className="text-navy-100">{t("internationalBadge")}</Eyebrow>
            <h2 id="intl-title" className="text-3xl sm:text-4xl">
              {t("internationalTitle")}
            </h2>
            <Loc as="p" value={intro} locale={locale} className="mt-4 text-lg text-navy-100" />
            <div className="mt-8">
              <Link href="/hub" className={buttonClasses("secondary")}>
                {t("seeHub")}
              </Link>
            </div>
          </div>
          <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
            {services.map((s) => (
              <li key={s.slug} className="flex gap-3 py-2">
                <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-gold" />
                <span className="leading-snug">{s.title[locale]}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
