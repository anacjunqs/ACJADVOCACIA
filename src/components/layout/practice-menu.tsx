"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import type { PillarLink } from "@/lib/nav";
import { cn } from "@/lib/cn";

type Props = {
  label: string;
  allAreasLabel: string;
  hub: { label: string; hint: string };
  pillars: PillarLink[];
};

/** Submenu "Áreas de Atuação" (desktop): abre por clique, fecha com Esc, clique fora ou troca de página. */
export function PracticeMenu({ label, allAreasLabel, hub, pillars }: Props) {
  const pathname = usePathname();
  // O menu fecha sozinho ao trocar de página: guardamos em qual rota ele foi aberto.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const close = useCallback(() => setOpenAt(null), []);
  const toggle = () => setOpenAt(open ? null : pathname);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        buttonRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open, close]);

  const isAreas = pathname === "/areas-de-atuacao" || pathname === "/areas-de-atuacao/[pillar]" || pathname === "/hub";

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(e) => {
        if (open && !e.currentTarget.contains(e.relatedTarget as Node | null)) close();
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={toggle}
        className={cn(
          "inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-control px-3 font-semibold text-navy hover:bg-navy-50",
          isAreas && "underline decoration-2 underline-offset-8",
        )}
      >
        {label}
        <Icon name="chevron-down" size={18} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      <div
        id={panelId}
        hidden={!open}
        className="absolute left-0 top-full z-50 mt-2 w-[min(34rem,90vw)] rounded-card border border-line bg-white p-3 shadow-soft"
      >
        <Link
          href="/hub"
          className="flex items-start gap-3 surface-navy rounded-control p-4 hover:bg-navy-800"
        >
          <Icon name="globe" className="mt-0.5 shrink-0" />
          <span>
            <span className="block font-serif text-xl leading-tight">{hub.label}</span>
            <span className="mt-1 block text-sm text-navy-100">{hub.hint}</span>
          </span>
        </Link>
        <ul className="mt-3 grid gap-1 sm:grid-cols-2">
          {pillars.map((p) => (
            <li key={p.id}>
              <Link href={p.href as never} className="block rounded-control px-3 py-2.5 leading-snug text-navy hover:bg-navy-50">
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/areas-de-atuacao"
          className="mt-2 flex min-h-11 items-center gap-2 rounded-control px-3 font-bold text-navy underline underline-offset-4 hover:bg-navy-50"
        >
          {allAreasLabel}
          <Icon name="arrow-right" size={18} />
        </Link>
      </div>
    </div>
  );
}
