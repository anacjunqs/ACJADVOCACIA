import type { Video } from "@/lib/content/types";
import { embedUrl, isoDuration, watchUrl } from "@/lib/video-url";
import { stripPending } from "@/lib/pending";
import { absoluteUrl } from "@/lib/seo/site";

/** VideoObject (schema.org). Só existe quando há miniatura, que o Google exige. */
export function videoObject(v: Video): Record<string, unknown> | undefined {
  const thumb = v.thumbnail?.src ?? v.thumbnailUrl;
  if (!thumb) return undefined;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: stripPending(v.title),
    description: stripPending(v.description) || stripPending(v.title),
    thumbnailUrl: thumb.startsWith("http") ? thumb : absoluteUrl(thumb),
    uploadDate: v.publishedAt,
    inLanguage: v.language === "en" ? "en" : "pt-BR",
    embedUrl: embedUrl(v, false),
    contentUrl: watchUrl(v),
    ...(v.durationSeconds ? { duration: isoDuration(v.durationSeconds) } : {}),
  };
}
