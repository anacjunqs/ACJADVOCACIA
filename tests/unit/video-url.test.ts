import { describe, expect, it } from "vitest";
import { embedUrl, isoDuration, parseVideoUrl, watchUrl } from "@/lib/video-url";

describe("links de vídeo", () => {
  it("reconhece formatos do YouTube", () => {
    for (const u of [
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://youtu.be/dQw4w9WgXcQ?si=abc",
      "https://m.youtube.com/watch?v=dQw4w9WgXcQ&t=10",
      "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "https://www.youtube.com/shorts/dQw4w9WgXcQ",
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    ]) {
      expect(parseVideoUrl(u), u).toEqual({ provider: "youtube", id: "dQw4w9WgXcQ" });
    }
  });

  it("reconhece formatos do Vimeo, inclusive vídeos não listados", () => {
    expect(parseVideoUrl("https://vimeo.com/123456789")).toEqual({ provider: "vimeo", id: "123456789", hash: undefined });
    expect(parseVideoUrl("https://vimeo.com/123456789/abcdef1234")).toEqual({ provider: "vimeo", id: "123456789", hash: "abcdef1234" });
    expect(parseVideoUrl("https://player.vimeo.com/video/123456789?h=abcdef1234")).toEqual({ provider: "vimeo", id: "123456789", hash: "abcdef1234" });
  });

  it("rejeita links de outros sites ou inválidos", () => {
    for (const u of ["https://example.com/video/1", "não é link", "https://www.youtube.com/", "https://vimeo.com/channels/x"]) {
      expect(parseVideoUrl(u), u).toBeUndefined();
    }
  });

  it("monta o player sem rastreamento e o link de origem", () => {
    expect(embedUrl({ provider: "youtube", providerId: "dQw4w9WgXcQ" })).toContain("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?");
    expect(embedUrl({ provider: "vimeo", providerId: "1", providerHash: "ab" })).toContain("dnt=1");
    expect(watchUrl({ provider: "youtube", providerId: "x1234567890" })).toBe("https://www.youtube.com/watch?v=x1234567890");
  });

  it("formata a duração em ISO 8601", () => {
    expect(isoDuration(200)).toBe("PT3M20S");
    expect(isoDuration(3725)).toBe("PT1H2M5S");
    expect(isoDuration(45)).toBe("PT45S");
  });
});
