import { draftMode } from "next/headers";
import { getClient, getPreviewClient } from "./client";

type FetchOptions = {
  query: string;
  params?: Record<string, unknown>;
  /** Tags de cache: o webhook do Sanity chama /api/revalidate e invalida por tag. */
  tags: string[];
  /** Ignora o modo de rascunho (ex.: sitemap). */
  published?: boolean;
};

async function isDraft(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    // Fora de uma requisição (ex.: geração do sitemap), não há modo de rascunho.
    return false;
  }
}

/**
 * Consulta ao Sanity. Publicado: cache com tags e revalidação de segurança a cada hora.
 * Rascunho (modo de pré-visualização ligado, só para quem entrou pelo Studio): sem cache.
 * Erros de rede PROPAGAM de propósito: assim o Next mantém a última página boa em vez de
 * regenerá-la com o texto de exemplo.
 */
export async function sanityFetch<T>({ query, params = {}, tags, published }: FetchOptions): Promise<T> {
  if (!published && (await isDraft())) {
    const previewClient = getPreviewClient();
    if (previewClient) return previewClient.fetch<T>(query, params, { useCdn: false, cache: "no-store" });
  }
  return getClient().fetch<T>(query, params, { next: { revalidate: 3600, tags } });
}
