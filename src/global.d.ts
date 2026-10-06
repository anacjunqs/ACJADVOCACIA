import type { AppLocale } from "@/lib/i18n/routing";
import type messages from "../messages/pt.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: AppLocale;
    Messages: typeof messages;
  }
}
