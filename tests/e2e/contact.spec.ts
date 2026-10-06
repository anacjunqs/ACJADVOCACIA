import { expect, test, type Page } from "@playwright/test";

const MOCK = "http://localhost:4010";
type Mail = { to?: string | string[]; reply_to?: string | string[]; replyTo?: string | string[]; text?: string; subject?: string };
const received = async () => (await (await fetch(`${MOCK}/__requests`)).json()) as Mail[];
const clear = () => fetch(`${MOCK}/__requests`, { method: "DELETE" });

async function ready(page: Page) {
  await page.goto("/pt/contato");
  // O token só vale depois de ~3 s (tempo mínimo de preenchimento): esperamos como uma pessoa esperaria.
  await expect.poll(async () => page.locator('input[name="t"]').inputValue(), { timeout: 8000 }).not.toBe("");
  await page.waitForTimeout(3300);
}

async function fill(page: Page, over: Partial<Record<"name" | "email" | "phone" | "message", string>> = {}) {
  await page.getByLabel("Seu nome").fill(over.name ?? "Maria Souza");
  await page.getByLabel("Seu e-mail").fill(over.email ?? "maria@exemplo.com");
  await page.getByLabel("País onde você mora").selectOption("PT");
  await page.getByLabel(/^Telefone/).fill(over.phone ?? "912 345 678");
  await page.getByLabel("Assunto de interesse").selectOption("divorcio-partilha");
  await page.getByLabel(/Conte, em poucas linhas/).fill(over.message ?? "Olá, gostaria de saber como funciona a consulta.");
  await page.getByLabel(/Concordo em enviar/).check();
}

test.beforeEach(async () => {
  await clear();
});

test("envia a mensagem e o e-mail chega ao provedor com os dados certos", async ({ page }) => {
  await ready(page);
  await fill(page);
  // Ao escolher Portugal, o código do telefone acompanha (+351), sem a pessoa precisar mexer.
  await expect(page.getByLabel("Código do país do telefone")).toHaveValue("351");
  await page.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(page.getByRole("heading", { name: "Mensagem enviada" })).toBeVisible();
  const mails = await received();
  expect(mails).toHaveLength(1);
  expect([mails[0]!.to].flat()).toEqual(["recebe@exemplo.com.br"]);
  expect(String(mails[0]!.reply_to ?? mails[0]!.replyTo)).toContain("maria@exemplo.com");
  expect(mails[0]!.text).toContain("+351 912345678");
  expect(mails[0]!.text).toContain("Portugal (PT)");
});

test("erro de validação no servidor aparece em português, ligado ao campo, sem perder o texto", async ({ page }) => {
  await ready(page);
  await fill(page, { email: "a@b", message: "Mensagem que não deve se perder ao corrigir o e-mail." });
  await page.getByRole("button", { name: "Enviar mensagem" }).click();
  const alert = page.locator("form [role=alert]");
  await expect(alert).toContainText("Informe um e-mail válido.");
  await expect(alert).toBeFocused();
  await expect(page.getByLabel("Seu e-mail")).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByLabel(/Conte, em poucas linhas/)).toHaveValue("Mensagem que não deve se perder ao corrigir o e-mail.");
  expect(await received()).toHaveLength(0);
});

test("envio rápido demais é recusado", async ({ page }) => {
  await page.goto("/pt/contato");
  await expect.poll(async () => page.locator('input[name="t"]').inputValue(), { timeout: 8000 }).not.toBe("");
  await fill(page);
  await page.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(page.locator("form [role=alert]")).toContainText("Esperamos alguns segundos");
  expect(await received()).toHaveLength(0);
});

test("robô que preenche o campo-isca parece ter sucesso, mas nada é enviado", async ({ page }) => {
  await ready(page);
  await fill(page);
  await page.locator('input[name="website"]').evaluate((el: HTMLInputElement) => (el.value = "http://spam.example"));
  await page.getByRole("button", { name: "Enviar mensagem" }).click();
  await expect(page.getByRole("heading", { name: "Mensagem enviada" })).toBeVisible();
  expect(await received()).toHaveLength(0);
});

test("a página mostra o aviso de que não há relação advogado-cliente", async ({ page }) => {
  await page.goto("/pt/contato");
  await expect(page.getByRole("note")).toContainText("não estabelece relação entre advogado e cliente");
  await page.goto("/en/contact");
  await expect(page.getByRole("note")).toContainText("does not create an attorney-client relationship");
});
