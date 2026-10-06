import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "white" | "cream" | "navy" | "navy-deep";

const toneClass: Record<Tone, string> = {
  white: "",
  cream: "surface-cream",
  navy: "surface-navy",
  "navy-deep": "surface-navy-deep",
};

export function Container({
  children,
  className,
  as: Tag = "div",
  narrow,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  narrow?: boolean;
}) {
  return <Tag className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", narrow ? "max-w-3xl" : "max-w-6xl", className)}>{children}</Tag>;
}

export function Section({
  children,
  tone = "white",
  className,
  id,
  labelledBy,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  id?: string;
  labelledBy?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("py-14 sm:py-20", toneClass[tone], className)}>
      {children}
    </section>
  );
}
