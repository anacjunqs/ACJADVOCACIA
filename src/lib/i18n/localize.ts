import type { LS } from "@/lib/content/types";
import type { AppLocale } from "./routing";

/**
 * Escolhe o texto do idioma. Se o EN estiver vazio, devolve o PT e `lang: "pt"`,
 * para o trecho ser marcado com lang="pt" (leitores de tela e tradutores).
 */
export function pick(value: LS | undefined, locale: AppLocale): { text: string; lang?: "pt" } {
  if (!value) return { text: "" };
  if (locale === "en") {
    const en = value.en?.trim();
    if (en) return { text: value.en as string };
    return { text: value.pt, lang: "pt" };
  }
  return { text: value.pt };
}

export const text = (value: LS | undefined, locale: AppLocale): string => pick(value, locale).text;

/** Um campo localizado conta como "disponível em EN" quando tem texto EN. */
export const hasEnglish = (value: LS | undefined): boolean => Boolean(value?.en?.trim());
