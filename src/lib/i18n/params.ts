import { notFound } from "next/navigation";
import { isLocale, type AppLocale } from "./routing";

/** Lê e valida o parâmetro [locale]; idioma desconhecido vira 404. */
export async function getLocaleParam(params: Promise<{ locale: string }>): Promise<AppLocale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}
