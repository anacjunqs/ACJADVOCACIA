import { getTranslations } from "next-intl/server";
import { Icon } from "@/components/ui/icon";
import { CopyLinkButton } from "./copy-link-button";

/** Compartilhamento por links simples (sem scripts de terceiros) e botão de copiar. */
export async function ShareBar({ url, title }: { url: string; title: string }) {
  const t = await getTranslations("articles");
  const tc = await getTranslations("common");
  const enc = encodeURIComponent;
  const items = [
    { label: t("shareWhatsapp"), href: `https://wa.me/?text=${enc(`${title} ${url}`)}`, icon: "message-circle" as const, external: true },
    { label: t("shareLinkedin"), href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, icon: "share" as const, external: true },
    { label: t("shareEmail"), href: `mailto:?subject=${enc(title)}&body=${enc(url)}`, icon: "mail" as const, external: false },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t("shareTitle")}>
      <p className="mr-2 font-bold">{t("shareTitle")}</p>
      {items.map((i) => (
        <a
          key={i.label}
          href={i.href}
          {...(i.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="inline-flex min-h-11 items-center gap-2 rounded-control border-2 border-navy-200 px-4 font-semibold hover:border-navy"
        >
          <Icon name={i.icon} size={18} />
          {i.label}
          {i.external && <span className="sr-only">{tc("opensInNewTab")}</span>}
        </a>
      ))}
      <CopyLinkButton url={url} label={t("copyLink")} copiedLabel={t("linkCopied")} />
    </div>
  );
}
