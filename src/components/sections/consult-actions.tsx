import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { buttonClasses } from "@/components/ui/button-styles";
import { getSettings } from "@/lib/content";
import { whatsappLink } from "@/lib/nav";
import { pick } from "@/lib/i18n/localize";
import type { AppLocale } from "@/lib/i18n/routing";

/** Par de botões padrão: agendar consulta (principal) e WhatsApp (se houver número no CMS). */
export async function ConsultActions({ locale, onNavy, size = "md" }: { locale: AppLocale; onNavy?: boolean; size?: "md" | "lg" }) {
  const [t, settings] = await Promise.all([getTranslations("common"), getSettings()]);
  const wa = whatsappLink(settings.whatsapp, pick(settings.whatsappMessage, locale).text);
  return (
    <>
      <Link href="/contato" className={buttonClasses(onNavy ? "secondary" : "primary", size)}>
        <Icon name="calendar" size={20} />
        {t("scheduleConsultation")}
      </Link>
      {wa && (
        <a href={wa} target="_blank" rel="noopener noreferrer" className={buttonClasses(onNavy ? "ghost-on-navy" : "ghost", size)}>
          <Icon name="message-circle" size={20} />
          {t("whatsapp")}
          <span className="sr-only">{t("opensInNewTab")}</span>
        </a>
      )}
    </>
  );
}
