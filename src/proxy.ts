import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Ignora API, Studio, arquivos internos e arquivos com extensão (imagens, ícones, etc.)
  matcher: ["/((?!api|studio|_next|_vercel|.*\\..*).*)"],
};
