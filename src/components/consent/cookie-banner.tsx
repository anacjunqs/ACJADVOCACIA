"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { buttonClasses } from "@/components/ui/button-styles";
import { useConsent } from "./consent-provider";

/**
 * Aviso de cookies: compacto, no rodapé da tela, sem bloquear a leitura.
 * "Aceitar" e "Só o necessário" têm o mesmo peso visual; "Personalizar" abre as escolhas por categoria.
 */
export function CookieBanner() {
  const t = useTranslations("consent");
  const { consent, ready, preferencesOpen, acceptAll, rejectOptional, openPreferences } = useConsent();
  const showBanner = ready && consent === null && !preferencesOpen;
  return (
    <>
      {showBanner && (
        <section
          aria-label={t("bannerLabel")}
          className="fixed inset-x-3 bottom-[5.25rem] z-50 rounded-card border border-line bg-white p-3 shadow-soft xl:bottom-4 xl:left-auto xl:right-4 xl:max-w-md xl:p-4"
        >
          <p className="text-sm leading-snug">
            {t("bannerText")}{" "}
            <Link href="/cookies" className="font-semibold underline underline-offset-4">
              {t("learnMore")}
            </Link>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={acceptAll} className={buttonClasses("primary", "md", "flex-1 px-4")}>
              {t("acceptAll")}
            </button>
            <button type="button" onClick={rejectOptional} className={buttonClasses("primary", "md", "flex-1 px-4")}>
              {t("rejectOptional")}
            </button>
            <button type="button" onClick={openPreferences} className="min-h-11 w-full rounded-control px-3 font-semibold underline underline-offset-4 hover:bg-navy-50">
              {t("customize")}
            </button>
          </div>
        </section>
      )}
      {preferencesOpen && <PreferencesDialog />}
    </>
  );
}

function PreferencesDialog() {
  const t = useTranslations("consent");
  const { consent, save, acceptAll, rejectOptional, closePreferences } = useConsent();
  const ref = useRef<HTMLDialogElement>(null);
  const [analytics, setAnalytics] = useState(consent?.analytics ?? false);
  const [media, setMedia] = useState(consent?.media ?? false);

  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);

  const row = "flex items-start gap-4 rounded-control border border-line p-4";
  return (
    <dialog
      ref={ref}
      aria-labelledby="consent-title"
      onClose={closePreferences}
      onCancel={closePreferences}
      className="m-auto w-[min(32rem,calc(100vw-1.5rem))] rounded-card border border-line bg-white p-0 text-navy shadow-soft backdrop:bg-navy/50"
    >
      <form
        method="dialog"
        onSubmit={(e) => {
          e.preventDefault();
          save({ analytics, media });
        }}
        className="p-6"
      >
        <h2 id="consent-title" className="font-serif text-2xl">
          {t("title")}
        </h2>
        <p className="mt-2 text-fg-muted">{t("intro")}</p>
        <div className="mt-5 space-y-3">
          <div className={row}>
            <input type="checkbox" checked disabled aria-labelledby="c-nec" className="mt-1 size-6 accent-navy" />
            <div>
              <p id="c-nec" className="font-bold">
                {t("necessary")}
              </p>
              <p className="text-sm text-fg-muted">{t("necessaryText")}</p>
            </div>
          </div>
          <label className={`${row} cursor-pointer`}>
            <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="mt-1 size-6 accent-navy" />
            <span>
              <span className="block font-bold">{t("analytics")}</span>
              <span className="block text-sm text-fg-muted">{t("analyticsText")}</span>
            </span>
          </label>
          <label className={`${row} cursor-pointer`}>
            <input type="checkbox" checked={media} onChange={(e) => setMedia(e.target.checked)} className="mt-1 size-6 accent-navy" />
            <span>
              <span className="block font-bold">{t("media")}</span>
              <span className="block text-sm text-fg-muted">{t("mediaText")}</span>
            </span>
          </label>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <button type="submit" className={buttonClasses("primary", "md", "flex-1")}>
            {t("save")}
          </button>
          <button type="button" onClick={acceptAll} className={buttonClasses("ghost", "md", "flex-1")}>
            {t("acceptAll")}
          </button>
          <button type="button" onClick={rejectOptional} className={buttonClasses("ghost", "md", "flex-1")}>
            {t("rejectOptional")}
          </button>
        </div>
        <button type="button" onClick={closePreferences} className="mt-3 min-h-11 w-full rounded-control font-semibold underline underline-offset-4 hover:bg-navy-50">
          {t("close")}
        </button>
      </form>
    </dialog>
  );
}
