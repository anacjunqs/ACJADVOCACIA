"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../../sanity.config";

/** O Studio roda só no navegador; a configuração é importada aqui (e não no componente de servidor). */
export default function StudioClient() {
  return <NextStudio config={config} />;
}
