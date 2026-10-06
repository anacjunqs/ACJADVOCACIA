import type { VideoProvider } from "@/lib/content/types";

export type ParsedVideo = { provider: VideoProvider; id: string; hash?: string };

const YT_ID = /^[A-Za-z0-9_-]{6,15}$/;

/** Reconhece links do YouTube e do Vimeo e devolve provedor e identificador. */
export function parseVideoUrl(input: string): ParsedVideo | undefined {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return undefined;
  }
  const host = url.hostname.replace(/^(www|m|player)\./, "");
  const parts = url.pathname.split("/").filter(Boolean);

  if (host === "youtu.be") {
    const id = parts[0];
    return id && YT_ID.test(id) ? { provider: "youtube", id } : undefined;
  }
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const fromQuery = url.searchParams.get("v");
    if (fromQuery && YT_ID.test(fromQuery)) return { provider: "youtube", id: fromQuery };
    if (["embed", "shorts", "live", "v"].includes(parts[0] ?? "") && parts[1] && YT_ID.test(parts[1])) return { provider: "youtube", id: parts[1] };
    return undefined;
  }
  if (host === "vimeo.com") {
    // vimeo.com/123456789, vimeo.com/123456789/abcdef (não listado), player.vimeo.com/video/123456789?h=abcdef
    const idIndex = parts[0] === "video" ? 1 : 0;
    const id = parts[idIndex];
    if (!id || !/^\d+$/.test(id)) return undefined;
    const hash = url.searchParams.get("h") ?? (parts[idIndex + 1] && /^[a-f0-9]+$/i.test(parts[idIndex + 1]!) ? parts[idIndex + 1] : undefined);
    return { provider: "vimeo", id, hash: hash ?? undefined };
  }
  return undefined;
}

/** Endereço do player incorporado, sem cookies de rastreamento (youtube-nocookie e dnt do Vimeo). */
export function embedUrl(v: { provider: VideoProvider; providerId: string; providerHash?: string }, autoplay = true): string {
  if (v.provider === "youtube") {
    const p = new URLSearchParams({ rel: "0", modestbranding: "1", playsinline: "1", ...(autoplay ? { autoplay: "1" } : {}) });
    return `https://www.youtube-nocookie.com/embed/${v.providerId}?${p}`;
  }
  const p = new URLSearchParams({ dnt: "1", ...(autoplay ? { autoplay: "1" } : {}), ...(v.providerHash ? { h: v.providerHash } : {}) });
  return `https://player.vimeo.com/video/${v.providerId}?${p}`;
}

/** Página do vídeo no provedor (alternativa sem carregar o player). */
export function watchUrl(v: { provider: VideoProvider; providerId: string; providerHash?: string }): string {
  return v.provider === "youtube"
    ? `https://www.youtube.com/watch?v=${v.providerId}`
    : `https://vimeo.com/${v.providerId}${v.providerHash ? `/${v.providerHash}` : ""}`;
}

/** Duração ISO 8601 para o JSON-LD (ex.: 200 → PT3M20S). */
export function isoDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s || (!h && !m) ? `${s}S` : ""}`;
}
