import { Img } from "@/components/ui/img";
import { Icon } from "@/components/ui/icon";
import type { ImageRef } from "@/lib/content/types";
import type { AppLocale } from "@/lib/i18n/routing";
import { pick } from "@/lib/i18n/localize";
import { cn } from "@/lib/cn";

/**
 * Foto da fundadora em moldura de cantos suaves. Sem foto, mostra um espaço neutro com o aviso
 * de que a foto ainda será enviada (não usamos imagem de banco nem silhueta que sugira uma pessoa).
 */
export function FounderPhoto({
  photo,
  locale,
  name,
  placeholderLabel,
  className,
  priority,
}: {
  photo?: ImageRef;
  locale: AppLocale;
  name: string;
  placeholderLabel: string;
  className?: string;
  priority?: boolean;
}) {
  if (!photo) {
    return (
      <div
        role="img"
        aria-label={`${placeholderLabel}: ${name}`}
        className={cn("flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 rounded-[1.5rem] bg-navy-100 p-6 text-center text-navy-600", className)}
      >
        <Icon name="users" size={40} />
        <span className="font-semibold">[PREENCHER: foto da fundadora]</span>
      </div>
    );
  }
  const alt = pick(photo.alt, locale).text || name;
  return (
    <div className={cn("relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] bg-navy-100", className)}>
      <Img src={photo.src} alt={alt} fill priority={priority} sizes="(min-width: 1024px) 28rem, 90vw" className="object-cover" />
    </div>
  );
}
