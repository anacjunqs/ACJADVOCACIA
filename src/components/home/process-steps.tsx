import { getTranslations } from "next-intl/server";
import { Container, Section } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Loc } from "@/components/ui/loc";
import type { SiteSettings } from "@/lib/content/types";
import type { AppLocale } from "@/lib/i18n/routing";

/** "Como funciona o atendimento": 3–4 etapas editáveis no CMS. Sem valores e sem gratuidade. */
export async function ProcessSteps({ steps, locale }: { steps: SiteSettings["processSteps"]; locale: AppLocale }) {
  const t = await getTranslations("home");
  if (steps.length === 0) return null;
  return (
    <Section tone="cream" labelledBy="process-title">
      <Container>
        <Eyebrow>{t("processEyebrow")}</Eyebrow>
        <h2 id="process-title" className="text-3xl sm:text-4xl">
          {t("processTitle")}
        </h2>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={i} className="rounded-card border border-line bg-white p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-navy font-bold text-white" aria-hidden="true">
                {i + 1}
              </span>
              <p className="sr-only">{t("step", { n: i + 1 })}</p>
              <Loc as="h3" value={s.title} locale={locale} className="mt-4 font-serif text-2xl leading-snug" />
              <Loc as="p" value={s.text} locale={locale} className="mt-2 text-fg-muted" />
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
