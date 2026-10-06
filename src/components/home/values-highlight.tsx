import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Container, Section } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Loc } from "@/components/ui/loc";
import type { ValueItem } from "@/lib/content/types";
import type { AppLocale } from "@/lib/i18n/routing";

export async function ValuesHighlight({ values, locale }: { values: ValueItem[]; locale: AppLocale }) {
  const t = await getTranslations("home");
  if (values.length === 0) return null;
  return (
    <Section tone="cream" labelledBy="values-highlight-title">
      <Container>
        <h2 id="values-highlight-title" className="text-3xl sm:text-4xl">
          {t("valuesTitle")}
        </h2>
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.slice(0, 4).map((v, i) => (
            <li key={i}>
              <span className="flex size-12 items-center justify-center rounded-full bg-white text-navy shadow-soft">
                <Icon name={v.icon} size={24} />
              </span>
              <Loc as="h3" value={v.title} locale={locale} className="mt-4 font-serif text-2xl leading-snug" />
              <Loc as="p" value={v.description} locale={locale} className="mt-2 text-fg-muted" />
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Link href="/valores" className="inline-flex min-h-11 items-center gap-2 font-bold underline underline-offset-4">
            {t("valuesCta")}
            <Icon name="arrow-right" size={18} />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
