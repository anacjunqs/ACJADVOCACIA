"use client";

/**
 * Reabre as preferências de cookies. A lógica de consentimento chega na etapa 5;
 * por ora o botão dispara o evento que o banner passará a ouvir.
 */
export function CookiePreferencesButton({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("acj:open-consent"))}>
      {label}
    </button>
  );
}
