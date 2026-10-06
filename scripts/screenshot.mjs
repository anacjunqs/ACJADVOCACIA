// Uso: node scripts/screenshot.mjs <url> <saida.png> [largura=390] [altura=844] [fullPage=1]
import { chromium } from "@playwright/test";
import { launchOptions } from "./browser.mjs";

const [url, out, w = "390", h = "844", full = "1"] = process.argv.slice(2);
if (!url || !out) {
  console.error("uso: node scripts/screenshot.mjs <url> <saida.png> [largura] [altura] [fullPage]");
  process.exit(1);
}
const browser = await chromium.launch(launchOptions);
const page = await browser.newPage({ viewport: { width: Number(w), height: Number(h) }, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle" });
await page.screenshot({ path: out, fullPage: full === "1" });
await browser.close();
