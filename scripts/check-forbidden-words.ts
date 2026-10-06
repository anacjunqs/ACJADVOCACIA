// Uso: node scripts/check-forbidden-words.ts
// Varre todos os textos do site (mensagens de interface, conteúdo de exemplo e catálogo de serviços) atrás de termos proibidos.
import { readFileSync } from "node:fs";
import { collectStrings, findForbidden } from "../src/lib/forbidden-words.ts";
import { settingsSeed } from "../content/seed/settings.ts";
import { founderSeed } from "../content/seed/founder.ts";
import { pageTextsSeed } from "../content/seed/pages.ts";
import { pillarContentSeed } from "../content/seed/pillars.ts";
import { valuesSeed } from "../content/seed/values.ts";
import { legalSeed } from "../content/seed/legal.ts";
import { articlesSeed, categoriesSeed, videosSeed } from "../content/seed/articles.ts";
import { hub, pillars, services, groups } from "../content/services.ts";

const read = (p: string) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const skip = /(^|\.)(icon|slug|url|id|path|group|pillar|international|key|_type|_key|style)(\.|\[|$)/;

const sources: Record<string, unknown> = {
  "messages/pt": read("../messages/pt.json"),
  "messages/en": read("../messages/en.json"),
  settings: settingsSeed,
  founder: founderSeed,
  pages: pageTextsSeed,
  pillars: pillarContentSeed,
  values: valuesSeed,
  legal: legalSeed,
  articles: articlesSeed,
  categories: categoriesSeed,
  videos: videosSeed,
  "services.titles": services.map((s) => ({ title: s.title, summary: s.summary })),
  "services.groups": Object.values(groups).map((g) => g.title),
  "services.pillars": pillars.map((p) => ({ title: p.title, summary: p.summary })),
  hub,
};

let total = 0;
for (const [name, data] of Object.entries(sources)) {
  for (const s of collectStrings(data)) {
    if (skip.test(s.path)) continue;
    for (const v of findForbidden(s.text)) {
      total++;
      console.log(`✗ ${name}:${s.path} → ${v.label}: "${v.excerpt}"`);
    }
  }
}
console.log(total ? `\n${total} ocorrência(s) de termos proibidos.` : "Nenhum termo proibido encontrado.");
process.exit(total ? 1 : 0);
