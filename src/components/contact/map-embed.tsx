"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { buttonClasses } from "@/components/ui/button-styles";
import { useConsent } from "@/components/consent/consent-provider";

/**
 * Mapa do escritório. O link "Abrir no mapa" sempre existe. O mapa incorporado (Google Maps Embed API)
 * só carrega com chave configurada e depois do consentimento para conteúdo de terceiros.
 */
export function MapEmbed({ query }: { query: string }) {
  const t = useTranslations("contact.info");
  const { consent, allowMedia } = useConsent();
  const [asking, setAsking] = useState(false);
  const key = process.env.NEXT_PUBLIC_MAPS_EMBED_KEY;
  const openUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  const link = (
    <a href={openUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-bold underline underline-offset-4">
      <Icon name="map-pin" size={18} />
      {t("openMap")}
      <span className="sr-only">(↗)</span>
    </a>
  );

  if (!key) return link;

  if (consent?.media) {
    return (
      <div className="space-y-2">
        <iframe
          title={t("mapTitle")}
          src={`https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=${encodeURIComponent(query)}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="aspect-[4/3] w-full rounded-card border border-line"
        />
        {link}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {asking ? (
        <div className="rounded-card border border-line bg-navy-50 p-4">
          <p>{t("mapConsent")}</p>
          <button type="button" onClick={allowMedia} className={buttonClasses("primary", "md", "mt-3")}>
            {t("loadMap")}
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => setAsking(true)} className={buttonClasses("ghost", "md")}>
          <Icon name="map-pin" size={20} />
          {t("loadMap")}
        </button>
      )}
      {link}
    </div>
  );
}
