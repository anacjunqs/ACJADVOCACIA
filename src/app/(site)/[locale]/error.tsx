"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Container, Section } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button-styles";

/** Página de erro 500 localizada. Não exibe detalhes técnicos ao visitante. */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("errors.serverError");
  return (
    <Section>
      <Container narrow className="text-center">
        <p aria-hidden="true" className="font-serif text-7xl text-navy-500">
          500
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl">{t("title")}</h1>
        <p className="mx-auto mt-4 max-w-prose text-lg text-fg-muted">{t("text")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className={buttonClasses("primary")}>
            {t("retry")}
          </button>
          <Link href="/" className={buttonClasses("ghost")}>
            {t("home")}
          </Link>
        </div>
      </Container>
    </Section>
  );
}
