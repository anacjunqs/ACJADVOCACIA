import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Container, Section } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Icon } from "@/components/ui/icon";
import { Loc } from "@/components/ui/loc";
import { buttonClasses } from "@/components/ui/button-styles";
import { FounderPhoto } from "@/components/sections/founder-photo";
import type { Founder } from "@/lib/content/types";
import type { AppLocale } from "@/lib/i18n/routing";

export async function FounderTeaser({ founder, locale }: { founder: Founder; locale: AppLocale }) {
  const [t, th] = await Promise.all([getTranslations("founder"), getTranslations("home")]);
  return (
    <Section labelledBy="founder-teaser-title">
      <Container>
        <div className="grid items-center gap-10 md:grid-cols-[0.6fr_1fr] lg:gap-16">
          <FounderPhoto photo={founder.photo} locale={locale} name={founder.name} placeholderLabel={t("photoMissing")} className="mx-auto max-w-xs md:max-w-none" />
          <div>
            <Eyebrow>{th("founderEyebrow")}</Eyebrow>
            <h2 id="founder-teaser-title" className="text-3xl sm:text-4xl">
              {founder.name}
            </h2>
            <p className="mt-2 font-bold">{t("oab", { uf: founder.oab.uf, number: founder.oab.number })}</p>
            <Loc as="p" value={founder.summary} locale={locale} className="mt-5 text-lg leading-relaxed text-fg-muted" />
            <div className="mt-8">
              <Link href="/sobre" className={buttonClasses("ghost")}>
                {th("founderCta")}
                <Icon name="arrow-right" size={20} />
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
