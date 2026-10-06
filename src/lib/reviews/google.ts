import { testimonialsEnabled } from "@/lib/seo/site";
import type { AppLocale } from "@/lib/i18n/routing";

/**
 * Avaliações do Google (Places API (New)), SOMENTE no servidor.
 * - Só roda com NEXT_PUBLIC_ENABLE_TESTIMONIALS=true. Desligado: nenhuma chamada ao Google.
 * - Nada é gravado em banco ou arquivo; a resposta é reaproveitada pelo cache do Next por no máximo 12 h.
 * - O texto é mostrado como o Google entrega (sem edição). Sem fotos de avaliadores. Sem JSON-LD de avaliação.
 */
export type GoogleReview = {
  id: string;
  rating: number;
  /** Texto original da avaliação, sem alteração. */
  text: string;
  /** Idioma do texto original (para o atributo lang). */
  lang?: string;
  author: string;
  authorUrl?: string;
  /** Data relativa como o Google entrega (ex.: "há 2 meses"). */
  when?: string;
};

export type ReviewsResult =
  | { status: "ok"; rating: number; total: number; reviews: GoogleReview[] }
  | { status: "unavailable" }
  | { status: "disabled" };

export const MAX_REVIEWS = 5;
export const REVIEWS_REVALIDATE_SECONDS = 12 * 60 * 60;

export function placeId(cmsFallback?: string, env: Record<string, string | undefined> = process.env): string | undefined {
  return env.GOOGLE_PLACE_ID?.trim() || cmsFallback?.trim() || undefined;
}

/** "Ver todas" e "Avaliar no Google": derivados do Place ID, com substituição opcional por variável de ambiente. */
export function reviewLinks(id: string | undefined, env: Record<string, string | undefined> = process.env): { all?: string; write?: string } {
  const enc = id ? encodeURIComponent(id) : undefined;
  return {
    all: env.GOOGLE_REVIEWS_URL_OVERRIDE?.trim() || (enc ? `https://search.google.com/local/reviews?placeid=${enc}` : undefined),
    write: env.GOOGLE_WRITE_REVIEW_URL_OVERRIDE?.trim() || (enc ? `https://search.google.com/local/writereview?placeid=${enc}` : undefined),
  };
}

type PlacesReview = {
  name?: string;
  rating?: number;
  relativePublishTimeDescription?: string;
  text?: { text?: string; languageCode?: string };
  originalText?: { text?: string; languageCode?: string };
  authorAttribution?: { displayName?: string; uri?: string };
};
type PlacesResponse = { rating?: number; userRatingCount?: number; reviews?: PlacesReview[] };

export function mapPlaces(data: PlacesResponse): ReviewsResult {
  if (typeof data.rating !== "number" || typeof data.userRatingCount !== "number") return { status: "unavailable" };
  const reviews: GoogleReview[] = (data.reviews ?? [])
    .flatMap((r, i): GoogleReview[] => {
      const body = r.originalText?.text ?? r.text?.text;
      if (!body || typeof r.rating !== "number") return [];
      return [
        {
          id: r.name ?? `r${i}`,
          rating: Math.max(1, Math.min(5, r.rating)),
          text: body,
          lang: r.originalText?.languageCode ?? r.text?.languageCode,
          author: r.authorAttribution?.displayName ?? "",
          authorUrl: r.authorAttribution?.uri?.startsWith("https://") ? r.authorAttribution.uri : undefined,
          when: r.relativePublishTimeDescription,
        },
      ];
    })
    .slice(0, MAX_REVIEWS);
  return { status: "ok", rating: data.rating, total: data.userRatingCount, reviews };
}

/** Nunca lança erro: qualquer falha vira "unavailable" e a página esconde a seção sem mostrar erro. */
export async function getGoogleReviews(locale: AppLocale, cmsPlaceId?: string, fetchImpl: typeof fetch = fetch): Promise<ReviewsResult> {
  if (!testimonialsEnabled()) return { status: "disabled" };
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const id = placeId(cmsPlaceId);
  if (!key || !id) return { status: "unavailable" };
  try {
    const url = `https://places.googleapis.com/v1/places/${encodeURIComponent(id)}?languageCode=${locale === "pt" ? "pt-BR" : "en"}`;
    const res = await fetchImpl(url, {
      headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "rating,userRatingCount,reviews" },
      next: { revalidate: REVIEWS_REVALIDATE_SECONDS, tags: ["reviews"] },
    });
    if (!res.ok) return { status: "unavailable" };
    return mapPlaces((await res.json()) as PlacesResponse);
  } catch {
    return { status: "unavailable" };
  }
}
