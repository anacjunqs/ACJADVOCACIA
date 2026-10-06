import { describe, expect, it } from "vitest";
import { createToken, MAX_AGE_MS, MIN_FILL_MS, verifyToken } from "@/lib/form/token";
import { checkRateLimit, hashIp, resetRateLimit } from "@/lib/form/ratelimit";
import { COUNTRIES, countryOptions, dialCodes, isCountry, POPULAR_COUNTRIES } from "@/lib/countries";
import { composeEmail } from "@/lib/form/email";
import { contactSchema } from "@/lib/form/schema";

describe("token de tempo mínimo", () => {
  const now = 1_800_000_000_000;
  it("aceita entre o mínimo e o máximo", () => {
    expect(verifyToken("s", createToken("s", now - MIN_FILL_MS - 1), now)).toBe("ok");
  });
  it("recusa rápido demais, expirado, adulterado e ausente", () => {
    expect(verifyToken("s", createToken("s", now - 100), now)).toBe("too-fast");
    expect(verifyToken("s", createToken("s", now - MAX_AGE_MS - 1), now)).toBe("expired");
    const t = createToken("s", now - 10_000);
    expect(verifyToken("s", t.replace(/.$/, "0"), now)).toBe("invalid");
    expect(verifyToken("s", undefined, now)).toBe("missing");
    expect(verifyToken("s", "abc", now)).toBe("invalid");
  });
});

describe("limite por IP", () => {
  it("3 envios em 10 minutos; libera depois da janela", () => {
    resetRateLimit();
    const k = hashIp("1.2.3.4", "salt");
    const t0 = 1_000_000;
    expect(checkRateLimit(k, t0).allowed).toBe(true);
    expect(checkRateLimit(k, t0 + 1000).allowed).toBe(true);
    expect(checkRateLimit(k, t0 + 2000).allowed).toBe(true);
    const blocked = checkRateLimit(k, t0 + 3000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
    expect(checkRateLimit(k, t0 + 11 * 60 * 1000).allowed).toBe(true);
  });
  it("o hash não revela o IP", () => {
    expect(hashIp("1.2.3.4", "s")).not.toContain("1.2.3.4");
  });
});

describe("países e DDI", () => {
  it("dados coerentes", () => {
    expect(COUNTRIES.BR).toBe("55");
    expect(COUNTRIES.PT).toBe("351");
    expect(isCountry("US")).toBe(true);
    expect(isCountry("ZZ")).toBe(false);
    for (const [code, dial] of Object.entries(COUNTRIES)) {
      expect(code).toMatch(/^[A-Z]{2}$/);
      expect(dial).toMatch(/^\d{1,3}$/);
    }
    for (const p of POPULAR_COUNTRIES) expect(isCountry(p), p).toBe(true);
    expect(dialCodes()).toContain("55");
  });
  it("lista localizada e ordenada", () => {
    const pt = countryOptions("pt");
    expect(pt.find((c) => c.code === "BR")?.name).toBe("Brasil");
    expect(countryOptions("en").find((c) => c.code === "BR")?.name).toBe("Brazil");
    expect(pt.length).toBe(Object.keys(COUNTRIES).length);
  });
});

describe("e-mail", () => {
  it("compõe assunto e texto em português", () => {
    const input = contactSchema.parse({ name: "Ana", email: "a@b.co", dial: "351", phone: "912345678", country: "PT", area: "hub", message: "Preciso de ajuda com um tema.", consent: "on", locale: "en" });
    const { subject, text } = composeEmail(input, new Date("2026-10-01T10:00:00Z"));
    expect(subject).toContain("Famílias entre Países");
    expect(text).toContain("Portugal (PT)");
    expect(text).toContain("Idioma do site: inglês");
    expect(text).toContain("2026-10-01T10:00:00.000Z");
  });
});
