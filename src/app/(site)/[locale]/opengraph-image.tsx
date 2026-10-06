import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getFounder, getSettings } from "@/lib/content";
import { pick } from "@/lib/i18n/localize";
import { isLocale } from "@/lib/i18n/routing";

/** Imagem padrão de compartilhamento (Open Graph), gerada com as cores da marca. */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "ACJ Advocacia";

/** Lê a fonte do disco (os arquivos entram no pacote pelo outputFileTracingIncludes do next.config). */
const font = async (file: string): Promise<ArrayBuffer> => new Uint8Array(await readFile(join(process.cwd(), "assets", "fonts", file))).buffer;

const NAVY = "#093247";
const GOLD = "#EBC894";
const NAVY_100 = "#E6EBED";

export default async function OpenGraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "pt";
  const [settings, founder, serif, sans] = await Promise.all([
    getSettings(),
    getFounder(),
    font("Newsreader-Medium.ttf"),
    font("SourceSans3-SemiBold.ttf"),
  ]);
  const name = pick(settings.siteName, locale).text;
  const tagline = pick(settings.footerText, locale).text;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: NAVY, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, position: "relative" }}>
        <svg width="1200" height="630" viewBox="0 0 800 420" style={{ position: "absolute", top: 0, left: 0, opacity: 0.35 }}>
          <g stroke={GOLD} strokeWidth="1.2" fill="none">
            <path d="M60 330 C 200 120, 380 100, 520 220" strokeDasharray="2 7" />
            <path d="M520 220 C 600 290, 690 270, 770 120" strokeDasharray="2 7" />
            <path d="M120 400 C 300 290, 450 380, 640 320" />
          </g>
          <g fill={GOLD}>
            <circle cx="60" cy="330" r="4" />
            <circle cx="520" cy="220" r="5" />
            <circle cx="770" cy="120" r="4" />
            <circle cx="640" cy="320" r="4" />
          </g>
        </svg>
        <div style={{ width: 72, height: 3, background: GOLD, display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "Newsreader", fontSize: 108, color: "#ffffff", lineHeight: 1.05 }}>{name}</div>
          <div style={{ fontFamily: "Newsreader", fontSize: 40, color: NAVY_100, marginTop: 24, lineHeight: 1.25, maxWidth: 900 }}>{tagline}</div>
        </div>
        <div style={{ fontFamily: "Source Sans 3", fontSize: 30, color: NAVY_100, display: "flex" }}>
          {founder.name} · OAB/{founder.oab.uf} {founder.oab.number}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Newsreader", data: serif, style: "normal", weight: 500 },
        { name: "Source Sans 3", data: sans, style: "normal", weight: 600 },
      ],
    },
  );
}
