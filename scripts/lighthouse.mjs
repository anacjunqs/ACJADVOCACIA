// Uso: node scripts/lighthouse.mjs <baseUrl> <caminho> [caminho...]
// Mede Desempenho, Acessibilidade, Boas práticas e SEO (celular, padrão do Lighthouse) e exige ≥ 90 em todas.
// Para o SEO passar, o site precisa estar indexável: compile com NEXT_PUBLIC_SITE_INDEXABLE=true.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const [base, ...paths] = process.argv.slice(2);
if (!base || paths.length === 0) {
  console.error("uso: node scripts/lighthouse.mjs <baseUrl> <caminho> [caminho...]");
  process.exit(1);
}
const chrome = process.env.CHROME_PATH || (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);
const MIN = Number(process.env.LH_MIN || 90);
let failed = false;

for (const p of paths) {
  const args = [
    "lighthouse",
    base + p,
    "--output=json",
    "--output-path=stdout",
    "--quiet",
    "--only-categories=performance,accessibility,best-practices,seo",
    "--chrome-flags=--headless=new --no-sandbox --disable-gpu",
  ];
  const r = spawnSync("npx", args, { encoding: "utf8", env: { ...process.env, ...(chrome ? { CHROME_PATH: chrome } : {}) }, maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0 || !r.stdout) {
    console.log(`✗ ${p}: Lighthouse falhou\n${r.stderr?.slice(0, 400)}`);
    failed = true;
    continue;
  }
  const lh = JSON.parse(r.stdout);
  const s = Object.fromEntries(Object.entries(lh.categories).map(([k, v]) => [k, Math.round((v.score ?? 0) * 100)]));
  const ok = Object.values(s).every((n) => n >= MIN);
  if (!ok) failed = true;
  const m = lh.audits;
  console.log(
    `${ok ? "✓" : "✗"} ${p.padEnd(52)} desempenho ${s.performance} · acessibilidade ${s.accessibility} · boas práticas ${s["best-practices"]} · SEO ${s.seo}` +
      `   (LCP ${m["largest-contentful-paint"]?.displayValue}, CLS ${m["cumulative-layout-shift"]?.displayValue}, TBT ${m["total-blocking-time"]?.displayValue})`,
  );
  if (!ok) {
    for (const cat of Object.values(lh.categories)) {
      if ((cat.score ?? 0) * 100 >= MIN) continue;
      for (const ref of cat.auditRefs) {
        const a = lh.audits[ref.id];
        if (a && a.score !== null && a.score < 0.9 && ref.weight > 0) console.log(`     - [${cat.id}] ${a.title}${a.displayValue ? ` (${a.displayValue})` : ""}`);
      }
    }
  }
}
process.exit(failed ? 1 : 0);
