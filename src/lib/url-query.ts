"use client";

import { useSyncExternalStore } from "react";

const EVENT = "acj:urlchange";

function subscribe(cb: () => void): () => void {
  window.addEventListener("popstate", cb);
  window.addEventListener(EVENT, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(EVENT, cb);
  };
}

/**
 * Parâmetros da URL (?cat=&q=&page=) sem `useSearchParams`: a página continua estática e o HTML do servidor
 * já traz a lista completa (sem "pulo" de layout quando o JavaScript carrega). No servidor devolve vazio.
 */
export function useQueryParams(): URLSearchParams {
  const search = useSyncExternalStore(
    subscribe,
    () => window.location.search,
    () => "",
  );
  return new URLSearchParams(search);
}

/** Atualiza a URL sem recarregar nem criar entrada no histórico. Valores vazios removem o parâmetro. */
export function setQueryParams(patch: Record<string, string | undefined>): void {
  const sp = new URLSearchParams(window.location.search);
  for (const [k, v] of Object.entries(patch)) {
    if (v) sp.set(k, v);
    else sp.delete(k);
  }
  const qs = sp.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  window.dispatchEvent(new Event(EVENT));
}
