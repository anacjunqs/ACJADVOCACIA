"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { alternateRoute } from "@/lib/i18n/alternates";
import type { AppLocale } from "@/lib/i18n/routing";
import { cn } from "@/lib/cn";

type Props = {
  /** Nome do outro idioma, no próprio idioma (ex.: "English"). */
  targetName: string;
  ariaLabel: string;
  className?: string;
};

export function LocaleSwitcher({ targetName, ariaLabel, className }: Props) {
  const locale = useLocale() as AppLocale;
  const target: AppLocale = locale === "pt" ? "en" : "pt";
  const pathname = usePathname();
  const params = useParams() as Record<string, string | string[] | undefined>;
  const route = alternateRoute(locale, target, { pathname, params });

  return (
    <Link
      // O tipo de href é estrito por rota; alternateRoute já devolve uma rota válida.
      href={route as never}
      locale={target}
      lang={target}
      hrefLang={target}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex min-h-11 items-center rounded-control px-3 text-base font-bold text-navy underline-offset-4 hover:bg-navy-50 hover:underline",
        className,
      )}
    >
      {targetName}
    </Link>
  );
}
