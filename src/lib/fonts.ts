import { Newsreader, Source_Sans_3 } from "next/font/google";

/**
 * Títulos: serifa Newsreader (boa em tela pequena). Corpo: Source Sans 3 (humanista).
 * Só o subconjunto latino (cobre português e inglês) e só os pesos usados: menos bytes, LCP mais rápido.
 */
export const serif = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-newsreader",
  display: "swap",
});

export const sans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});
