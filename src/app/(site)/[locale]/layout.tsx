import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { serif, sans } from "@/lib/fonts";
import { routing, htmlLang } from "@/lib/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getSettings } from "@/lib/content";
import { pick } from "@/lib/i18n/localize";
import { siteUrl, isIndexable } from "@/lib/seo/site";
import "../../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = { themeColor: "#093247", width: "device-width", initialScale: 1 };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const settings = await getSettings();
  const name = pick(settings.siteName, locale).text;
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: name, template: `%s | ${name}` },
    description: pick(settings.seo.description, locale).text,
    applicationName: name,
    robots: isIndexable() ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [t, td, draft] = await Promise.all([getTranslations("common"), getTranslations("draft"), draftMode()]);

  return (
    <html lang={htmlLang[locale]} className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-dvh antialiased">
        <NextIntlClientProvider>
          <a href="#conteudo" className="skip-link">
            {t("skipToContent")}
          </a>
          <Header locale={locale} />
          <main id="conteudo" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer locale={locale} />
          {draft.isEnabled && (
            <>
              <VisualEditing />
              <div className="surface-navy fixed bottom-20 left-4 z-50 flex items-center gap-3 rounded-control px-4 py-2 text-sm shadow-soft xl:bottom-4">
                <span>{td("banner")}</span>
                {/* Recarga completa de propósito: precisa passar pela rota que desliga o modo de rascunho. */}
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/api/draft-mode/disable" className="font-bold underline underline-offset-4">
                  {td("exit")}
                </a>
              </div>
            </>
          )}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
