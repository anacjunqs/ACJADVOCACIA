"use client";

import { useConsent } from "./consent-provider";

/** Reabre as preferências de cookies (rodapé). */
export function CookiePreferencesButton({ label, className }: { label: string; className?: string }) {
  const { openPreferences } = useConsent();
  return (
    <button type="button" className={className} onClick={openPreferences}>
      {label}
    </button>
  );
}
