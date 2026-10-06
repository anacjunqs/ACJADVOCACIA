import { getTranslations } from "next-intl/server";
import { Container, Section } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Icon } from "@/components/ui/icon";
import { Loc } from "@/components/ui/loc";
import { ConsultActions } from "@/components/sections/consult-actions";
import { FounderPhoto } from "@/components/sections/founder-photo";
import { RoutesMotif } from "@/components/sections/routes-motif";
import type { Founder, PageTexts } from "@/lib/content/types";
import type { AppLocale } from "@/lib/i18n/routing";

export async function Hero({ locale, texts, founder }: { locale: AppLocale; texts: PageTexts["home"]; founder: Founder }) {
  const t = await getTranslations("home");
  const tf = await getTranslations("founder");
  return (
    <Section tone="cream" className="pb-14 pt-10 sm:pb-20 sm:pt-14" labelledBy="hero-title">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <div>
            <Eyebrow>{t("heroEyebrow")}</Eyebrow>
            <Loc as="h1" id="hero-title" value={texts.heroTitle} locale={locale} className="text-[2.35rem] leading-[1.1] sm:text-5xl lg:text-6xl" />
            <Loc as="p" value={texts.heroSubtitle} locale={locale} className="mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted sm:text-xl" />
            <div className="mt-8 flex flex-wrap gap-3">
              <ConsultActions locale={locale} size="lg" />
            </div>
            <p className="mt-6 text-sm font-semibold text-fg-muted">{t("trustLine", { name: founder.name, uf: founder.oab.uf, number: founder.oab.number })}</p>
          </div>
          {founder.photo ? (
            <FounderPhoto photo={founder.photo} locale={locale} name={founder.name} placeholderLabel={tf("photoMissing")} priority className="mx-auto max-w-sm lg:max-w-none" />
          ) : (
            <div aria-hidden="true" className="surface-navy relative mx-auto hidden aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[1.5rem] lg:block lg:max-w-none">
              <RoutesMotif className="absolute inset-0 h-full w-full opacity-60" />
              <span className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-navy">
                <Icon name="globe" size={36} />
              </span>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
