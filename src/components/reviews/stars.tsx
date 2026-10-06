import { Icon } from "@/components/ui/icon";

/** Estrelas em navy (dourado não é permitido como ícone informativo sobre fundo claro). */
export function Stars({ rating, label, size = 20 }: { rating: number; label: string; size?: number }) {
  const full = Math.round(rating);
  return (
    <span role="img" aria-label={label} className="inline-flex items-center gap-0.5 text-navy">
      {Array.from({ length: 5 }, (_, i) => (
        <Icon key={i} name="star" size={size} className={i < full ? "fill-current" : "opacity-30"} />
      ))}
    </span>
  );
}
