import { settingsSeed } from "../../content/seed/settings.ts";
import { founderSeed } from "../../content/seed/founder.ts";
import { pageTextsSeed } from "../../content/seed/pages.ts";
import { pillarContentSeed } from "../../content/seed/pillars.ts";
import { valuesSeed } from "../../content/seed/values.ts";
import { legalSeed } from "../../content/seed/legal.ts";
import { articlesSeed, videosSeed } from "../../content/seed/articles.ts";
import { hub, pillars, services } from "../../content/services.ts";
import { collectStrings } from "../../src/lib/forbidden-words.ts";
import { PENDING_SOURCE } from "../../src/lib/pending.ts";

/**
 * Auditoria de pendências: lista, por página, todo [PREENCHER] e [REVISAR JURIDICAMENTE] que ainda existe,
 * além de campos obrigatórios vazios. Usada pelo relatório (PENDENCIAS.md) e pela trava de lançamento.
 */
export type Finding = {
  page: string;
  where: string;
  kind: "PREENCHER" | "REVISAR" | "VAZIO";
  /** O marcador encontrado (ou a descrição do campo vazio). */
  text: string;
  /** Início do texto em que o marcador está, para saber a que ele se refere. */
  excerpt?: string;
};
export type Notice = { page: string; text: string };

const ALL = "Todas as páginas (rodapé)";
const HOME = "Início";
const AREAS = "Áreas de Atuação (índice)";
const HUB = hub.title.pt;
const ABOUT = "Sobre a Fundadora";
const VALUES = "Nossos Valores";
const ARTICLES = "Artigos e Vídeos";
const CONTACT = "Contato";
const TESTIMONIALS = "Depoimentos";
const LEGAL: Record<string, string> = { privacy: "Política de Privacidade", terms: "Termos de Uso", cookies: "Cookies" };
const pillarPage = (id: string) => (id === "hub" ? HUB : `Área: ${pillars.find((p) => p.id === id)?.title.pt ?? id}`);

