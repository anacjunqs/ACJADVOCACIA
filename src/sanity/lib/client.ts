import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

let published: SanityClient | undefined;
let preview: SanityClient | undefined;

/** Cliente de leitura do conteúdo publicado (CDN). Só existe quando o Sanity está configurado. */
export function getClient(): SanityClient {
  if (!isSanityConfigured) throw new Error("Sanity não configurado (NEXT_PUBLIC_SANITY_PROJECT_ID ausente).");
  published ??= createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published", timeout: 15000 });
  return published;
}

/** Cliente de pré-visualização (rascunhos). Requer SANITY_API_READ_TOKEN e nunca é enviado ao navegador. */
export function getPreviewClient(): SanityClient | undefined {
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!isSanityConfigured || !token) return undefined;
  preview ??= createClient({ projectId, dataset, apiVersion, useCdn: false, perspective: "drafts", token, timeout: 15000 });
  return preview;
}
