import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { getPreviewClient } from "@/sanity/lib/client";

/** Liga o modo de pré-visualização. O segredo é validado pelo Sanity com a sessão de quem abriu o Studio. */
export async function GET(request: Request) {
  const client = getPreviewClient();
  if (!client) return new Response("Pré-visualização não configurada (SANITY_API_READ_TOKEN ausente).", { status: 503 });
  return defineEnableDraftMode({ client }).GET(request);
}
