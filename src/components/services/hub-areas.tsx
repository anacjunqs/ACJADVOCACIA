import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import type { Pillar, Service } from "@content/services";
import { groups as allGroups } from "@content/services";
import type { AppLocale } from "@/lib/i18n/routing";
import { pillarIcon, pillarSlug } from "@/lib/services/catalog";

type Entry = { pillar: Pillar; services: Service[] };

/**
 * Hub: serviços internacionais agrupados por pilar. Cada pilar é um acordeão; dentro dele,
 * os serviços aparecem sob o título do grupo a que pertencem (nunca uma lista corrida).
 */
export async function HubAreas({ entries, locale }: { entries: Entry[]; locale: AppLocale }) {
  const t = await getTranslations("areas");
  const th = await getTranslations("hub");
  return (
    <div className="space-y-3">
      {entries.map(({ pillar, services }, i) => {
        const keys = [...new Set(services.map((s) => s.group))];
        return (
          <details key={pillar.id} className="acc rounded-card border border-line bg-white" open={i === 0}>
            <summary className="flex min-h-16 items-center justify-between gap-4 rounded-card px-5 py-3 hover:bg-navy-50">
              <span className="flex items-center gap-4">
                <span className="hidden size-11 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy sm:flex">
                  <Icon name={pillarIcon[pillar.id]} size={22} />
                </span>
                <span>
                  <h3 className="font-serif text-xl font-medium leading-snug sm:text-2xl">{pillar.title[locale]}</h3>
                  <span className="mt-0.5 block text-sm text-fg-muted">{t("servicesCount", { count: services.length })}</span>
                </span>
              </span>
              <Icon name="chevron-down" className="chev shrink-0" />
            </summary>
            <div className="space-y-5 border-t border-line px-5 py-5">
              {keys.map((k) => (
                <div key={k}>
                  <h4 className="text-sm font-bold uppercase tracking-[0.1em] text-fg-muted">{allGroups[k].title[locale]}</h4>
                  <ul className="mt-2 grid gap-x-8 sm:grid-cols-2">
                    {services
                      .filter((s) => s.group === k)
                      .map((s) => (
                        <li key={s.slug} className="flex gap-3 py-1.5">
                          <span aria-hidden="true" className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-navy" />
                          <span className="leading-snug">{s.title[locale]}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
              <Link
                href={{ pathname: "/areas-de-atuacao/[pillar]", params: { pillar: pillarSlug(pillar, locale) } } as never}
                className="inline-flex min-h-11 items-center gap-2 font-bold underline underline-offset-4"
              >
                {th("seeArea")}
                <Icon name="arrow-right" size={18} />
              </Link>
            </div>
          </details>
        );
      })}
    </div>
  );
}
