import { isSanityConfigured } from "@/sanity/env";
import StudioClient from "./studio-client";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 560, margin: "15vh auto", padding: 24, lineHeight: 1.6 }}>
        <h1 style={{ fontSize: 24 }}>Painel ainda não configurado</h1>
        <p>
          Defina <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> e <code>NEXT_PUBLIC_SANITY_DATASET</code> nas variáveis de ambiente e faça um novo deploy.
          Enquanto isso, o site usa os textos de exemplo de <code>/content/seed</code>.
        </p>
      </main>
    );
  }
  return <StudioClient />;
}
