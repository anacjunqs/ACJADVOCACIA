"use client";

import { serif, sans } from "@/lib/fonts";
import "./globals.css";

/**
 * Último recurso: erro no layout raiz. Bilíngue, no tom da marca, sem detalhes técnicos.
 * Mantém o nome e a OAB da advogada (obrigatórios em todas as páginas).
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <main className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center px-6 py-16 text-center">
          <h1 className="text-3xl">Algo não saiu como esperado</h1>
          <p className="mt-3 text-fg-muted">Tivemos um problema ao abrir esta página. Tente novamente em instantes.</p>
          <p lang="en" className="mt-6 text-fg-muted">
            Something did not go as expected. Please try again in a moment.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-12 items-center rounded-control bg-navy px-6 font-bold text-white"
            >
              Tentar novamente / Try again
            </button>
            {/* Recarga completa de propósito: o roteador pode estar quebrado neste ponto. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/" className="inline-flex min-h-12 items-center rounded-control border-2 border-navy px-6 font-bold text-navy">
              Início / Home
            </a>
          </div>
        </main>
        <footer className="surface-navy px-6 py-6 text-center text-sm">Ana Clara Junqueira · OAB/GO 66704</footer>
      </body>
    </html>
  );
}
