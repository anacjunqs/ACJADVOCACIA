import { getTranslations } from "next-intl/server";
import { Icon, type IconName } from "@/components/ui/icon";
import { Txt } from "@/components/ui/txt";
import { buttonClasses } from "@/components/ui/button-styles";
import { MapEmbed } from "./map-embed";
import type { SiteSettings } from "@/lib/content/types";
import type { AppLocale } from "@/lib/i18n/routing";
import { pick } from "@/lib/i18n/localize";
import { whatsappLink } from "@/lib/nav";

function Row({ icon, title, children }: { icon: IconName; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy">
        <Icon name={icon} size={22} />
      </span>
      <div>
        <h3 className="font-sans text-base font-bold">{title}</h3>
        <div className="mt-0.5 text-fg-muted">{children}</div>
      </div>
    </div>
  );
}

const pending = (what: string) => <Txt>{`[PREENCHER: ${what}]`}</Txt>;

/**
 * Dados de contato vindos do CMS ("Configurações do escritório"). Campos ainda não preenchidos aparecem como
 * pendência destacada; ao preencher no CMS, passam a mostrar o dado real.
 */
export async function ContactInfo({ settings, locale }: { settings: SiteSettings; locale: AppLocale }) {
  const [t, tc] = await Promise.all([getTranslations("contact.info"), getTranslations("common")]);
  const wa = whatsappLink(settings.whatsapp, pick(settings.whatsappMessage, locale).text);
  const address = settings.address ? pick(settings.address.text, locale) : undefined;
  const hours = settings.hours ? pick(settings.hours, locale) : undefined;
  const video = settings.videoconference ? pick(settings.videoconference, locale) : undefined;

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-2xl">{t("title")}</h2>

      {wa ? (
        <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClasses("secondary", "lg", "w-full")}>
          <Icon name="message-circle" size={22} />
          {tc("whatsapp")}
          <span className="sr-only">{tc("opensInNewTab")}</span>
        </a>
      ) : (
        <Row icon="message-circle" title={t("whatsapp")}>
          {pending("WhatsApp")}
        </Row>
      )}

      <Row icon="mail" title={t("email")}>
        {settings.email ? (
          <a href={`mailto:${settings.email}`} className="font-semibold text-navy underline underline-offset-4">
            {settings.email}
          </a>
        ) : (
          pending("e-mail")
        )}
      </Row>

      {settings.phone && (
        <Row icon="phone" title={t("phone")}>
          <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`} className="font-semibold text-navy underline underline-offset-4">
            {settings.phone}
          </a>
        </Row>
      )}

      <Row icon="map-pin" title={t("address")}>
        {address ? (
          <>
            <p lang={address.lang} className="whitespace-pre-line">
              <Txt>{address.text}</Txt>
            </p>
            {settings.address?.mapQuery && (
              <div className="mt-3">
                <MapEmbed query={settings.address.mapQuery} />
              </div>
            )}
          </>
        ) : (
          pending("endereço")
        )}
      </Row>

      <Row icon="clock" title={t("hours")}>
        {hours ? (
          <>
            <p lang={hours.lang} className="whitespace-pre-line">
              <Txt>{hours.text}</Txt>
            </p>
            {settings.timezone && <p className="text-sm">{t("timezone", { value: settings.timezone })}</p>}
          </>
        ) : (
          pending("horário de atendimento, com fuso")
        )}
      </Row>

      <Row icon="video" title={t("video")}>
        {video ? (
          <p lang={video.lang}>
            <Txt>{video.text}</Txt>
          </p>
        ) : (
          pending("atendimento por videoconferência")
        )}
      </Row>
    </div>
  );
}
