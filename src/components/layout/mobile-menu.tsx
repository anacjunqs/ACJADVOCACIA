"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { buttonClasses } from "@/components/ui/button-styles";
import type { PillarLink } from "@/lib/nav";
import type { Pathname, StaticPathname } from "@/lib/i18n/routing";
import { cn } from "@/lib/cn";

type Props = {
  labels: { open: string; close: string; nav: string; practiceAreas: string; allAreas: string; cta: string };
  hub: { label: string; hint: string };
  pillars: PillarLink[];
  items: Array<{ label: string; href: StaticPathname; match: Pathname[] }>;
  /** Conteúdo extra (seletor de idioma) renderizado no fim do painel. */
  children?: React.ReactNode;
};

/** Menu do celular: padrão "disclosure" (botão + painel), sem prender o foco. */
export function MobileMenu({ labels, hub, pillars, items, children }: Props) {
  const pathname = usePathname();
  // O menu fecha sozinho ao trocar de página: guardamos em qual rota ele foi aberto.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const close = useCallback(() => setOpenAt(null), []);
  const toggle = () => setOpenAt(open ? null : pathname);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  return (
    <div className="xl:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-control px-2 font-bold text-navy hover:bg-navy-50"
      >
        <Icon name={open ? "x" : "menu"} />
        <span>{open ? labels.close : labels.open}</span>
      </button>
      <nav
        id={panelId}
        aria-label={labels.nav}
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-line bg-white px-4 pb-10 pt-4"
      >
        <details className="acc border-b border-line" open={pathname.startsWith("/areas") || pathname === "/hub"}>
          <summary className="flex min-h-14 items-center justify-between text-lg font-semibold text-navy">
            {labels.practiceAreas}
            <Icon name="chevron-down" className="chev" />
          </summary>
          <div className="pb-4">
            <Link href="/hub" className="mb-3 flex items-start gap-3 surface-navy rounded-card p-4">
              <Icon name="globe" className="mt-0.5 shrink-0" />
              <span>
                <span className="block font-serif text-xl leading-tight">{hub.label}</span>
                <span className="mt-1 block text-sm text-navy-100">{hub.hint}</span>
              </span>
            </Link>
            <ul>
              {pillars.map((p) => (
                <li key={p.id}>
                  <Link href={p.href as never} className="flex min-h-12 items-center py-2 text-navy">
                    {p.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/areas-de-atuacao" className="flex min-h-12 items-center gap-2 font-bold text-navy underline underline-offset-4">
              {labels.allAreas}
              <Icon name="arrow-right" size={18} />
            </Link>
          </div>
        </details>
        <ul>
          {items.map((it) => {
            const active = it.match.includes(pathname as Pathname);
            return (
              <li key={it.href} className="border-b border-line">
                <Link
                  href={it.href as never}
                  aria-current={active ? "page" : undefined}
                  className={cn("flex min-h-14 items-center text-lg font-semibold text-navy", active && "underline decoration-2 underline-offset-8")}
                >
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 flex flex-col gap-3">
          <Link href="/contato" className={buttonClasses("primary", "lg", "w-full")}>
            {labels.cta}
          </Link>
          {children}
        </div>
      </nav>
    </div>
  );
}
