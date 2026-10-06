import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

/** Desliga o modo de pré-visualização e volta para o site publicado. */
export async function GET(request: Request) {
  (await draftMode()).disable();
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect") ?? "/";
  // Só aceita caminhos internos (evita redirecionamento para sites externos).
  const safe = redirectTo.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/";
  return NextResponse.redirect(new URL(safe, url.origin));
}
