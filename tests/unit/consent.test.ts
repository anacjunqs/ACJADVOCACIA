import { describe, expect, it } from "vitest";
import { parseConsent, serializeConsent, CONSENT_COOKIE } from "@/lib/consent/store";

describe("consentimento", () => {
  it("ida e volta do cookie", () => {
    const c = { v: 1 as const, analytics: true, media: false, ts: 123 };
    const raw = serializeConsent(c).slice(CONSENT_COOKIE.length + 1);
    expect(parseConsent(raw)).toEqual(c);
  });
  it("cookie ausente, corrompido ou de outra versão vira 'sem escolha'", () => {
    expect(parseConsent(undefined)).toBeNull();
    expect(parseConsent("")).toBeNull();
    expect(parseConsent("%7Bnao-json")).toBeNull();
    expect(parseConsent(encodeURIComponent(JSON.stringify({ v: 2, analytics: true, media: true })))).toBeNull();
    expect(parseConsent(encodeURIComponent(JSON.stringify({ v: 1, analytics: "sim", media: true })))).toBeNull();
  });
});
