import { getLocale, getTranslations } from "next-intl/server";
import { Container, Section } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { buttonClasses } from "@/components/ui/button-styles";
import { Stars } from "./stars";
import { getGoogleReviews, placeId, reviewLinks } from "@/lib/reviews/google";
import { getSettings } from "@/lib/content";
import { testimonialsEnabled } from "@/lib/seo/site";
import type { AppLocale } from "@/lib/i18n/routing";

/**
 * Avaliações do Google. Desligada pela flag: não renderiza e não chama o Google.
 * Sem chave ou com falha da API: a seção de avaliações some, sem erro, e fica só o botão "Ver avaliações no Google".
 */
export async function ReviewsSection({ variant = "home" }: { variant?: "home" | "page" }) {
  if (!testimonialsEnabled()) return null;
  const locale = (await getLocale()) as AppLocale;
  const [t, settings] = await Promise.all([getTranslations("reviews"), getSettings()]);
  const result = await getGoogleReviews(locale, settings.googlePlaceId);
  const links = reviewLinks(placeId(settings.googlePlaceId));
  const nf = new Intl.NumberFormat(locale === "pt" ? "pt-BR" : "en", { maximumFractionDigits: 1, minimumFractionDigits: 1 });

  const buttons = (
    <div className="mt-8 flex flex-wrap gap-3">
      {links.all && (
        <a href={links.all} target="_blank" rel="noopener noreferrer" className={buttonClasses("ghost")}>
          {t("viewAll")}
          <Icon name="external-link" size={18} />
          <span className="sr-only">{t("newTab")}</span>
        </a>
      )}
      {links.write && result.status === "ok" && (
        <a href={links.write} target="_blank" rel="noopener noreferrer" className={buttonClasses("ghost")}>
          {t("write")}
          <Icon name="external-link" size={18} />
          <span className="sr-only">{t("newTab")}</span>
        </a>
      )}
    </div>
  );

  if (result.status !== "ok") {
    if (!links.all) return null;
    return (
      <Section tone={variant === "home" ? "white" : "white"} labelledBy="reviews-title" className={variant === "home" ? "py-12" : undefined}>
        <Container>
          <h2 id="reviews-title" className="text-3xl sm:text-4xl">
            {t("title")}
          </h2>
          {buttons}
        </Container>
      </Section>
    );
  }

  return (
    <Section tone="cream" labelledBy="reviews-title">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="reviews-title" className="text-3xl sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-3 flex flex-wrap items-center gap-3 text-lg">
              <Stars rating={result.rating} label={t("ratingLabel", { rating: nf.format(result.rating) })} size={22} />
              <span className="font-bold">{nf.format(result.rating)}</span>
              <span className="text-fg-muted">{t("total", { count: result.total })}</span>
            </p>
          </div>
          <p className="text-sm font-semibold text-fg-muted">{t("source")}</p>
        </div>

        {result.reviews.length > 0 && (
          <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {result.reviews.map((r) => (
              <li key={r.id} className="flex flex-col rounded-card border border-line bg-white p-6">
                <Stars rating={r.rating} label={t("ratingLabel", { rating: nf.format(r.rating) })} />
                <blockquote className="mt-3 flex-1" lang={r.lang}>
                  <p className="whitespace-pre-line">{r.text}</p>
                </blockquote>
                <footer className="mt-4 text-sm text-fg-muted">
                  <p className="font-bold text-fg">
                    {r.authorUrl ? (
                      <a href={r.authorUrl} target="_blank" rel="noopener noreferrer nofollow" className="underline underline-offset-4">
                        {r.author}
                      </a>
                    ) : (
                      r.author
                    )}
                  </p>
                  {r.when && <p>{r.when}</p>}
                </footer>
              </li>
            ))}
          </ul>
        )}
        {buttons}
      </Container>
    </Section>
  );
}
