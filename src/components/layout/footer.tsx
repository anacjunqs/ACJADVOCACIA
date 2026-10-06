import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Txt } from "@/components/ui/txt";
import { Icon } from "@/components/ui/icon";
import { getFounder, getSettings } from "@/lib/content";
import type { AppLocale } from "@/lib/i18n/routing";
import { pick } from "@/lib/i18n/localize";
import { hubLabel, mainNav, whatsappLink } from "@/lib/nav";
import { Wordmark } from "./wordmark";
import { CookiePreferencesButton } from "@/components/consent/cookie-preferences-button";

export async function Footer({ locale }: { locale: AppLocale }) {
  const [settings, founder, t, tn, th, tc] = await Promise.all([
    getSettings(),
    getFounder(),
    getTranslations("footer"),
    getTranslations("nav"),
    getTranslations("header"),
    getTranslations("common"),
  ]);
  const name = pick(settings.siteName, locale).text;
  const year = new Date().getFullYear();
  const wa = whatsappLink(settings.whatsapp, pick(settings.whatsappMessage, locale).text);
  const footerText = pick(settings.footerText, locale);
  const oab = pick(settings.oabNotice, locale);
  const address = settings.address ? pick(settings.address.text, locale) : undefined;
  const hours = settings.hours ? pick(settings.hours, locale) : undefined;
  const link = "inline-flex min-h-11 items-center underline-offset-4 hover:underline";

  return (
    <footer className="surface-navy pb-24 xl:pb-0" data-site-footer>
      <Container className="py-12 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Wordmark settings={settings} locale={locale} homeLabel={th("home", { name })} inverted />
            <p className="mt-4 max-w-xs text-navy-100" lang={footerText.lang}>
              <Txt>{footerText.text}</Txt>
            </p>
          </div>

          <nav aria-label={t("navLabel")}>
            <h2 className="font-sans text-sm font-bold uppercase tracking-[0.14em] text-navy-100">{t("explore")}</h2>
            <ul className="mt-3">
              <li>
                <Link href="/areas-de-atuacao" className={link}>
                  {tn("practiceAreas")}
                </Link>
              </li>
              <li>
                <Link href="/hub" className={link}>
                  {hubLabel(locale)}
                </Link>
              </li>
              {mainNav().map((i) => (
                <li key={i.key}>
                  <Link href={i.href} className={link}>
                    {tn(i.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-sans text-sm font-bold uppercase tracking-[0.14em] text-navy-100">{t("contact")}</h2>
            <ul className="mt-3 space-y-1">
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className={link}>
                    <Icon name="mail" size={18} className="mr-2" />
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`} className={link}>
                    <Icon name="phone" size={18} className="mr-2" />
                    {settings.phone}
                  </a>
                </li>
              )}
              {wa && (
                <li>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className={link}>
                    <Icon name="message-circle" size={18} className="mr-2" />
                    {tc("whatsapp")} <span className="sr-only">{tc("opensInNewTab")}</span>
                  </a>
                </li>
              )}
              {address && (
                <li className="flex gap-2 py-1 text-navy-100" lang={address.lang}>
                  <Icon name="map-pin" size={18} className="mt-1 shrink-0" />
                  <span>
                    <Txt>{address.text}</Txt>
                  </span>
                </li>
              )}
              {hours && (
                <li className="flex gap-2 py-1 text-navy-100" lang={hours.lang}>
                  <Icon name="clock" size={18} className="mt-1 shrink-0" />
                  <span>
                    <Txt>{hours.text}</Txt>
                  </span>
                </li>
              )}
            </ul>
            {settings.social.length > 0 && (
              <>
                <h3 className="mt-6 font-sans text-sm font-bold uppercase tracking-[0.14em] text-navy-100">{t("follow")}</h3>
                <ul className="mt-2">
                  {settings.social.map((s) => (
                    <li key={s.url}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className={link}>
                        {s.label} <span className="sr-only">{tc("opensInNewTab")}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <nav aria-label={t("legalLabel")}>
            <h2 className="font-sans text-sm font-bold uppercase tracking-[0.14em] text-navy-100">{t("legal")}</h2>
            <ul className="mt-3">
              <li>
                <Link href="/privacidade" className={link}>
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/termos" className={link}>
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link href="/cookies" className={link}>
                  {t("cookies")}
                </Link>
              </li>
              <li>
                <CookiePreferencesButton className={`${link} text-left`} label={t("cookiePreferences")} />
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-navy-500 pt-8">
          <p className="max-w-3xl text-sm text-navy-100" lang={oab.lang}>
            <Txt>{oab.text}</Txt>
          </p>
          <p className="mt-4 font-semibold">{t("lawyerLine", { name: founder.name, uf: founder.oab.uf, number: founder.oab.number })}</p>
          <p className="mt-1 text-sm text-navy-100">{t("rights", { year, name })}</p>
        </div>
      </Container>
    </footer>
  );
}
