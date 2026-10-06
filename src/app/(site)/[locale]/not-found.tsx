import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Container, Section } from "@/components/ui/container";
import { buttonClasses } from "@/components/ui/button-styles";

export default async function NotFound() {
  const t = await getTranslations("errors.notFound");
  return (
    <Section>
      <Container narrow className="text-center">
        <p aria-hidden="true" className="font-serif text-7xl text-navy-500">
          404
        </p>
        <h1 className="mt-2 text-3xl sm:text-4xl">{t("title")}</h1>
        <p className="mx-auto mt-4 max-w-prose text-lg text-fg-muted">{t("text")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonClasses("primary")}>
            {t("home")}
          </Link>
          <Link href="/contato" className={buttonClasses("ghost")}>
            {t("contact")}
          </Link>
        </div>
      </Container>
    </Section>
  );
}
