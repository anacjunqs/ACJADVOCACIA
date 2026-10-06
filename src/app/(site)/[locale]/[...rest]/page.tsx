import { notFound } from "next/navigation";

/** Captura qualquer rota desconhecida dentro do idioma para exibir o 404 localizado. */
export default function CatchAll() {
  notFound();
}
