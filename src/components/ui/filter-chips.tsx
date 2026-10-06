"use client";

import { cn } from "@/lib/cn";

type Option = { id: string; label: string };

/** Filtro por categoria: grupo de botões com estado (aria-pressed), alvos de toque de 44px. */
export function FilterChips({
  label,
  allLabel,
  options,
  value,
  onChange,
}: {
  label: string;
  allLabel: string;
  options: Option[];
  value: string;
  onChange: (id: string) => void;
}) {
  if (options.length === 0) return null;
  const items: Option[] = [{ id: "", label: allLabel }, ...options];
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {items.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id || "all"}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.id)}
            className={cn(
              "min-h-11 rounded-full border-2 px-4 font-semibold transition-colors",
              active ? "border-navy bg-navy text-white" : "border-navy-200 bg-white text-navy hover:border-navy",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
