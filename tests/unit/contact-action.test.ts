import { beforeEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));
vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": "203.0.113.7" }),
}));

import { submitContact } from "../../src/app/(site)/[locale]/contato/actions";
import { createToken } from "@/lib/form/token";
import { resetRateLimit } from "@/lib/form/ratelimit";

const SECRET = "segredo-de-teste";

function form(overrides: Record<string, string> = {}, ageMs = 10_000): FormData {
  const fd = new FormData();
  const base: Record<string, string> = {
    name: "Maria Souza",
    email: "maria@exemplo.com",
    dial: "55",
    phone: "(62) 90000-0000",
    country: "BR",
    area: "divorcio-partilha",
    message: "Olá, gostaria de entender como funciona a consulta.",
    consent: "on",
    locale: "pt",
    website: "",
    t: createToken(SECRET, Date.now() - ageMs),
  };
  for (const [k, v] of Object.entries({ ...base, ...overrides })) fd.set(k, v);
  return fd;
}

beforeEach(() => {
  send.mockReset();
  send.mockResolvedValue({ data: { id: "1" }, error: null });
  resetRateLimit();
  process.env.RESEND_API_KEY = "re_test";
  process.env.CONTACT_FROM_EMAIL = "ACJ <contato@exemplo.com.br>";
  process.env.CONTACT_TO_EMAIL = "recebe@exemplo.com.br";
  process.env.CONTACT_FORM_SECRET = SECRET;
});

describe("formulário de contato (ação de servidor)", () => {
  it("envia o e-mail com os dados certos e usa reply-to da pessoa", async () => {
    const r = await submitContact({ status: "idle" }, form());
    expect(r.status).toBe("success");
    expect(send).toHaveBeenCalledTimes(1);
    const arg = send.mock.calls[0]![0];
    expect(arg.to).toBe("recebe@exemplo.com.br");
    expect(arg.replyTo).toBe("maria@exemplo.com");
    expect(arg.subject).toContain("Maria Souza");
    expect(arg.text).toContain("+55 62900000000");
    expect(arg.text).toContain("Brasil (BR)");
    expect(arg.text).toContain("Divórcio e Partilha");
  });

  it("honeypot preenchido: finge sucesso e não envia nada", async () => {
    const r = await submitContact({ status: "idle" }, form({ website: "http://spam.example" }));
    expect(r.status).toBe("success");
    expect(send).not.toHaveBeenCalled();
  });

  it("rápido demais ou sem token: recusa", async () => {
    expect((await submitContact({ status: "idle" }, form({}, 500))).formError).toBe("tooFast");
    expect((await submitContact({ status: "idle" }, form({ t: "" }))).formError).toBe("tooFast");
    expect((await submitContact({ status: "idle" }, form({ t: "123.abc" }))).formError).toBe("tooFast");
    expect(send).not.toHaveBeenCalled();
  });

  it("token assinado com outro segredo é recusado", async () => {
    const r = await submitContact({ status: "idle" }, form({ t: createToken("outro-segredo", Date.now() - 10_000) }));
    expect(r.formError).toBe("tooFast");
  });

  it("devolve erros por campo e preserva o que a pessoa digitou", async () => {
    const r = await submitContact({ status: "idle" }, form({ name: "", email: "isso-nao-e-email", message: "oi", consent: "", country: "XX", area: "x" }));
    expect(r.status).toBe("error");
    expect(Object.keys(r.fieldErrors ?? {}).sort()).toEqual(["area", "consent", "country", "email", "message", "name"]);
    expect(r.values?.message).toBe("oi");
    expect(send).not.toHaveBeenCalled();
  });

  it("limita envios válidos por IP, mas erros de digitação não gastam a cota", async () => {
    for (let i = 0; i < 5; i++) await submitContact({ status: "idle" }, form({ email: "ruim" }));
    expect((await submitContact({ status: "idle" }, form())).status).toBe("success");
    expect((await submitContact({ status: "idle" }, form())).status).toBe("success");
    expect((await submitContact({ status: "idle" }, form())).status).toBe("success");
    const blocked = await submitContact({ status: "idle" }, form());
    expect(blocked.formError).toBe("rateLimited");
    expect(send).toHaveBeenCalledTimes(3);
  });

  it("quebras de linha no nome não entram no assunto (injeção de cabeçalho)", async () => {
    await submitContact({ status: "idle" }, form({ name: "Ana\r\nBcc: alguem@x.com" }));
    expect(send.mock.calls[0]![0].subject).not.toMatch(/[\r\n]/);
  });

  it("sem credenciais de envio: informa indisponibilidade e não envia", async () => {
    delete process.env.RESEND_API_KEY;
    const r = await submitContact({ status: "idle" }, form());
    expect(r.formError).toBe("unavailable");
    expect(send).not.toHaveBeenCalled();
  });

  it("falha do provedor de e-mail vira erro genérico (sem vazar detalhes)", async () => {
    send.mockResolvedValue({ data: null, error: { name: "application_error", message: "segredo interno" } });
    const r = await submitContact({ status: "idle" }, form());
    expect(r.formError).toBe("generic");
    expect(JSON.stringify(r)).not.toContain("segredo interno");
  });

  it("aceita telefone em formatos comuns e rejeita telefone curto demais", async () => {
    expect((await submitContact({ status: "idle" }, form({ phone: "+1 (415) 555-0100", dial: "1", country: "US" }))).status).toBe("success");
    resetRateLimit();
    expect((await submitContact({ status: "idle" }, form({ phone: "123" }))).fieldErrors?.phone).toBe("phone");
  });
});
