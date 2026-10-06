// Sobe o site em modo produção para os testes e2e. Compila se ainda não houver build (ou se E2E_REBUILD=1).
import { existsSync } from "node:fs";
import { spawn, spawnSync } from "node:child_process";

const port = process.env.E2E_PORT || "3100";
if (process.env.E2E_REBUILD === "1" || !existsSync(".next/BUILD_ID")) {
  const b = spawnSync("npm", ["run", "build"], { stdio: "inherit", env: process.env });
  if (b.status !== 0) process.exit(b.status ?? 1);
}
const child = spawn("npx", ["next", "start", "-p", port], { stdio: "inherit", env: process.env });
child.on("exit", (code) => process.exit(code ?? 0));
process.on("SIGTERM", () => child.kill("SIGTERM"));
process.on("SIGINT", () => child.kill("SIGINT"));
