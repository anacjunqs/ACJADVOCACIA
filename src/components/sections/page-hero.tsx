import type { ReactNode } from "react";
import { Container, Section } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Icon, type IconName } from "@/components/ui/icon";

/** Cabeçalho de página: breadcrumb, rótulo, título, texto de apoio e ações. */
export function PageHero({
  eyebrow,
  title,
  titleId = "page-title",
  children,
  intro,
  icon,
  breadcrumbs,
  actions,
  tone = "cream",
  decoration,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  titleId?: string;
  intro?: ReactNode;
  icon?: IconName;
  breadcrumbs?: ReactNode;
  actions?: ReactNode;
  tone?: "cream" | "navy";
  decoration?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Section tone={tone} className="relative overflow-hidden pb-12 pt-8 sm:pb-16 sm:pt-10" labelledBy={titleId}>
      {decoration}
      <Container className="relative">
        {breadcrumbs && <div className="mb-8">{breadcrumbs}</div>}
        <div className="flex items-start gap-5">
          {icon && (
            <span className={`mt-1 hidden size-14 shrink-0 items-center justify-center rounded-full sm:flex ${tone === "navy" ? "bg-gold text-navy" : "bg-navy text-white"}`}>
              <Icon name={icon} size={28} />
            </span>
          )}
          <div className="max-w-3xl">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h1 id={titleId} className="text-4xl sm:text-5xl">
              {title}
            </h1>
            {intro && <div className="mt-5 text-lg leading-relaxed text-fg-muted sm:text-xl">{intro}</div>}
            {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
            {children}
          </div>
        </div>
      </Container>
    </Section>
  );
}
