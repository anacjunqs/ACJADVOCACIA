import { Link } from "@/lib/i18n/navigation";
import { Icon, type IconName } from "@/components/ui/icon";
import type { Href } from "@/lib/seo/metadata";

/** Cartão de pilar. O link cobre o cartão inteiro (alvo de toque grande) e o foco aparece no cartão. */
export function PillarCard({
  title,
  summary,
  icon,
  href,
  cta,
  featured,
  badge,
}: {
  title: string;
  summary: string;
  icon: IconName;
  href: Href;
  cta: string;
  featured?: boolean;
  badge?: string;
}) {
  const base =
    "group relative flex h-full flex-col rounded-card p-6 transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 focus-within:outline focus-within:outline-3 focus-within:outline-offset-3";
  if (featured) {
    return (
      <article className={`${base} surface-navy shadow-soft sm:flex-row sm:items-center sm:gap-8 sm:p-8`}>
        <span className="mb-4 flex size-14 shrink-0 items-center justify-center rounded-full bg-gold text-navy sm:mb-0 sm:size-16">
          <Icon name={icon} size={30} />
        </span>
        <div className="flex-1">
          {badge && <p className="mb-2 text-sm font-bold uppercase tracking-[0.14em] accent-on-navy">{badge}</p>}
          <h3 className="text-2xl sm:text-3xl">
            <Link href={href as never} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
              {title}
            </Link>
          </h3>
          <p className="mt-2 max-w-2xl text-navy-100">{summary}</p>
        </div>
        <span className="mt-4 inline-flex items-center gap-2 font-bold sm:mt-0" aria-hidden="true">
          {cta}
          <Icon name="arrow-right" size={20} className="transition-transform group-hover:translate-x-1" />
        </span>
      </article>
    );
  }
  return (
    <article className={`${base} border border-line bg-white hover:shadow-soft`}>
      <span className="mb-5 flex size-12 items-center justify-center rounded-full bg-navy-50 text-navy">
        <Icon name={icon} size={26} />
      </span>
      <h3 className="text-2xl leading-tight">
        <Link href={href as never} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
          {title}
        </Link>
      </h3>
      <p className="mt-2 flex-1 text-fg-muted">{summary}</p>
      <span className="mt-5 inline-flex items-center gap-2 font-bold text-navy" aria-hidden="true">
        {cta}
        <Icon name="arrow-right" size={18} className="transition-transform group-hover:translate-x-1" />
      </span>
    </article>
  );
}
