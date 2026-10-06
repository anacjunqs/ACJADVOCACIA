import type { ElementType } from "react";
import { getLocale } from "next-intl/server";
import type { LS } from "@/lib/content/types";
import { pick } from "@/lib/i18n/localize";
import type { AppLocale } from "@/lib/i18n/routing";
import { Txt } from "./txt";

/**
 * Texto localizado (componente de servidor). Marca lang="pt" quando o EN está vazio.
 * Sem `as`, renderiza inline; com `as`, renderiza o elemento pedido.
 */
export async function Loc({ value, as, className, locale, id }: { value: LS | undefined; as?: ElementType; className?: string; locale?: AppLocale; id?: string }) {
  const current = locale ?? ((await getLocale()) as AppLocale);
  const { text, lang } = pick(value, current);
  if (!text) return null;
  const Tag = as;
  if (Tag) {
    return (
      <Tag id={id} lang={lang} className={className}>
        <Txt>{text}</Txt>
      </Tag>
    );
  }
  return lang || className ? (
    <span lang={lang} className={className}>
      <Txt>{text}</Txt>
    </span>
  ) : (
    <Txt>{text}</Txt>
  );
}
