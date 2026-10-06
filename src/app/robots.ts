import type { MetadataRoute } from "next";
import { absoluteUrl, isIndexable } from "@/lib/seo/site";

/** Enquanto NEXT_PUBLIC_SITE_INDEXABLE não for "true", nenhum buscador deve indexar o site. */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/studio", "/api/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
