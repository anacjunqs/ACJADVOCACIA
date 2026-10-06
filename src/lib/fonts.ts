import { Newsreader, Source_Sans_3 } from "next/font/google";

/** Títulos: serifa Newsreader (eixo óptico, boa em tela pequena). Corpo: Source Sans 3 (humanista). */
export const serif = Newsreader({
  subsets: ["latin", "latin-ext"],
  variable: "--font-newsreader",
  display: "swap",
  style: ["normal", "italic"],
});

export const sans = Source_Sans_3({
  subsets: ["latin", "latin-ext"],
  variable: "--font-source-sans",
  display: "swap",
});
