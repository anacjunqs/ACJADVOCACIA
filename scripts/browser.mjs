import { existsSync } from "node:fs";

/**
 * Opções de lançamento do Chromium. Em ambientes com navegador pré-instalado (ex.: /opt/pw-browsers/chromium),
 * usamos esse executável em vez de baixar outro. Pode ser sobrescrito com CHROMIUM_PATH.
 */
const candidate = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium";
export const launchOptions = existsSync(candidate) ? { executablePath: candidate, args: ["--no-sandbox"] } : {};
