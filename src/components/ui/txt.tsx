import { splitPending } from "@/lib/pending";

/**
 * Renderiza texto destacando [PREENCHER...] e [REVISAR...]. Enquanto houver pendências,
 * elas ficam visíveis de propósito: em produção indexável o build e o Studio as bloqueiam.
 */
export function Txt({ children }: { children: string }) {
  const parts = splitPending(children);
  if (parts.length === 1 && !parts[0]?.pending) return <>{children}</>;
  return (
    <>
      {parts.map((p, i) =>
        p.pending ? (
          <mark key={i} data-pending>
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}
