import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { getSettings } from "@/lib/content";
import type { AppLocale } from "@/lib/i18n/routing";
import { hubLabel, mainNav, pillarLinks, whatsappLink } from "@/lib/nav";
import { pick } from "@/lib/i18n/localize";
import { buttonClasses } from "@/components/ui/button-styles";
import { Wordmark } from "./wordmark";
import { PracticeMenu } from "./practice-menu";
import { NavLink } from "./nav-link";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenu } from "./mobile-menu";
import { StickyCta } from "./sticky-cta";

export async function Header({ locale }: { locale: AppLocale }) {
  const [settings, t, tn, tc] = await Promise.all([
    getSettings(),
    getTranslations("header"),
    getTranslations("nav"),
    getTranslations("common"),
  ]);
  const name = pick(settings.siteName, locale).text;
  const target: AppLocale = locale === "pt" ? "en" : "pt";
  const targetName = t(`switchToLabel.${target}`);
  const pillars = pillarLinks(locale);
  const hub = { label: hubLabel(locale), hint: tn("hubHint") };
  const items = mainNav().map((i) => ({ ...i, label: tn(i.key) }));
  const waHref = whatsappLink(settings.whatsapp, pick(settings.whatsappMessage, locale).text);

  const switcher = (
    <LocaleSwitcher targetName={targetName} ariaLabel={t("switchTo", { language: targetName })} />
  );

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 xl:h-20 lg:px-8">
          <Wordmark settings={settings} locale={locale} homeLabel={t("home", { name })} />

          <nav aria-label={t("mainNav")} className="hidden items-center gap-1 xl:flex">
            <PracticeMenu label={tn("practiceAreas")} allAreasLabel={tn("allAreas")} hub={hub} pillars={pillars} />
            {items.map((it) => (
              <NavLink
                key={it.key}
                href={it.href}
                match={it.match}
                className="inline-flex min-h-11 items-center whitespace-nowrap rounded-control px-3 font-semibold text-navy hover:bg-navy-50"
                activeClassName="underline decoration-2 underline-offset-8"
              >
                {it.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {switcher}
            <div className="hidden xl:block">
              <Link href="/contato" className={buttonClasses("primary", "md", "whitespace-nowrap")}>
                {tc("scheduleConsultation")}
              </Link>
            </div>
            <MobileMenu
              labels={{
                open: t("openMenu"),
                close: t("closeMenu"),
                nav: t("mobileNav"),
                practiceAreas: tn("practiceAreas"),
                allAreas: tn("allAreas"),
                cta: tc("scheduleConsultation"),
              }}
              hub={hub}
              pillars={pillars}
              items={items}
            />
          </div>
        </div>
      </header>
      <StickyCta
        label={tc("scheduleConsultation")}
        whatsappHref={waHref}
        whatsappLabel={tc("whatsapp")}
        newTabLabel={tc("opensInNewTab")}
      />
    </>
  );
}
