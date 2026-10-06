import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Container, Section } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { PillarCard } from "@/components/services/pillar-card";
import type { AppLocale } from "@/lib/i18n/routing";
import { pillarIcon, pillarSlug, pillars } from "@/lib/services/catalog";

export async function PillarsSummary({ locale }: { locale: AppLocale }) {
  const [t, tc] = await Promise.all([getTranslations("home"), getTranslations("common")]);
  return (
    <Section labelledBy="pillars-title">
      <Container>
        <div className="max-w-2xl">
          <h2 id="pillars-title" className="text-3xl sm:text-4xl">
            {t("pillarsTitle")}
          </h2>
          <p className="mt-3 text-lg text-fg-muted">{t("pillarsIntro")}</p>
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((p) => (
            <li key={p.id}>
              <PillarCard
                title={p.title[locale]}
                summary={p.summary[locale]}
                icon={pillarIcon[p.id]}
                href={{ pathname: "/areas-de-atuacao/[pillar]", params: { pillar: pillarSlug(p, locale) } }}
                cta={tc("learnMore")}
              />
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Link href="/areas-de-atuacao" className="inline-flex min-h-11 items-center gap-2 font-bold underline underline-offset-4">
            {t("viewAllAreas")}
            <Icon name="arrow-right" size={18} />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
