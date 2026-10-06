import { getTranslations } from "next-intl/server";
import type { Heading } from "@/lib/rich-text";
import { Icon } from "@/components/ui/icon";

/** Índice automático (títulos h2/h3). No celular, recolhido; no desktop, fixo ao lado do texto. */
export async function Toc({ headings }: { headings: Heading[] }) {
  const t = await getTranslations("articles");
  if (headings.length < 2) return null;
  const list = (
    <ol className="space-y-1">
      {headings.map((h) => (
        <li key={h.id} className={h.level === 3 ? "pl-4" : undefined}>
          <a href={`#${h.id}`} className="inline-flex min-h-9 items-center underline-offset-4 hover:underline">
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );
  return (
    <>
      <details className="acc rounded-card border border-line bg-white lg:hidden">
        <summary className="flex min-h-12 items-center justify-between px-4 font-bold">
          {t("toc")}
          <Icon name="chevron-down" className="chev" />
        </summary>
        <nav aria-label={t("toc")} className="border-t border-line px-4 py-3">
          {list}
        </nav>
      </details>
      <nav aria-label={t("toc")} className="sticky top-28 hidden rounded-card border border-line bg-white p-5 lg:block">
        <p className="mb-3 font-serif text-xl">{t("toc")}</p>
        {list}
      </nav>
    </>
  );
}
