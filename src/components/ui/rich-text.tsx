import { PortableText, type PortableTextComponents } from "next-sanity";
import { Img } from "./img";
import { cn } from "@/lib/cn";
import { headingIds, highlightPending } from "@/lib/rich-text";
import type { RichBlock } from "@/lib/content/types";
import { sanityImageUrl, sizeFromRef } from "@/sanity/lib/image";

type ImageValue = { asset?: { _ref?: string }; crop?: never; hotspot?: never; alt?: string; caption?: string };
type TableValue = { caption?: string; hasHeader?: boolean; rows?: Array<{ _key?: string; cells?: string[] }> };

function buildComponents(ids: Map<string, string>): PortableTextComponents {
  return {
    block: {
      h2: ({ children, value }) => <h2 id={ids.get(String(value._key))}>{children}</h2>,
      h3: ({ children, value }) => <h3 id={ids.get(String(value._key))}>{children}</h3>,
    },
    marks: {
      link: ({ children, value }) => {
        const href = String(value?.href ?? "#");
        const external = /^https?:\/\//.test(href);
        return (
          <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {children}
            {external && <span className="sr-only"> (abre em nova aba)</span>}
          </a>
        );
      },
      pending: ({ children }) => <mark data-pending>{children}</mark>,
    },
    types: {
      articleImage: ({ value }: { value: ImageValue }) => {
        const ref = value.asset?._ref;
        if (!ref) return null;
        const size = sizeFromRef(ref) ?? { width: 1200, height: 800 };
        return (
          <figure>
            <Img src={sanityImageUrl({ ref })} alt={value.alt ?? ""} width={size.width} height={size.height} sizes="(min-width: 1024px) 68ch, 100vw" className="h-auto w-full" />
            {value.caption && <figcaption>{value.caption}</figcaption>}
          </figure>
        );
      },
      table: ({ value }: { value: TableValue }) => {
        const rows = value.rows ?? [];
        if (rows.length === 0) return null;
        const hasHeader = value.hasHeader !== false;
        const head = hasHeader ? rows[0] : undefined;
        const body = hasHeader ? rows.slice(1) : rows;
        return (
          <div className="overflow-x-auto">
            <table>
              {value.caption && <caption className="mb-2 text-left font-semibold">{value.caption}</caption>}
              {head && (
                <thead>
                  <tr>
                    {(head.cells ?? []).map((c, i) =>
                      c.trim() ? (
                        <th key={i} scope="col">
                          {c}
                        </th>
                      ) : (
                        <td key={i} />
                      ),
                    )}
                  </tr>
                </thead>
              )}
              <tbody>
                {body.map((r, ri) => (
                  <tr key={r._key ?? ri}>
                    {(r.cells ?? []).map((c, ci) => (
                      <td key={ci}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      },
    },
  };
}

/** Texto rico (Portable Text) com estilo editorial. `lang` marca trechos em PT dentro de páginas EN. */
export function RichText({ value, lang, className }: { value: RichBlock[]; lang?: string; className?: string }) {
  const ids = headingIds(value);
  return (
    <div lang={lang} className={cn("prose-acj", className)}>
      <PortableText value={highlightPending(value) as never} components={buildComponents(ids)} />
    </div>
  );
}
