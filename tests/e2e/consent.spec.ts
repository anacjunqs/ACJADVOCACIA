import { expect, test } from "@playwright/test";

const THIRD_PARTY = /(youtube|ytimg|google|vimeo|plausible|googletagmanager)/i;

test("nenhum cookie nem requisição de terceiros antes do consentimento", async ({ page, context }) => {
  const external: string[] = [];
  page.on("request", (r) => {
    const u = new URL(r.url());
    if (!/^(localhost|127\.0\.0\.1)$/.test(u.hostname) && THIRD_PARTY.test(u.hostname)) external.push(r.url());
  });
  await page.goto("/pt/videos");
  await expect(page.getByRole("region", { name: "Aviso de cookies" })).toBeVisible();
  expect(await context.cookies()).toEqual([]);
  expect(external).toEqual([]);
});

test("recusar o opcional guarda só a escolha, e o vídeo pede permissão antes de carregar", async ({ page, context }) => {
  await page.goto("/pt/videos");
  await page.getByRole("button", { name: "Só o necessário" }).click();
  await expect(page.getByRole("region", { name: "Aviso de cookies" })).toBeHidden();

  const cookies = await context.cookies();
  expect(cookies.map((c) => c.name)).toEqual(["acj_consent"]);
  expect(JSON.parse(decodeURIComponent(cookies[0]!.value))).toMatchObject({ analytics: false, media: false });

  await page.reload();
  await expect(page.getByRole("region", { name: "Aviso de cookies" })).toBeHidden();

  await page.getByRole("button", { name: /^Assistir:/ }).click();
  await expect(page.getByText("Este vídeo é do YouTube")).toBeVisible();
  await expect(page.locator("iframe")).toHaveCount(0);

  await page.getByRole("button", { name: "Permitir e assistir" }).click();
  const frame = page.locator("iframe");
  await expect(frame).toHaveCount(1);
  await expect(frame).toHaveAttribute("src", /^https:\/\/www\.youtube-nocookie\.com\/embed\//);
});

test("as preferências podem ser reabertas pelo rodapé", async ({ page }) => {
  await page.goto("/pt");
  await page.getByRole("button", { name: "Aceitar tudo" }).click();
  await page.getByRole("button", { name: "Preferências de cookies" }).click();
  const dialog = page.getByRole("dialog", { name: "Preferências de cookies" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel(/Estatísticas/)).toBeChecked();
  await dialog.getByRole("button", { name: "Fechar sem alterar" }).click();
  await expect(dialog).toBeHidden();
});
