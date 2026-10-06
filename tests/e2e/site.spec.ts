import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { hub, pillars } from "../../content/services";

const ARTICLE = { pt: "inventario-o-que-e-e-por-onde-comecar", en: "probate-what-it-is-and-where-to-start" };

type Route = { pt: string; en: string; name: string };
const routes: Route[] = [
  { name: "início", pt: "/pt", en: "/en" },
  { name: "áreas", pt: "/pt/areas-de-atuacao", en: "/en/practice-areas" },
  ...pillars.map((p) => ({ name: `área ${p.id}`, pt: `/pt/areas-de-atuacao/${p.path.pt}`, en: `/en/practice-areas/${p.path.en}` })),
  { name: "hub", pt: `/pt/${hub.path.pt}`, en: `/en/${hub.path.en}` },
  { name: "sobre", pt: "/pt/sobre", en: "/en/about" },
  { name: "valores", pt: "/pt/valores", en: "/en/values" },
  { name: "artigos", pt: "/pt/artigos", en: "/en/articles" },
  { name: "artigo", pt: `/pt/artigos/${ARTICLE.pt}`, en: `/en/articles/${ARTICLE.en}` },
  { name: "vídeos", pt: "/pt/videos", en: "/en/videos" },
  { name: "contato", pt: "/pt/contato", en: "/en/contact" },
  { name: "privacidade", pt: "/pt/privacidade", en: "/en/privacy" },
  { name: "termos", pt: "/pt/termos", en: "/en/terms" },
  { name: "cookies", pt: "/pt/cookies", en: "/en/cookies" },
];

async function expandAll(page: Page) {
  await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
}

async function axe(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"]).analyze();
  return results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
}

for (const locale of ["pt", "en"] as const) {
  test.describe(`rotas em ${locale}`, () => {
    for (const r of routes) {
      test(`${r.name}: 200, idioma, hreflang, CSP sem violações e acessibilidade (axe)`, async ({ page }) => {
        const csp: string[] = [];
        const errors: string[] = [];
        page.on("console", (m) => {
          if (/content security policy/i.test(m.text())) csp.push(m.text());
          // Erros de JavaScript e de hidratação (React #418 etc.). Falhas de rede de miniaturas externas ficam de fora.
          if (m.type() === "error" && !/Failed to load resource/i.test(m.text())) errors.push(m.text());
        });
        page.on("pageerror", (e) => errors.push(String(e)));
        const res = await page.goto(r[locale]);
        expect(res?.status()).toBe(200);
        await expect(page.locator("html")).toHaveAttribute("lang", locale === "pt" ? "pt-BR" : "en");
        await expect(page.locator("h1")).toHaveCount(1);

        // hreflang: as duas versões e o x-default
        const alts = await page.locator('link[rel="alternate"][hreflang]').evaluateAll((els) => els.map((e) => [e.getAttribute("hreflang"), new URL(e.getAttribute("href")!).pathname]));
        const map = Object.fromEntries(alts as [string, string][]);
        expect(map["pt-BR"]).toBe(r.pt);
        expect(map["en"]).toBe(r.en);
        expect(map["x-default"]).toBe(r.pt);

        // Com o aviso de cookies visível...
        expect(await axe(page), "banner visível").toEqual([]);
        // ...e depois de decidir, com todos os acordeões abertos.
        const accept = page.getByRole("button", { name: locale === "pt" ? "Aceitar tudo" : "Accept all" });
        if (await accept.isVisible()) await accept.click();
        await expandAll(page);
        expect(await axe(page), "conteúdo completo").toEqual([]);
        expect(csp).toEqual([]);
        expect(errors, "erros no console (inclui hidratação)").toEqual([]);
      });
    }

    test("404 localizado no tom da marca e acessível", async ({ page }) => {
      const res = await page.goto(`/${locale}/nao-existe`);
      expect(res?.status()).toBe(404);
      await expect(page.locator("h1")).toContainText(locale === "pt" ? "Não encontramos esta página" : "We could not find this page");
      expect(await axe(page)).toEqual([]);
    });
  });
}

test("OAB e nome da advogada no rodapé de todas as páginas e na página da fundadora", async ({ page }) => {
  for (const r of routes) {
    await page.goto(r.pt);
    await expect(page.locator("footer")).toContainText("Ana Clara Junqueira · OAB/GO 66704");
  }
  await page.goto("/pt/sobre");
  await expect(page.getByRole("main")).toContainText("OAB/GO 66704");
});

test("a página de artigo oferece o link para a tradução e o hreflang liga as duas", async ({ page }) => {
  await page.goto(`/pt/artigos/${ARTICLE.pt}`);
  const link = page.getByRole("link", { name: /Ler este artigo em inglês/ });
  await expect(link).toHaveAttribute("href", `/en/articles/${ARTICLE.en}`);
});

test("trocar de idioma em uma área leva à versão equivalente", async ({ page }) => {
  const p = pillars[2]!;
  await page.goto(`/pt/areas-de-atuacao/${p.path.pt}`);
  await page.getByRole("link", { name: /Mudar para English/ }).first().click();
  await expect(page).toHaveURL(new RegExp(`/en/practice-areas/${p.path.en}$`));
  await page.getByRole("link", { name: /Switch to Português/ }).first().click();
  await expect(page).toHaveURL(new RegExp(`/pt/areas-de-atuacao/${p.path.pt}$`));
});

test("cabeçalhos de segurança", async ({ request }) => {
  const res = await request.get("/pt");
  const h = res.headers();
  expect(h["strict-transport-security"]).toContain("max-age=");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(h["x-frame-options"]).toBe("SAMEORIGIN");
  const csp = h["content-security-policy"] ?? "";
  expect(csp).toContain("frame-src 'self' https://www.youtube-nocookie.com https://player.vimeo.com");
  expect(csp).toContain("object-src 'none'");
  expect(csp).toContain("frame-ancestors 'self'");
  expect(csp).not.toContain("'unsafe-eval'");
  expect(h["x-powered-by"]).toBeUndefined();
});

test("robots e sitemap: site fica fora dos buscadores até o lançamento", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/User-Agent: \*\s+Disallow: \//i);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("<loc>");
  const html = await (await request.get("/pt")).text();
  expect(html).toContain('name="robots" content="noindex, nofollow"');
});

test("imagem Open Graph padrão é gerada, em cada idioma", async ({ request }) => {
  for (const l of ["pt", "en"]) {
    const html = await (await request.get(`/${l}`)).text();
    const url = /property="og:image" content="([^"]+)"/.exec(html)?.[1];
    expect(url, `og:image em ${l}`).toBeTruthy();
    const res = await request.get(new URL(url!).pathname + new URL(url!).search);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
    expect((await res.body()).length).toBeGreaterThan(5_000);
  }
});
