import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/cn";
import type { SiteSettings } from "@/lib/content/types";
import type { AppLocale } from "@/lib/i18n/routing";
import { pick } from "@/lib/i18n/localize";
import Image from "next/image";

/**
 * Wordmark tipográfico provisório. Se o CMS tiver um logo (SVG), ele substitui o texto.
 * Não há símbolo: apenas o nome em serifa.
 */
export function Wordmark({
  settings,
  locale,
  homeLabel,
  className,
  inverted,
}: {
  settings: SiteSettings;
  locale: AppLocale;
  homeLabel: string;
  className?: string;
  inverted?: boolean;
}) {
  const name = pick(settings.siteName, locale).text;
  const [first, ...rest] = name.split(" ");
  return (
    <Link href="/" aria-label={homeLabel} className={cn("inline-flex items-center", className)}>
      {settings.logo ? (
        <Image
          src={settings.logo.src}
          alt=""
          width={settings.logo.width}
          height={settings.logo.height}
          className="h-9 w-auto lg:h-10"
          priority
        />
      ) : (
        <span className={cn("font-serif text-2xl leading-none tracking-tight", inverted ? "text-white" : "text-navy")}>
          <span className="font-semibold">{first}</span>
          {rest.length > 0 && <span className="ml-1.5 font-normal">{rest.join(" ")}</span>}
        </span>
      )}
    </Link>
  );
}
