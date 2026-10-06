import { expect, test } from "@playwright/test";

test("busca e filtro de artigos funcionam, e o estado fica na URL", async ({ page }) => {
  await page.goto("/pt/artigos");
  await expect(page.getByRole("status")).toContainText("1 artigo encontrado");
  await expect(page.getByRole("heading", { level: 2, name: /Inventário: o que é e por onde começar/ })).toBeVisible();

  await page.getByLabel("Buscar artigos").fill("herança");
  await expect(page).toHaveURL(/q=her/);
  await expect(page.getByRole("status")).toContainText("1 artigo encontrado");

  await page.getByLabel("Buscar artigos").fill("palavra-que-nao-existe");
  await expect(page.getByText("Nenhum artigo corresponde à busca")).toBeVisible();
  await page.getByRole("button", { name: "Limpar filtros" }).click();
  await expect(page.getByRole("status")).toContainText("1 artigo encontrado");
  await expect(page).not.toHaveURL(/q=/);

  await page.getByRole("button", { name: "Inventário e Sucessões" }).click();
  await expect(page).toHaveURL(/cat=inventario-sucessoes/);
  await expect(page.getByRole("button", { name: "Inventário e Sucessões" })).toHaveAttribute("aria-pressed", "true");

  // O link compartilhado reabre no mesmo ponto.
  await page.reload();
  await expect(page.getByRole("button", { name: "Inventário e Sucessões" })).toHaveAttribute("aria-pressed", "true");
});

test("o artigo tem índice, tabela com cabeçalho, link para a área e compartilhamento", async ({ page }) => {
  await page.goto("/pt/artigos/inventario-o-que-e-e-por-onde-comecar");
  // O índice existe em duas versões (recolhido no celular, fixo no desktop); conferimos que ambos apontam para o título.
  await expect(page.locator('nav[aria-label="Neste artigo"] a[href="#cartorio-ou-justica"]')).toHaveCount(2);
  await expect(page.locator("h2#cartorio-ou-justica")).toBeVisible();
  await expect(page.getByRole("table")).toBeVisible();
  await expect(page.getByRole("link", { name: "Inventário e Sucessões" }).first()).toBeVisible();
  const share = page.getByRole("group", { name: "Compartilhar este artigo" });
  await expect(share.getByRole("link", { name: /WhatsApp/ })).toHaveAttribute("href", /^https:\/\/wa\.me\/\?text=/);
  await expect(share.getByRole("button", { name: "Copiar link" })).toBeVisible();
});

test("página em inglês oferece o artigo em inglês e a lista só mostra artigos em inglês", async ({ page }) => {
  await page.goto("/en/articles");
  await expect(page.getByRole("heading", { level: 2, name: /Probate: what it is and where to start/ })).toBeVisible();
  await expect(page.getByText("Inventário: o que é")).toHaveCount(0);
});
