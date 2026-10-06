// Uso: node scripts/audit-placeholders.ts [--live] [--write]
// Lista, por página, todos os [PREENCHER] e [REVISAR JURIDICAMENTE] pendentes e os campos obrigatórios vazios.
//   --live   audita o conteúdo publicado no Sanity (precisa das variáveis NEXT_PUBLIC_SANITY_*); sem a flag, audita /content/seed
//   --write  grava o relatório em PENDENCIAS.md
import { writeFileSync } from "node:fs";
import { auditLive, auditSeed, notices, renderMarkdown } from "./lib/audit.ts";

const live = process.argv.includes("--live");
const write = process.argv.includes("--write");
const findings = live ? await auditLive() : auditSeed();
const md = renderMarkdown(findings, notices(), live ? "conteúdo publicado no Sanity" : "/content/seed");

if (write) {
  writeFileSync(new URL("../PENDENCIAS.md", import.meta.url), md);
  console.log(`PENDENCIAS.md atualizado: ${findings.length} pendências.`);
} else {
  console.log(md);
}
