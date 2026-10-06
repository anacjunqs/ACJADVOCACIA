import type { ValueItem } from "../../src/lib/content/types.ts";
import { draft } from "./helpers.ts";

/**
 * Valores de exemplo (placeholder). A advogada define os valores reais no CMS ("Nossos Valores").
 * São de 4 a 8 itens; a ordem é a do array.
 */
export const valuesSeed: ValueItem[] = [
  {
    title: { pt: "Clareza", en: "Clarity" },
    description: draft(
      "Explicamos cada passo em linguagem simples, sem juridiquês, para você decidir com segurança.",
      "We explain each step in plain language, without legal jargon, so you can decide with confidence.",
    ),
    icon: "message-circle",
  },
  {
    title: { pt: "Acolhimento", en: "Care" },
    description: draft(
      "Cada família chega com uma história. Ouvimos com atenção e respeito antes de qualquer orientação.",
      "Every family arrives with a story. We listen with attention and respect before offering any guidance.",
    ),
    icon: "heart",
  },
  {
    title: { pt: "Sigilo", en: "Confidentiality" },
    description: draft(
      "O que você conta é tratado com reserva e responsabilidade profissional.",
      "What you share is treated with discretion and professional responsibility.",
    ),
    icon: "lock",
  },
  {
    title: { pt: "Visão entre países", en: "A cross-border view" },
    description: draft(
      "Entendemos a rotina de quem vive entre o Brasil e outros países e cuidamos dos detalhes que isso exige.",
      "We understand the daily life of those who live between Brazil and other countries and handle the details this requires.",
    ),
    icon: "globe",
  },
];
