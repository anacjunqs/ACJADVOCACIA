/**
 * Motivo decorativo: rotas abstratas ligando pontos, sem mapa real e sem referência a países.
 * Somente sobre fundo navy. Traços finos em dourado, sem função informativa.
 */
export function RoutesMotif({ className }: { className?: string }) {
  const stroke = "var(--gold-300)";
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 800 360"
      preserveAspectRatio="xMidYMid slice"
      className={className ?? "pointer-events-none absolute inset-0 h-full w-full opacity-30"}
      fill="none"
    >
      <g stroke={stroke} strokeWidth="1" strokeLinecap="round">
        <path d="M60 260 C 200 80, 360 80, 480 170" strokeDasharray="2 7" />
        <path d="M480 170 C 560 230, 650 220, 740 90" strokeDasharray="2 7" />
        <path d="M120 320 C 280 220, 420 300, 600 250" />
        <path d="M600 250 C 660 230, 700 270, 760 300" strokeDasharray="2 7" />
        <path d="M20 120 C 140 40, 260 40, 340 110" />
      </g>
      <g fill={stroke}>
        <circle cx="60" cy="260" r="4" />
        <circle cx="480" cy="170" r="5" />
        <circle cx="740" cy="90" r="4" />
        <circle cx="120" cy="320" r="3" />
        <circle cx="600" cy="250" r="4" />
        <circle cx="760" cy="300" r="3" />
        <circle cx="20" cy="120" r="3" />
        <circle cx="340" cy="110" r="4" />
      </g>
    </svg>
  );
}
