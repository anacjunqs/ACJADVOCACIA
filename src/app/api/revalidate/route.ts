import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { tagsFor, type RevalidatePayload } from "@/lib/revalidate-tags";

/**
 * Webhook do Sanity → atualiza o site sem novo deploy.
 * Protegido por assinatura HMAC (SANITY_REVALIDATE_SECRET). Configuração do webhook no README.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ ok: false, message: "Revalidação não configurada." }, { status: 503 });

  const { isValidSignature, body } = await parseBody<RevalidatePayload>(req, secret, true);
  if (!isValidSignature) return NextResponse.json({ ok: false, message: "Assinatura inválida." }, { status: 401 });
  if (!body?._type) return NextResponse.json({ ok: false, message: "Corpo inválido." }, { status: 400 });

  const tags = tagsFor(body);
  for (const tag of tags) revalidateTag(tag, "max");
  return NextResponse.json({ ok: true, revalidated: tags });
}
