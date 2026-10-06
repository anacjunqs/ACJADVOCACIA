// Uso: node scripts/check-overflow.mjs <baseUrl> <caminho> [caminho...]
// Aponta páginas com rolagem horizontal (problema comum em celulares) e os elementos que a causam.
import { chromium } from "@playwright/test";
import { launchOptions } from "./browser.mjs";

const [base, ...paths] = process.argv.slice(2);
const browser = await chromium.launch(launchOptions);
let bad = 0;
for (const w of [360, 390, 768, 1024, 1280]) {
  const page = await browser.newPage({ viewport: { width: w, height: 800 } });
  for (const p of paths) {
    await page.goto(base + p, { waitUntil: "networkidle" });
    const r = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const offenders = [...document.querySelectorAll("body *")]
        .filter((e) => !(e instanceof SVGElement) && e.getBoundingClientRect().right > vw + 1 && getComputedStyle(e).position !== "fixed")
        .slice(0, 5)
        .map((e) => `${e.tagName.toLowerCase()}.${String(e.className).slice(0, 60)} → ${Math.round(e.getBoundingClientRect().right)}px`);
      return { vw, sw: document.documentElement.scrollWidth, offenders };
    });
    if (r.sw > r.vw) {
      bad++;
      console.log(`✗ ${w}px ${p}: scrollWidth ${r.sw} > ${r.vw}\n   ${r.offenders.join("\n   ")}`);
    }
  }
  await page.close();
}
await browser.close();
console.log(bad ? `${bad} página(s) com rolagem horizontal` : "sem rolagem horizontal");
process.exit(bad ? 1 : 0);
