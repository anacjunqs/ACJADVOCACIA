import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getGoogleReviews, mapPlaces, placeId, reviewLinks } from "@/lib/reviews/google";

const sample = {
  rating: 4.8,
  userRatingCount: 37,
  reviews: Array.from({ length: 7 }, (_, i) => ({
    name: `places/x/reviews/${i}`,
    rating: 5,
    relativePublishTimeDescription: "há 2 meses",
    text: { text: `Texto traduzido ${i}`, languageCode: "pt" },
    originalText: { text: `Original ${i}`, languageCode: "en" },
    authorAttribution: { displayName: `Pessoa ${i}`, uri: "https://www.google.com/maps/contrib/1", photoUri: "https://lh3.googleusercontent.com/a" },
  })),
};

const okFetch = () => vi.fn(async () => new Response(JSON.stringify(sample), { status: 200 })) as unknown as typeof fetch;

beforeEach(() => {
  process.env.NEXT_PUBLIC_ENABLE_TESTIMONIALS = "true";
  process.env.GOOGLE_PLACES_API_KEY = "chave";
  process.env.GOOGLE_PLACE_ID = "ChIJteste";
});
afterEach(() => {
  delete process.env.NEXT_PUBLIC_ENABLE_TESTIMONIALS;
  delete process.env.GOOGLE_PLACES_API_KEY;
  delete process.env.GOOGLE_PLACE_ID;
});

describe("avaliações do Google", () => {
  it("com a flag desligada NÃO chama o Google", async () => {
    delete process.env.NEXT_PUBLIC_ENABLE_TESTIMONIALS;
    const f = okFetch();
    expect(await getGoogleReviews("pt", undefined, f)).toEqual({ status: "disabled" });
    process.env.NEXT_PUBLIC_ENABLE_TESTIMONIALS = "false";
    expect(await getGoogleReviews("pt", undefined, f)).toEqual({ status: "disabled" });
    expect(f).not.toHaveBeenCalled();
  });

  it("sem chave ou sem Place ID: indisponível, sem chamada", async () => {
    const f = okFetch();
    delete process.env.GOOGLE_PLACES_API_KEY;
    expect((await getGoogleReviews("pt", undefined, f)).status).toBe("unavailable");
    process.env.GOOGLE_PLACES_API_KEY = "chave";
    delete process.env.GOOGLE_PLACE_ID;
    expect((await getGoogleReviews("pt", undefined, f)).status).toBe("unavailable");
    expect(f).not.toHaveBeenCalled();
  });

  it("chama a Places API (New) só com os campos necessários, no idioma e com revalidação de no máximo 24 h", async () => {
    const f = okFetch();
    const r = await getGoogleReviews("en", undefined, f);
    expect(r.status).toBe("ok");
    const [url, init] = (f as unknown as ReturnType<typeof vi.fn>).mock.calls[0]! as [string, RequestInit & { next?: { revalidate: number } }];
    expect(url).toBe("https://places.googleapis.com/v1/places/ChIJteste?languageCode=en");
    expect((init.headers as Record<string, string>)["X-Goog-FieldMask"]).toBe("rating,userRatingCount,reviews");
    expect((init.headers as Record<string, string>)["X-Goog-Api-Key"]).toBe("chave");
    expect(init.next?.revalidate).toBeLessThanOrEqual(24 * 60 * 60);
  });

  it("mostra até 5 avaliações, texto original sem alteração, nome como entregue e sem foto", async () => {
    const r = await getGoogleReviews("pt", undefined, okFetch());
    if (r.status !== "ok") throw new Error("esperava ok");
    expect(r.rating).toBe(4.8);
    expect(r.total).toBe(37);
    expect(r.reviews).toHaveLength(5);
    expect(r.reviews[0]).toMatchObject({ text: "Original 0", lang: "en", author: "Pessoa 0", when: "há 2 meses" });
    expect(JSON.stringify(r)).not.toContain("photoUri");
    expect(JSON.stringify(r)).not.toContain("googleusercontent");
  });

  it("falha da API, resposta inválida ou erro de rede: indisponível, sem lançar erro", async () => {
    const bad = vi.fn(async () => new Response("erro", { status: 500 })) as unknown as typeof fetch;
    const boom = vi.fn(async () => { throw new Error("rede"); }) as unknown as typeof fetch;
    const empty = vi.fn(async () => new Response("{}", { status: 200 })) as unknown as typeof fetch;
    expect((await getGoogleReviews("pt", undefined, bad)).status).toBe("unavailable");
    expect((await getGoogleReviews("pt", undefined, boom)).status).toBe("unavailable");
    expect((await getGoogleReviews("pt", undefined, empty)).status).toBe("unavailable");
  });

  it("links derivados do Place ID, com substituição opcional", () => {
    expect(reviewLinks("ChIJabc")).toEqual({
      all: "https://search.google.com/local/reviews?placeid=ChIJabc",
      write: "https://search.google.com/local/writereview?placeid=ChIJabc",
    });
    expect(reviewLinks(undefined)).toEqual({ all: undefined, write: undefined });
    expect(reviewLinks("ChIJabc", { GOOGLE_REVIEWS_URL_OVERRIDE: "https://g.page/r/xyz/reviews" }).all).toBe("https://g.page/r/xyz/reviews");
  });

  it("o Place ID da variável de ambiente prevalece sobre o do CMS", () => {
    expect(placeId("do-cms", { GOOGLE_PLACE_ID: "da-env" })).toBe("da-env");
    expect(placeId("do-cms", {})).toBe("do-cms");
    expect(placeId(undefined, {})).toBeUndefined();
  });

  it("sem avaliações no retorno, mostra só a nota e o total", () => {
    const r = mapPlaces({ rating: 5, userRatingCount: 1 });
    expect(r).toEqual({ status: "ok", rating: 5, total: 1, reviews: [] });
  });
});
