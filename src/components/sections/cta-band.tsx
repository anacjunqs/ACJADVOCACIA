import { Container, Section } from "@/components/ui/container";
import { Loc } from "@/components/ui/loc";
import { getPageTexts } from "@/lib/content";
import type { AppLocale } from "@/lib/i18n/routing";
import type { LS } from "@/lib/content/types";
import { ConsultActions } from "./consult-actions";

/**
 * Chamada final para a consulta. Por padrão usa o texto editável "CTA final" da home;
 * `plainTitle`/`plainText` aceitam textos de interface (mensagens) já traduzidos.
 */
export async function CtaBand({
  locale,
  title,
  text,
  plainTitle,
  plainText,
}: {
  locale: AppLocale;
  title?: LS;
  text?: LS;
  plainTitle?: string;
  plainText?: string;
}) {
  const texts = await getPageTexts();
  return (
    <Section tone="navy" labelledBy="cta-title">
      <Container narrow className="text-center">
        <span className="rule-gold mx-auto mb-6" aria-hidden="true" />
        {plainTitle ? (
          <h2 id="cta-title" className="text-3xl sm:text-4xl">
            {plainTitle}
          </h2>
        ) : (
          <Loc as="h2" id="cta-title" value={title ?? texts.home.finalCtaTitle} className="text-3xl sm:text-4xl" locale={locale} />
        )}
        {plainText ? (
          <p className="mx-auto mt-4 max-w-prose text-lg text-navy-100">{plainText}</p>
        ) : (
          <Loc as="p" value={text ?? texts.home.finalCtaText} className="mx-auto mt-4 max-w-prose text-lg text-navy-100" locale={locale} />
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ConsultActions locale={locale} onNavy size="lg" />
        </div>
      </Container>
    </Section>
  );
}
