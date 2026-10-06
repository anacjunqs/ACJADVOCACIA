// Trava de lançamento, executada antes do `next build`.
// Só age quando NEXT_PUBLIC_SITE_INDEXABLE=true (ou seja, no lançamento): se ainda houver [PREENCHER], [REVISAR JURIDICAMENTE]
// ou campo obrigatório vazio, o build falha e mostra o que falta. SKIP_LAUNCH_GATE=true ignora (uso interno de testes).
import { auditLive, auditSeed } from "./lib/audit.ts";

if (process.env.NEXT_PUBLIC_SITE_INDEXABLE !== "true" || process.env.SKIP_LAUNCH_GATE === "true") process.exit(0);

const configured = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
const findings = configured ? await auditLive() : auditSeed();
if (findings.length === 0) {
  console.log("Trava de lançamento: nenhuma pendência. Pode publicar.");
  process.exit(0);
}

console.error(`\n✋ Trava de lançamento: NEXT_PUBLIC_SITE_INDEXABLE=true, mas há ${findings.length} pendência(s) no conteúdo:\n`);
for (const f of findings.slice(0, 40)) console.error(`  • [${f.kind}] ${f.page} — ${f.where}: ${f.text}`);
if (findings.length > 40) console.error(`  … e mais ${findings.length - 40}. Rode \`npm run audit:content\` para a lista completa.`);
console.error("\nResolva as pendências (CMS ou /content/seed) ou volte NEXT_PUBLIC_SITE_INDEXABLE para false.\n");
process.exit(1);
