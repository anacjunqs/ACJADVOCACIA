import { expect, test } from "@playwright/test";

test.describe("depoimentos com a flag desligada (padrão)", () => {
  test("as rotas respondem 404", async ({ request }) => {
    expect((await request.get("/pt/depoimentos")).status()).toBe(404);
    expect((await request.get("/en/testimonials")).status()).toBe(404);
  });

  test("o item some do menu, do rodapé e da home", async ({ page }) => {
    await page.goto("/pt");
    await expect(page.getByRole("link", { name: "Depoimentos" })).toHaveCount(0);
    await expect(page.getByText("Avaliações no Google")).toHaveCount(0);
    const html = await page.content();
    expect(html).not.toMatch(/places\.googleapis|search\.google\.com\/local/);
  });
});
