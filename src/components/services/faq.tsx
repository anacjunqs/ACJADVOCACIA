import { getTranslations } from "next-intl/server";
import { Container, Section } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Txt } from "@/components/ui/txt";
import { JsonLd } from "@/components/seo/json-ld";
import type { FaqItem } from "@/lib/content/types";
import type { AppLocale } from "@/lib/i18n/routing";
import { pick } from "@/lib/i18n/localize";
import { stripPending } from "@/lib/pending";

/** FAQ em acordeão com dados estruturados FAQPage (as respostas ficam visíveis na página, como exige o Google). */
export async function Faq({ items, locale, tone = "white" }: { items: FaqItem[]; locale: AppLocale; tone?: "white" | "cream" }) {
  const t = await getTranslations("areas");
  if (items.length === 0) return null;
  const rows = items.map((i) => ({ q: pick(i.question, locale), a: pick(i.answer, locale) }));
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: rows.map((r) => ({
      "@type": "Question",
      name: stripPending(r.q.text),
      acceptedAnswer: { "@type": "Answer", text: stripPending(r.a.text) },
    })),
  };
  return (
    <Section tone={tone} labelledBy="faq-title">
      <Container>
        <div className="max-w-3xl">
        <h2 id="faq-title" className="text-3xl sm:text-4xl">
          {t("faqTitle")}
        </h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {rows.map((r, i) => (
            <details key={i} className="acc group">
              <summary className="flex min-h-16 items-center justify-between gap-4 py-4 pr-1 text-lg font-semibold hover:text-navy-600">
                <h3 className="font-sans text-lg font-semibold leading-snug" lang={r.q.lang}>
                  <Txt>{r.q.text}</Txt>
                </h3>
                <Icon name="chevron-down" className="chev shrink-0" />
              </summary>
              <p className="pb-5 pr-8 text-fg-muted" lang={r.a.lang}>
                <Txt>{r.a.text}</Txt>
              </p>
            </details>
          ))}
        </div>
        </div>
      </Container>
      <JsonLd data={ld} />
    </Section>
  );
}
