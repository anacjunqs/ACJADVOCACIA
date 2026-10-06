"use client";

import Script from "next/script";
import { useConsent } from "./consent-provider";

/** Carrega a ferramenta de estatísticas SOMENTE depois do consentimento. Sem variáveis configuradas, não faz nada. */
export function Analytics() {
  const { consent } = useConsent();
  if (!consent?.analytics) return null;

  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER;
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const ga4 = process.env.NEXT_PUBLIC_GA4_ID;

  if (provider === "plausible" && plausibleDomain) {
    return <Script defer data-domain={plausibleDomain} src="https://plausible.io/js/script.js" strategy="afterInteractive" />;
  }
  if (provider === "ga4" && ga4 && /^G-[A-Z0-9]+$/.test(ga4)) {
    return (
      <>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`} strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${ga4}',{anonymize_ip:true});`}
        </Script>
      </>
    );
  }
  return null;
}
