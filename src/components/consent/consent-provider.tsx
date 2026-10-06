"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, saveConsent, subscribe, type Consent } from "@/lib/consent/store";

type Ctx = {
  consent: Consent | null;
  /** Falso até o React assumir a página no navegador (evita piscar o banner no carregamento). */
  ready: boolean;
  preferencesOpen: boolean;
  acceptAll: () => void;
  rejectOptional: () => void;
  save: (choice: { analytics: boolean; media: boolean }) => void;
  allowMedia: () => void;
  openPreferences: () => void;
  closePreferences: () => void;
};

const ConsentContext = createContext<Ctx | null>(null);

const noopSubscribe = () => () => {};

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    const open = () => setPreferencesOpen(true);
    window.addEventListener("acj:open-consent", open);
    return () => window.removeEventListener("acj:open-consent", open);
  }, []);

  const save = useCallback(
    (choice: { analytics: boolean; media: boolean }) => {
      const hadAnalytics = consent?.analytics === true;
      saveConsent(choice);
      setPreferencesOpen(false);
      // Retirar a permissão de estatísticas exige recarregar para o script deixar de rodar.
      if (hadAnalytics && !choice.analytics) window.location.reload();
    },
    [consent],
  );

  const value = useMemo<Ctx>(
    () => ({
      consent,
      ready,
      preferencesOpen,
      acceptAll: () => save({ analytics: true, media: true }),
      rejectOptional: () => save({ analytics: false, media: false }),
      save,
      allowMedia: () => save({ analytics: consent?.analytics ?? false, media: true }),
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
    }),
    [consent, ready, preferencesOpen, save],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): Ctx {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent precisa estar dentro de <ConsentProvider>.");
  return ctx;
}
