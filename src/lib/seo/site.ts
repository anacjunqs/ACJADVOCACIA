export function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return "http://localhost:3000";
}

export const absoluteUrl = (path: string): string => `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;

/** O site só é indexável quando NEXT_PUBLIC_SITE_INDEXABLE=true (lançamento). */
export const isIndexable = (): boolean => process.env.NEXT_PUBLIC_SITE_INDEXABLE === "true";

export const testimonialsEnabled = (): boolean => process.env.NEXT_PUBLIC_ENABLE_TESTIMONIALS === "true";
