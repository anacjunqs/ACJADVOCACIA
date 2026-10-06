import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { JsonLd } from "@/components/seo/json-ld";
import { absoluteUrl } from "@/lib/seo/site";
import { pathFor, type Href } from "@/lib/seo/metadata";
import type { AppLocale } from "@/lib/i18n/routing";

export type Crumb = { label: string; href?: Href };

export async function Breadcrumbs({ items, locale }: { items: Crumb[]; locale: AppLocale }) {
  const t = await getTranslations("breadcrumbs");
  const all: Crumb[] = [{ label: t("home"), href: { pathname: "/" } }, ...items];
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.href ? { item: absoluteUrl(pathFor(locale, c.href)) } : {}),
    })),
  };
  return (
    <nav aria-label={t("label")} className="text-sm text-fg-muted">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-2">
              {c.href && !last ? (
                <Link href={c.href as never} className="inline-flex min-h-8 items-center underline underline-offset-4 hover:text-fg">
                  {c.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "font-semibold text-fg" : undefined}>
                  {c.label}
                </span>
              )}
              {!last && <Icon name="chevron-right" size={14} />}
            </li>
          );
        })}
      </ol>
      <JsonLd data={ld} />
    </nav>
  );
}
