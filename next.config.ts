import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/request.ts");

const isProd = process.env.NODE_ENV === "production";

/**
 * Content-Security-Policy do site público.
 * - Scripts: o Next injeta scripts inline na página; evitamos nonce (obrigaria renderização dinâmica e
 *   perderíamos o cache estático). Por isso `'unsafe-inline'` em script-src, sem `'unsafe-eval'`.
 * - Terceiros só entram pelo consentimento na aplicação: YouTube (nocookie), Vimeo, Google Maps e estatísticas.
 * - Sanity: imagens (cdn.sanity.io) e, apenas na pré-visualização, conexões com a API.
 */
const siteCsp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://plausible.io https://www.googletagmanager.com${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://www.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self' data:",
  "connect-src 'self' https://plausible.io https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://*.api.sanity.io https://*.apicdn.sanity.io wss://*.api.sanity.io",
  "frame-src 'self' https://www.youtube-nocookie.com https://player.vimeo.com https://www.google.com/maps/",
  "media-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

/** O Studio do Sanity é uma aplicação própria e precisa de uma política mais aberta (só nesta rota). */
const studioCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
  "style-src 'self' 'unsafe-inline' https:",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https:",
  "connect-src 'self' https://*.sanity.io wss://*.sanity.io https://*.sanity.studio",
  "frame-src 'self' https://*.sanity.io",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://*.sanity.io",
  "frame-ancestors 'self'",
].join("; ");

const common = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // SAMEORIGIN (e não DENY): o Studio mostra o site em um quadro para a pré-visualização.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Fontes TTF lidas do disco pela imagem Open Graph precisam ir junto no deploy.
  outputFileTracingIncludes: { "/**/*": ["./assets/fonts/*.ttf"] },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "i.vimeocdn.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/((?!studio).*)",
        headers: [...common, ...(isProd ? [{ key: "Content-Security-Policy", value: siteCsp }] : [])],
      },
      {
        source: "/studio/:path*",
        headers: [...common, ...(isProd ? [{ key: "Content-Security-Policy", value: studioCsp }] : [])],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
