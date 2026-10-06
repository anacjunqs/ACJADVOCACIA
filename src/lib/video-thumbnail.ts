import type { Video } from "@/lib/content/types";

/**
 * Miniatura do vídeo, resolvida no SERVIDOR (o navegador do visitante não contata o YouTube nem o Vimeo
 * antes do consentimento: o `next/image` busca a imagem pelo servidor).
 * Prioridade: miniatura enviada no CMS → YouTube (hqdefault) → Vimeo (oEmbed).
 */
export async function resolveThumbnail(v: Video): Promise<string | undefined> {
  if (v.thumbnail) return v.thumbnail.src;
  if (v.provider === "youtube") return `https://i.ytimg.com/vi/${v.providerId}/hqdefault.jpg`;
  try {
    const target = `https://vimeo.com/${v.providerId}${v.providerHash ? `/${v.providerHash}` : ""}`;
    const res = await fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(target)}`, { next: { revalidate: 86400, tags: ["videos"] } });
    if (!res.ok) return undefined;
    const data = (await res.json()) as { thumbnail_url?: string };
    return data.thumbnail_url?.startsWith("https://i.vimeocdn.com/") ? data.thumbnail_url : undefined;
  } catch {
    return undefined;
  }
}

export async function withThumbnails(videos: Video[]): Promise<Video[]> {
  return Promise.all(videos.map(async (v) => ({ ...v, thumbnailUrl: await resolveThumbnail(v) })));
}