const SKIP = /(^|\.)(_type|_key|style|id|slug|icon|url|path|group|pillar|language|provider\w*|publishedAt|international|key|level|listItem|markDefs|marks)(\.|\[|$)/;

/** Procura marcadores em qualquer estrutura e devolve achados já associados à página. */
export function scan(page: string, where: string, data: unknown): Finding[] {
  const re = new RegExp(PENDING_SOURCE, "g");
  return collectStrings(data)
    .filter((s) => !SKIP.test(s.path))
    .flatMap((s) =>
      [...s.text.matchAll(re)].map((m) => ({
        page,
        where: `${where}${s.path ? ` › ${s.path}` : ""}`,
        kind: (m[0].startsWith("[PREENCHER") ? "PREENCHER" : "REVISAR") as Finding["kind"],
        text: m[0],
        excerpt: s.text.replace(re, "").replace(/\s{2,}/g, " ").trim().slice(0, 90),
      })),
    );
}

const empty = (page: string, where: string, text: string): Finding => ({ page, where, kind: "VAZIO", text });

/** Dados de contato e de identidade exigidos para o lançamento. */
function requiredFields(s: { email?: unknown; whatsapp?: unknown; address?: unknown; hours?: unknown; timezone?: unknown }, f: { photo?: unknown; bio?: unknown }): Finding[] {
  const out: Finding[] = [];
  const need = (v: unknown, where: string, text: string, page = CONTACT) => {
    if (!v) out.push(empty(page, where, text));
  };
  need(s.email, "Configurações › E-mail de contato", "E-mail público não preenchido (aparece no Contato e no rodapé)");
  need(s.whatsapp, "Configurações › WhatsApp", "Número de WhatsApp não preenchido (botões de WhatsApp ficam ocultos)");
  need(s.address, "Configurações › Endereço", "Endereço não preenchido");
  need(s.hours, "Configurações › Horário de atendimento", "Horário (com fuso) não preenchido");
  need(s.timezone, "Configurações › Fuso horário", "Fuso horário não preenchido");
  need(f.photo, "Sobre a Fundadora › Foto", "Foto da fundadora não enviada", ABOUT);
  need(f.bio, "Sobre a Fundadora › Biografia", "Biografia não preenchida", ABOUT);
  return out;
}

/** Itens que exigem conferência humana mas não dá para limpar com um marcador. Não bloqueiam o lançamento. */
export function notices(): Notice[] {
  const elevated = services.find((s) => s.slug === "inventario-patrimonio-elevado");
  return [
    { page: AREAS, text: "Títulos em inglês dos 138 serviços (content/services.ts): revisar com a fundadora antes de publicar, como indica o próprio arquivo." },
    ...(elevated ? [{ page: pillarPage("inventario-sucessoes"), text: `Serviço "${elevated.title.pt}": o termo "patrimônio elevado" destoa do tom pedido (sem ostentação). Considere trocar o título em content/services.ts.` }] : []),
    { page: ALL, text: "Logotipo: ainda é o nome em tipografia. Envie o SVG em Configurações do escritório quando existir." },
    { page: ALL, text: "Redes sociais: nenhuma cadastrada. Adicione em Configurações do escritório, se houver." },
    { page: TESTIMONIALS, text: "Depoimentos (avaliações do Google) ficam desligados até a confirmação escrita da advogada e a validação com a OAB." },
    { page: CONTACT, text: "Antes do lançamento, enviar uma mensagem de teste pelo formulário em um deploy de preview (Resend e domínio verificados)." },
  ];
}

/** Auditoria do conteúdo de exemplo (/content/seed), usada quando o CMS não está configurado. */
export function auditSeed(): Finding[] {
  const out: Finding[] = [];
  const s = settingsSeed;
  out.push(
    ...scan(ALL, "Configurações › Aviso OAB", s.oabNotice),
    ...scan(ALL, "Configurações › Texto do rodapé", s.footerText),
    ...scan(`${HUB}; Áreas (atuação internacional); ${LEGAL.privacy}; ${LEGAL.terms}`, "Configurações › Aviso de jurisdição", s.jurisdictionNotice),
    ...scan(HOME, "Configurações › Etapas do atendimento", s.processSteps),
    ...scan(CONTACT, "Configurações › Videoconferência", s.videoconference),
    ...scan(HOME, "Configurações › Mensagem do WhatsApp", s.whatsappMessage),
    ...requiredFields(s, founderSeed),
    ...scan(ABOUT, "Sobre a Fundadora", { ...founderSeed, photo: undefined }),
    ...scan(HOME, "Textos das páginas › Início", pageTextsSeed.home),
    ...scan(AREAS, "Textos das páginas › Áreas", pageTextsSeed.areasIndex),
    ...scan(VALUES, "Textos das páginas › Valores", pageTextsSeed.values),
    ...scan(ARTICLES, "Textos das páginas › Artigos", pageTextsSeed.articles),
    ...scan(ARTICLES, "Textos das páginas › Vídeos", pageTextsSeed.videos),
    ...scan(CONTACT, "Textos das páginas › Contato", pageTextsSeed.contact),
    ...scan(TESTIMONIALS, "Textos das páginas › Depoimentos", pageTextsSeed.testimonials),
    ...scan(`${VALUES}; ${HOME}`, "Nossos Valores (exemplos)", valuesSeed),
  );
  for (const p of pillarContentSeed) out.push(...scan(pillarPage(p.id), "Conteúdo da área", p));
  for (const l of legalSeed) out.push(...scan(LEGAL[l.id] ?? l.id, "Texto da página", l));
  out.push(...scan(ARTICLES, "Artigos de exemplo (rascunho)", articlesSeed.map((a) => ({ title: a.title, excerpt: a.excerpt, body: a.body, language: a.language }))));
  out.push(...scan(ARTICLES, "Vídeo de exemplo (rascunho)", videosSeed.map((v) => ({ title: v.title, description: v.description }))));
  out.push(...scan(`${AREAS}; ${pillarPage("alimentos")}`, "content/services.ts › summary", services.map((x) => x.summary).filter(Boolean)));
  return out;
}

type RawDoc = Record<string, unknown> & { _id: string; _type: string };

/** Auditoria do conteúdo publicado no Sanity (leitura pública do dataset). Tipos sem documento caem no seed. */
export async function auditLive(env: Record<string, string | undefined> = process.env): Promise<Finding[]> {
  const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const version = env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";
  if (!projectId) return auditSeed();

  const query = '*[_type in ["siteSettings","founder","valuesList","pageTexts","pillarContent","legalPage","article","video"] && !(_id in path("drafts.**"))]';
  const res = await fetch(`https://${projectId}.apicdn.sanity.io/v${version}/data/query/${dataset}?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`Não foi possível ler o Sanity (${res.status}) para a auditoria.`);
  const docs = ((await res.json()) as { result: RawDoc[] }).result;
  const byType = (t: string) => docs.filter((d) => d._type === t);
  const out: Finding[] = [];

  const settings = byType("siteSettings")[0];
  const founder = byType("founder")[0];
  if (settings) {
    out.push(
      ...scan(ALL, "Configurações", { oabNotice: settings.oabNotice, footerText: settings.footerText }),
      ...scan(`${HUB}; Áreas (atuação internacional); ${LEGAL.privacy}; ${LEGAL.terms}`, "Configurações › Aviso de jurisdição", settings.jurisdictionNotice),
      ...scan(HOME, "Configurações › Etapas do atendimento", settings.processSteps),
      ...scan(CONTACT, "Configurações › Contato", { videoconference: settings.videoconference, address: settings.address, hours: settings.hours }),
    );
  } else out.push(...auditSeed().filter((f) => f.where.startsWith("Configurações")));
  out.push(...requiredFields((settings ?? {}) as never, (founder ?? {}) as never));
  out.push(...(founder ? scan(ABOUT, "Sobre a Fundadora", { ...founder, photo: undefined }) : scan(ABOUT, "Sobre a Fundadora", founderSeed)));

  const pageTexts = byType("pageTexts")[0];
  out.push(...(pageTexts ? scan(HOME, "Textos das páginas", pageTexts) : scan(HOME, "Textos das páginas (exemplo)", pageTextsSeed)));
  const values = byType("valuesList")[0];
  out.push(...(values ? scan(VALUES, "Nossos Valores", values) : scan(VALUES, "Nossos Valores (exemplos)", valuesSeed)));

  for (const seed of pillarContentSeed) {
    const doc = byType("pillarContent").find((d) => d.pillarId === seed.id);
    out.push(...scan(pillarPage(seed.id), "Conteúdo da área", doc ?? seed));
  }
  for (const seed of legalSeed) {
    const doc = byType("legalPage").find((d) => d.pageId === seed.id);
    out.push(...scan(LEGAL[seed.id] ?? seed.id, "Texto da página", doc ?? seed));
  }
  for (const a of byType("article")) out.push(...scan(ARTICLES, `Artigo "${String(a.title)}"`, { title: a.title, excerpt: a.excerpt, body: a.body }));
  for (const v of byType("video")) out.push(...scan(ARTICLES, `Vídeo "${String(v.title)}"`, { title: v.title, description: v.description }));
  out.push(...scan(`${AREAS}; ${pillarPage("alimentos")}`, "content/services.ts › summary", services.map((x) => x.summary).filter(Boolean)));
  return out;
}

const LABELS: Record<string, string> = {
  intro: "Introdução",
  whoFor: "Para quem é",
  whenToSeek: "Quando procurar",
  internationalIntro: "Introdução da atuação internacional",
  summary: "Resumo",
  approach: "Abordagem de trabalho",
  title: "Título",
  description: "Descrição",
  excerpt: "Resumo",
  body: "Texto",
  heroTitle: "Título principal",
  heroSubtitle: "Subtítulo",
  hubText: "Destaque do hub",
  finalCtaTitle: "Chamada final (título)",
  finalCtaText: "Chamada final (texto)",
};

/** Torna o caminho técnico legível e junta PT/EN em uma linha só. */
function humanize(where: string): { label: string; lang?: string } {
  const lang = /\.(pt|en)$/.exec(where)?.[1];
  const base = where.replace(/\.(pt|en)$/, "");
  const label = base
    .replace(/faq\[(\d+)\]\.answer/g, (_, n) => `Pergunta ${Number(n) + 1}, resposta`)
    .replace(/faq\[(\d+)\]\.question/g, (_, n) => `Pergunta ${Number(n) + 1}`)
    .replace(/\[(\d+)\]/g, (_, n) => ` ${Number(n) + 1}`)
    .replace(/\b([A-Za-z]+)\b/g, (w) => LABELS[w] ?? w);
  return { label, lang: lang?.toUpperCase() };
}

export function renderMarkdown(findings: Finding[], list: Notice[], source: string): string {
  const byPage = new Map<string, Finding[]>();
  for (const f of findings) byPage.set(f.page, [...(byPage.get(f.page) ?? []), f]);
  const count = (k: Finding["kind"]) => findings.filter((f) => f.kind === k).length;
  const lines: string[] = [
    "# Pendências antes do lançamento",
    "",
    `Gerado por \`npm run audit:content\` (fonte: ${source}). Cada item abaixo precisa ser resolvido no CMS (ou em \`/content/seed\`, se o CMS ainda não estiver em uso).`,
    "",
    `- **[PREENCHER]**: ${count("PREENCHER")} (dado que a fundadora precisa informar)`,
    `- **[REVISAR JURIDICAMENTE]**: ${count("REVISAR")} (texto rascunhado que a advogada precisa revisar; depois de revisar, apague o marcador). Cada texto conta uma vez por idioma.`,
    `- **Campos obrigatórios vazios**: ${count("VAZIO")}`,
    "",
    "O site só aceita ser indexado (`NEXT_PUBLIC_SITE_INDEXABLE=true`) quando esta lista estiver vazia.",
    "",
  ];
  for (const [page, items] of [...byPage.entries()].sort((a, b) => a[0].localeCompare(b[0], "pt"))) {
    const n = (k: Finding["kind"]) => items.filter((i) => i.kind === k).length;
    lines.push(`## ${page}`, "", `${n("PREENCHER")} a preencher · ${n("REVISAR")} a revisar · ${n("VAZIO")} vazios`, "");
    // Junta PT e EN do mesmo campo em uma linha.
    const rows = new Map<string, { f: Finding; langs: string[]; label: string }>();
    for (const f of items) {
      const h = humanize(f.where);
      const key = `${h.label}|${f.kind}|${f.kind === "PREENCHER" ? f.text : ""}`;
      const row = rows.get(key) ?? { f, langs: [], label: h.label };
      if (h.lang && !row.langs.includes(h.lang)) row.langs.push(h.lang);
      rows.set(key, row);
    }
    for (const { f, langs, label } of rows.values()) {
      const langTag = langs.length > 0 ? ` (${langs.join("/")})` : "";
      if (f.kind === "VAZIO") lines.push(`- **VAZIO** ${label} — ${f.text}`);
      else if (f.kind === "PREENCHER") lines.push(`- **PREENCHER** ${label}${langTag} — \`${f.text}\``);
      else lines.push(`- **REVISAR** ${label}${langTag}${f.excerpt ? ` — “${f.excerpt}…”` : ""}`);
    }
    lines.push("");
  }
  lines.push("## Conferências manuais (não bloqueiam o lançamento)", "");
  for (const n of list) lines.push(`- **${n.page}**: ${n.text}`);
  lines.push("");
  return lines.join("\n");
}
