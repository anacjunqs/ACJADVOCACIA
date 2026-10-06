import { existsSync } from "node:fs";
import { defineConfig } from "@playwright/test";

const port = process.env.E2E_PORT || "3100";
const chromium = process.env.CHROMIUM_PATH || "/opt/pw-browsers/chromium";
const executablePath = existsSync(chromium) ? chromium : undefined;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${port}`,
    launchOptions: { executablePath, args: ["--no-sandbox"] },
    locale: "pt-BR",
  },
  projects: [
    { name: "mobile", use: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } },
    { name: "desktop", use: { viewport: { width: 1280, height: 800 } } },
  ],
  webServer: [
    { command: "node scripts/mock-resend.mjs", port: 4010, reuseExistingServer: true },
    {
      command: "node scripts/e2e-server.mjs",
      port: Number(port),
      timeout: 240_000,
      reuseExistingServer: true,
      env: {
        PORT: port,
        SHOW_SEED_DRAFTS: "true",
        CONTACT_FORM_SECRET: "segredo-e2e",
        RESEND_API_KEY: "re_e2e",
        CONTACT_FROM_EMAIL: "ACJ <contato@exemplo.com.br>",
        CONTACT_TO_EMAIL: "recebe@exemplo.com.br",
        RESEND_BASE_URL: "http://localhost:4010",
        NEXT_PUBLIC_SITE_URL: `http://localhost:${port}`,
      },
    },
  ],
});
