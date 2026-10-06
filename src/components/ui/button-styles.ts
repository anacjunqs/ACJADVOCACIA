import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "ghost-on-navy";
export type ButtonSize = "md" | "lg";

/**
 * Estilos de botão compartilhados por <button> e <Link>.
 * - primary: fundo navy, texto branco (~13,5:1)
 * - secondary: fundo dourado, texto navy (~8,5:1); preferir sobre navy
 * - ghost: contorno navy, texto navy (sobre claro)
 * - ghost-on-navy: contorno branco, texto branco (sobre navy)
 * Alvo de toque mínimo de 48px.
 */
const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-control px-6 py-3 text-center font-bold leading-tight transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-navy text-white hover:bg-navy-800",
  secondary: "bg-gold text-navy hover:bg-gold-200",
  ghost: "border-2 border-navy text-navy hover:bg-navy-50",
  "ghost-on-navy": "border-2 border-white text-white hover:bg-white/10",
};

const sizes: Record<ButtonSize, string> = {
  md: "text-base",
  lg: "min-h-14 px-8 text-lg",
};

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", extra?: string) {
  return cn(base, variants[variant], sizes[size], extra);
}
