"use client";

import { Link, usePathname } from "@/lib/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { buttonClasses } from "@/components/ui/button-styles";
import { useConsent } from "@/components/consent/consent-provider";

type Props = { label: string; whatsappHref?: string; whatsappLabel: string; newTabLabel: string; ariaLabel: string };

/**
 * Barra fixa no celular: "Agendar consulta" sempre à mão, com atalho para o WhatsApp.
 * Fica oculta na própria página de contato (seria redundante) e a partir de lg (o botão está no cabeçalho).
 */
export function StickyCta({ label, whatsappHref, whatsappLabel, newTabLabel, ariaLabel }: Props) {
  const pathname = usePathname();
  const { consent, ready } = useConsent();
  // Enquanto o aviso de cookies está na tela (no celular, também no rodapé), esta barra espera a escolha.
  if (pathname === "/contato" || !ready || consent === null) return null;
  return (
    <aside
      aria-label={ariaLabel}
      data-sticky-cta
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 py-3 shadow-[0_-8px_24px_-12px_rgb(9_50_71/0.25)] backdrop-blur xl:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-xl gap-3">
        <Link href="/contato" className={buttonClasses("primary", "md", "flex-1")}>
          <Icon name="calendar" size={20} />
          {label}
        </Link>
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${whatsappLabel} ${newTabLabel}`}
            className={buttonClasses("ghost", "md", "shrink-0 px-4")}
          >
            <Icon name="message-circle" size={22} />
          </a>
        )}
      </div>
    </aside>
  );
}
