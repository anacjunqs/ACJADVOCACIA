import { NextResponse } from "next/server";
import { createToken } from "@/lib/form/token";

/** Entrega o token assinado de "tempo mínimo de preenchimento". Nunca fica em cache. */
export async function GET() {
  const secret = process.env.CONTACT_FORM_SECRET;
  if (!secret) return NextResponse.json({ token: "" }, { headers: { "Cache-Control": "no-store" } });
  return NextResponse.json({ token: createToken(secret) }, { headers: { "Cache-Control": "no-store" } });
}
