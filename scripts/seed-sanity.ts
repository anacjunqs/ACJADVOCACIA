// Uso: node scripts/seed-sanity.ts [--dry-run]
// Importa os textos de exemplo de /content/seed para o Sanity, SEM sobrescrever nada que já exista.
// Requer NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET e SANITY_API_WRITE_TOKEN (somente local).
import { createClient } from "@sanity/client";
import { buildDocs } from "./seed-docs.ts";

const dryRun = process.argv.includes("--dry-run");
const docs = buildDocs();

if (dryRun) {
  console.log(`[dry-run] ${docs.length} documentos seriam criados (se ainda não existirem):`);
  for (const d of docs) console.log(` - ${d._type} · ${d._id}`);
  process.exit(0);
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!projectId || !token) {
  console.error("Defina NEXT_PUBLIC_SANITY_PROJECT_ID e SANITY_API_WRITE_TOKEN (ex.: em .env.local) antes de rodar.");
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01", useCdn: false });

const tx = client.transaction();
for (const d of docs) tx.createIfNotExists(d);
const res = await tx.commit();
console.log(`Pronto: ${res.results.length} documentos verificados em ${projectId}/${dataset}. Os que já existiam foram mantidos.`);
