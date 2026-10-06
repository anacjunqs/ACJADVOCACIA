/** Configuração do Sanity. Sem NEXT_PUBLIC_SANITY_PROJECT_ID o site usa /content/seed. */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
export const isSanityConfigured = Boolean(projectId);
/** Em "production" o Studio bloqueia a publicação de textos com [PREENCHER]/[REVISAR]; nos demais datasets só avisa. */
export const blockPendingOnPublish = dataset === "production";
