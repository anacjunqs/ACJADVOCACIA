import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/icon";
import { Txt } from "@/components/ui/txt";
import type { Service } from "@content/services";
import type { AppLocale } from "@/lib/i18n/routing";
import { pick } from "@/lib/i18n/localize";

export type ServiceGroupView = {
  key: string;
  title: { pt: string; en: string };
  services: Service[];
};

/**
 * Serviços agrupados em acordeão (<details>): nada de lista corrida de dezenas de itens.
 * Os itens são texto: não existe página individual por serviço (evita conteúdo fino e canibalização de SEO).
 */
export async function ServiceGroups({
  groups,
  locale,
  openFirst = true,
}: {
  groups: ServiceGroupView[];
  locale: AppLocale;
  openFirst?: boolean;
}) {
  const t = await getTranslations("areas");
  return (
    <div className="space-y-3">
      {groups.map((g, gi) => (
        <details key={g.key} className="acc rounded-card border border-line bg-white" open={openFirst && gi === 0}>
          <summary className="flex min-h-16 items-center justify-between gap-4 rounded-card px-5 py-3 hover:bg-navy-50">
            <span>
              <h3 className="font-serif text-xl font-medium leading-snug sm:text-2xl">{g.title[locale]}</h3>
              <span className="mt-0.5 block text-sm text-fg-muted">{t("servicesCount", { count: g.services.length })}</span>
            </span>
            <Icon name="chevron-down" className="chev shrink-0" />
          </summary>
          <ul className="grid gap-x-8 gap-y-1 border-t border-line px-5 py-4 sm:grid-cols-2">
            {g.services.map((s) => {
              const summary = s.summary ? pick(s.summary, locale) : undefined;
              return (
                <li key={s.slug} className="flex gap-3 py-2">
                  <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-navy" />
                  <span>
                    <span className="block leading-snug">
                      {s.title[locale]}
                      {s.international && (
                        <span className="ml-2 inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-navy-50 px-2 py-0.5 align-middle text-xs font-semibold text-navy">
                          <Icon name="globe" size={12} />
                          {t("internationalBadge")}
                        </span>
                      )}
                    </span>
                    {summary && (
                      <span className="mt-1 block text-sm text-fg-muted" lang={summary.lang}>
                        <Txt>{summary.text}</Txt>
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </details>
      ))}
    </div>
  );
}
