import { cn } from "@/lib/cn";

/** Rótulo curto acima de títulos. Cor herdada do contexto (navy sobre claro, branco sobre navy). */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("mb-3 flex items-center gap-3 text-sm font-bold uppercase tracking-[0.14em] text-fg-muted", className)}>
      <span className="rule-gold" aria-hidden="true" />
      {children}
    </p>
  );
}
