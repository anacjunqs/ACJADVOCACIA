/**
 * Catálogo de serviços — fonte única de verdade para Áreas de Atuação e o hub
 * "Famílias entre Países".
 *
 * Regras:
 * - Cada serviço aparece UMA vez. O pilar é derivado do grupo.
 * - `international: true` faz o serviço aparecer também no hub.
 * - Grupos com pillar "hub" contêm serviços exclusivos do hub.
 * - Títulos em inglês: [REVISAR] pela fundadora antes de publicar.
 * - `summary` é opcional; quando ausente, rascunhar e marcar [REVISAR JURIDICAMENTE].
 * - Serviços internacionais tratam dos aspectos do DIREITO BRASILEIRO, em
 *   coordenação com profissionais locais quando necessário.
 */

export type L = { pt: string; en: string };

export type PillarSlug =
  | "planejamento-patrimonial"
  | "casamento-uniao"
  | "divorcio-partilha"
  | "filhos-guarda"
  | "alimentos"
  | "filiacao"
  | "inventario-sucessoes";

export interface Pillar {
  id: PillarSlug;
  path: L; // segmento de URL por idioma
  title: L;
  summary: L; // [REVISAR]
}

export interface Group {
  pillar: PillarSlug | "hub";
  title: L;
}

export interface Service {
  slug: string;
  group: GroupKey;
  title: L;
  international: boolean;
  summary?: L;
}

export const pillars: Pillar[] = [
  {
    id: "planejamento-patrimonial",
    path: { pt: "planejamento-patrimonial-e-sucessorio", en: "estate-and-wealth-planning" },
    title: { pt: "Planejamento Patrimonial e Sucessório", en: "Estate & Wealth Planning" },
    summary: {
      pt: "Organização do patrimônio da família e da sucessão, no Brasil e no exterior.",
      en: "Organizing family wealth and succession, in Brazil and abroad.",
    },
  },
  {
    id: "casamento-uniao",
    path: { pt: "casamento-uniao-estavel-e-registro-civil", en: "marriage-and-civil-registry" },
    title: { pt: "Casamento, União Estável e Registro Civil", en: "Marriage, Civil Unions & Civil Registry" },
    summary: {
      pt: "Pactos, regime de bens, casamentos nacionais e internacionais e regularização documental.",
      en: "Prenups, property regimes, domestic and international marriages, and civil documents.",
    },
  },
  {
    id: "divorcio-partilha",
    path: { pt: "divorcio-e-partilha", en: "divorce-and-property-division" },
    title: { pt: "Divórcio e Partilha", en: "Divorce & Property Division" },
    summary: {
      pt: "Divórcios e dissoluções, inclusive com patrimônio ou partes no exterior.",
      en: "Divorces and dissolutions, including assets or parties abroad.",
    },
  },
  {
    id: "filhos-guarda",
    path: { pt: "filhos-guarda-e-convivencia", en: "children-custody-and-parenting-time" },
    title: { pt: "Filhos, Guarda e Convivência", en: "Children, Custody & Parenting Time" },
    summary: {
      pt: "Guarda, convivência, mudanças de residência e conflitos parentais internacionais.",
      en: "Custody, parenting time, relocation and cross-border parental disputes.",
    },
  },
  {
    id: "alimentos",
    path: { pt: "alimentos", en: "child-and-spousal-support" },
    title: { pt: "Alimentos", en: "Child & Spousal Support" },
    summary: {
      pt: "Fixação, revisão e cobrança de pensão, inclusive entre países.",
      en: "Establishing, modifying and enforcing support, including across borders.",
    },
  },
  {
    id: "filiacao",
    path: { pt: "filiacao", en: "parentage" },
    title: { pt: "Filiação", en: "Parentage" },
    summary: {
      pt: "Reconhecimento, contestação e registro de filiação, no Brasil e no exterior.",
      en: "Establishing, contesting and registering parentage, in Brazil and abroad.",
    },
  },
  {
    id: "inventario-sucessoes",
    path: { pt: "inventario-e-sucessoes", en: "probate-and-inheritance" },
    title: { pt: "Inventário e Sucessões", en: "Probate & Inheritance" },
    summary: {
      pt: "Inventários judiciais, extrajudiciais e internacionais, e conflitos entre herdeiros.",
      en: "Court, out-of-court and cross-border probate, and disputes among heirs.",
    },
  },
];

export const hub = {
  path: { pt: "familias-entre-paises", en: "cross-border-families" },
  title: { pt: "Famílias entre Países", en: "Cross-Border Families" },
  summary: {
    pt: "Direito de Família e Sucessões para quem vive entre o Brasil e outros países.",
    en: "Family and estate law for those whose lives span Brazil and other countries.",
  },
} as const;

export const groups = {
  // Planejamento Patrimonial e Sucessório
  "pp-consultivo": { pillar: "planejamento-patrimonial", title: { pt: "Consultoria familiar estratégica", en: "Strategic family counsel" } },
  "pp-casal": { pillar: "planejamento-patrimonial", title: { pt: "Planejamento do casal", en: "Planning for couples" } },
  "pp-sucessorio": { pillar: "planejamento-patrimonial", title: { pt: "Planejamento sucessório", en: "Succession planning" } },
  "pp-empresarial": { pillar: "planejamento-patrimonial", title: { pt: "Famílias empresárias e holding", en: "Business families & holding companies" } },
  "pp-imoveis": { pillar: "planejamento-patrimonial", title: { pt: "Aquisição e organização de imóveis", en: "Real estate acquisition & structuring" } },
  // Casamento, União Estável e Registro Civil
  "cu-contratos": { pillar: "casamento-uniao", title: { pt: "Pactos, regime de bens e união estável", en: "Agreements, property regimes & stable unions" } },
  "cu-casamento": { pillar: "casamento-uniao", title: { pt: "Casamento nacional e internacional", en: "Domestic & international marriage" } },
  "cu-registro": { pillar: "casamento-uniao", title: { pt: "Registro civil e documentos", en: "Civil registry & documents" } },
  // Divórcio e Partilha
  "dp-divorcio": { pillar: "divorcio-partilha", title: { pt: "Divórcio e dissolução", en: "Divorce & dissolution" } },
  "dp-internacional": { pillar: "divorcio-partilha", title: { pt: "Divórcio internacional", en: "International divorce" } },
  "dp-partilha": { pillar: "divorcio-partilha", title: { pt: "Partilha de bens", en: "Property division" } },
  // Filhos, Guarda e Convivência
  "fg-guarda": { pillar: "filhos-guarda", title: { pt: "Guarda", en: "Custody" } },
  "fg-convivencia": { pillar: "filhos-guarda", title: { pt: "Convivência e residência", en: "Parenting time & residence" } },
  "fg-viagem": { pillar: "filhos-guarda", title: { pt: "Viagens e documentos dos filhos", en: "Children's travel & documents" } },
  "fg-haia": { pillar: "filhos-guarda", title: { pt: "Conflitos internacionais e Convenção da Haia", en: "Cross-border disputes & the Hague Convention" } },
  // Alimentos
  "al-fixacao": { pillar: "alimentos", title: { pt: "Fixação e modalidades", en: "Establishing support" } },
  "al-revisao": { pillar: "alimentos", title: { pt: "Revisão, exoneração e execução", en: "Modification, termination & enforcement" } },
  "al-despesas": { pillar: "alimentos", title: { pt: "Despesas dos filhos", en: "Children's expenses" } },
  "al-internacional": { pillar: "alimentos", title: { pt: "Alimentos internacionais", en: "International support" } },
  // Filiação
  "fi-reconhecimento": { pillar: "filiacao", title: { pt: "Reconhecimento de filiação", en: "Establishing parentage" } },
  "fi-contestacao": { pillar: "filiacao", title: { pt: "Contestação e retificação", en: "Contesting & correcting parentage" } },
  "fi-internacional": { pillar: "filiacao", title: { pt: "Filiação internacional", en: "International parentage" } },
  // Inventário e Sucessões
  "is-inventario": { pillar: "inventario-sucessoes", title: { pt: "Inventário", en: "Probate" } },
  "is-internacional": { pillar: "inventario-sucessoes", title: { pt: "Inventário internacional", en: "Cross-border probate" } },
  "is-atos": { pillar: "inventario-sucessoes", title: { pt: "Atos sucessórios", en: "Inheritance transactions" } },
  "is-litigio": { pillar: "inventario-sucessoes", title: { pt: "Conflitos sucessórios", en: "Inheritance disputes" } },
  // Exclusivos do hub
  "hub-representacao": { pillar: "hub", title: { pt: "Representação e vida civil no Brasil", en: "Representation & civil matters in Brazil" } },
  "hub-cooperacao": { pillar: "hub", title: { pt: "Cooperação jurídica internacional", en: "International legal cooperation" } },
} satisfies Record<string, Group>;

export type GroupKey = keyof typeof groups;

export const services: Service[] = [
  // ───────── Planejamento Patrimonial e Sucessório ─────────
  { slug: "consulta-estrategica-familia", group: "pp-consultivo", international: false, title: { pt: "Consulta jurídica estratégica em Direito de Família", en: "Strategic family law consultation" } },
  { slug: "diagnostico-patrimonial-familiar", group: "pp-consultivo", international: false, title: { pt: "Diagnóstico patrimonial familiar", en: "Family asset assessment" } },
  { slug: "familias-recompostas", group: "pp-consultivo", international: false, title: { pt: "Organização jurídica de famílias recompostas", en: "Legal planning for blended families" } },
  { slug: "filhos-relacionamentos-anteriores", group: "pp-consultivo", international: false, title: { pt: "Planejamento para famílias com filhos de relacionamentos anteriores", en: "Planning for families with children from previous relationships" } },
  { slug: "casais-binacionais", group: "pp-consultivo", international: true, title: { pt: "Consultoria para casais binacionais e interculturais", en: "Counsel for binational and intercultural couples" } },
  { slug: "acordos-familiares-preventivos", group: "pp-consultivo", international: false, title: { pt: "Acordos familiares preventivos", en: "Preventive family agreements" } },

  { slug: "planejamento-matrimonial", group: "pp-casal", international: false, title: { pt: "Planejamento matrimonial", en: "Pre-marital planning" } },
  { slug: "planejamento-patrimonial-casal", group: "pp-casal", international: false, title: { pt: "Planejamento patrimonial do casal", en: "Asset planning for couples" } },
  { slug: "analise-patrimonio-pre-casamento", group: "pp-casal", international: false, title: { pt: "Análise de patrimônio antes do casamento", en: "Pre-marital asset review" } },
  { slug: "casais-patrimonio-brasil-exterior", group: "pp-casal", international: true, title: { pt: "Planejamento para casais com patrimônio no Brasil e no exterior", en: "Planning for couples with assets in Brazil and abroad" } },

  { slug: "planejamento-sucessorio", group: "pp-sucessorio", international: false, title: { pt: "Planejamento sucessório personalizado", en: "Tailored succession planning" } },
  { slug: "estruturacao-patrimonial-familiar", group: "pp-sucessorio", international: false, title: { pt: "Estruturação patrimonial familiar", en: "Family asset structuring" } },
  { slug: "patrimonio-entre-geracoes", group: "pp-sucessorio", international: false, title: { pt: "Organização e proteção do patrimônio entre gerações", en: "Organizing and protecting wealth across generations" } },
  { slug: "testamento", group: "pp-sucessorio", international: false, title: { pt: "Elaboração e revisão de testamento", en: "Drafting and reviewing wills" } },
  { slug: "doacao-em-vida", group: "pp-sucessorio", international: false, title: { pt: "Doação em vida", en: "Lifetime gifts" } },
  { slug: "doacao-reserva-usufruto", group: "pp-sucessorio", international: false, title: { pt: "Doação com reserva de usufruto", en: "Gifts with retained usufruct" } },
  { slug: "adiantamento-legitima", group: "pp-sucessorio", international: false, title: { pt: "Adiantamento de legítima", en: "Advances on forced-heirship shares" } },
  { slug: "patrimonio-multiplos-paises", group: "pp-sucessorio", international: true, title: { pt: "Organização do patrimônio familiar no Brasil e em outros países", en: "Organizing family assets across Brazil and other countries" } },

  { slug: "planejamento-empresarios", group: "pp-empresarial", international: false, title: { pt: "Planejamento para empresários e famílias empresárias", en: "Planning for business owners and business families" } },
  { slug: "holding-familiar", group: "pp-empresarial", international: false, title: { pt: "Holding familiar — estruturação jurídica", en: "Family holding company — legal structuring" } },
  { slug: "sucessao-empresarial", group: "pp-empresarial", international: false, title: { pt: "Planejamento da sucessão empresarial", en: "Business succession planning" } },
  { slug: "acordos-socios-sucessao", group: "pp-empresarial", international: false, title: { pt: "Acordos de sócios voltados à sucessão", en: "Shareholder agreements for succession" } },
  { slug: "doacao-usufruto-quotas", group: "pp-empresarial", international: false, title: { pt: "Doação e usufruto de quotas", en: "Gifts and usufruct of company shares" } },
  { slug: "testamento-estrutura-societaria", group: "pp-empresarial", international: false, title: { pt: "Testamento integrado à estrutura societária", en: "Wills integrated with corporate structures" } },
  { slug: "protocolo-familiar-governanca", group: "pp-empresarial", international: false, title: { pt: "Protocolo familiar e regras de governança", en: "Family protocols and governance rules" } },

  {
    slug: "due-diligence-imovel-estrangeiro",
    group: "pp-imoveis",
    international: true,
    title: { pt: "Due diligence familiar e sucessória na compra de imóvel por estrangeiro", en: "Family and estate due diligence for property purchases by foreign nationals" },
    summary: {
      pt: "[REVISAR JURIDICAMENTE] Análise de riscos ligados ao estado civil, regime de bens, inventários e partilhas envolvendo o imóvel e as partes, antes da assinatura.",
      en: "[REVISAR] Review of risks tied to marital status, property regimes, probate and asset divisions affecting the property and the parties, before signing.",
    },
  },
  { slug: "compra-imovel-casado-exterior", group: "pp-imoveis", international: true, title: { pt: "Compra de imóvel no Brasil por pessoa casada no exterior", en: "Property purchases in Brazil by people married abroad" } },
  { slug: "venda-imovel-residente-exterior", group: "pp-imoveis", international: true, title: { pt: "Venda de imóvel por brasileiro residente no exterior", en: "Property sales by Brazilians living abroad" } },
  { slug: "planejamento-aquisicao-imoveis", group: "pp-imoveis", international: false, title: { pt: "Planejamento jurídico na aquisição de imóveis", en: "Legal planning for property acquisitions" } },
  { slug: "estruturacao-patrimonio-imobiliario", group: "pp-imoveis", international: false, title: { pt: "Estruturação de patrimônio imobiliário", en: "Real estate portfolio structuring" } },
  { slug: "titularidade-imoveis-conjuges", group: "pp-imoveis", international: false, title: { pt: "Análise de titularidade de imóveis entre cônjuges e companheiros", en: "Title review for property held by spouses and partners" } },
  { slug: "regularizacao-imoveis-transmissao", group: "pp-imoveis", international: false, title: { pt: "Regularização de imóveis e documentação para transmissão", en: "Property regularization and transfer documentation" } },

  // ───────── Casamento, União Estável e Registro Civil ─────────
  { slug: "pacto-antenupcial", group: "cu-contratos", international: false, title: { pt: "Pacto antenupcial", en: "Prenuptial agreements" } },
  { slug: "regime-de-bens", group: "cu-contratos", international: false, title: { pt: "Escolha e alteração do regime de bens", en: "Choosing and changing the marital property regime" } },
  { slug: "contrato-convivencia", group: "cu-contratos", international: false, title: { pt: "Contrato de convivência", en: "Cohabitation agreements" } },
  { slug: "contrato-namoro", group: "cu-contratos", international: false, title: { pt: "Contrato de namoro", en: "Dating agreements (contrato de namoro)" } },
  { slug: "reconhecimento-uniao-estavel", group: "cu-contratos", international: false, title: { pt: "Reconhecimento de união estável", en: "Recognition of stable unions (common-law partnerships)" } },

  { slug: "habilitacao-casamento", group: "cu-casamento", international: false, title: { pt: "Habilitação e orientação jurídica para o casamento", en: "Marriage licensing and legal guidance" } },
  { slug: "casamento-brasileiro-estrangeiro", group: "cu-casamento", international: true, title: { pt: "Casamento de brasileiro com estrangeiro", en: "Marriage between a Brazilian and a foreign national" } },
  { slug: "casamento-exterior", group: "cu-casamento", international: true, title: { pt: "Casamento celebrado no exterior", en: "Marriages celebrated abroad" } },
  { slug: "planejamento-casamento-exterior", group: "cu-casamento", international: true, title: { pt: "Planejamento jurídico para brasileiros que vão se casar no exterior", en: "Legal planning for Brazilians marrying abroad" } },
  { slug: "casamento-outras-jurisdicoes", group: "cu-casamento", international: true, title: { pt: "Aspectos do direito brasileiro em casamentos celebrados em outras jurisdições", en: "Brazilian-law aspects of marriages in other jurisdictions" } },

  { slug: "transcricao-documentos-estrangeiros", group: "cu-registro", international: true, title: { pt: "Transcrição de casamento e documentos estrangeiros no Brasil", en: "Registration of foreign marriages and documents in Brazil" } },
  { slug: "validade-documentos-estrangeiros", group: "cu-registro", international: true, title: { pt: "Análise de validade de documentos estrangeiros", en: "Validity review of foreign documents" } },
  { slug: "apostilamento-legalizacao", group: "cu-registro", international: true, title: { pt: "Apostilamento e legalização de documentos", en: "Apostille and document legalization" } },
  { slug: "traducao-juramentada", group: "cu-registro", international: true, title: { pt: "Coordenação de tradução juramentada", en: "Sworn translation coordination" } },
  { slug: "retificacao-registro-civil", group: "cu-registro", international: false, title: { pt: "Retificação de registro civil", en: "Civil registry corrections" } },
  { slug: "alteracao-nome-casamento", group: "cu-registro", international: false, title: { pt: "Alteração de nome após o casamento", en: "Name changes after marriage" } },
  { slug: "regularizacao-documentos-civis", group: "cu-registro", international: false, title: { pt: "Regularização de documentos civis e estado civil", en: "Regularization of civil documents and marital status" } },

  // ───────── Divórcio e Partilha ─────────
  { slug: "divorcio-consensual", group: "dp-divorcio", international: false, title: { pt: "Divórcio consensual", en: "Uncontested divorce" } },
  { slug: "divorcio-litigioso", group: "dp-divorcio", international: false, title: { pt: "Divórcio litigioso", en: "Contested divorce" } },
  { slug: "divorcio-extrajudicial", group: "dp-divorcio", international: false, title: { pt: "Divórcio extrajudicial (em cartório)", en: "Out-of-court divorce (before a notary)" } },
  { slug: "dissolucao-uniao-estavel", group: "dp-divorcio", international: false, title: { pt: "Dissolução de união estável", en: "Dissolution of stable unions" } },
  { slug: "planejamento-pre-divorcio", group: "dp-divorcio", international: false, title: { pt: "Planejamento e negociação pré-divórcio", en: "Pre-divorce planning and negotiation" } },

  { slug: "divorcio-brasileiro-estrangeiro", group: "dp-internacional", international: true, title: { pt: "Divórcio entre brasileiro e estrangeiro", en: "Divorce between a Brazilian and a foreign national" } },
  { slug: "divorcio-patrimonio-exterior", group: "dp-internacional", international: true, title: { pt: "Divórcio com patrimônio no exterior", en: "Divorce involving assets abroad" } },
  { slug: "divorcio-exterior", group: "dp-internacional", international: true, title: { pt: "Divórcio realizado no exterior", en: "Divorces granted abroad" } },
  { slug: "reconhecimento-divorcio-estrangeiro", group: "dp-internacional", international: true, title: { pt: "Reconhecimento de divórcio estrangeiro no Brasil", en: "Recognition of foreign divorces in Brazil" } },

  { slug: "partilha-bens", group: "dp-partilha", international: false, title: { pt: "Partilha de bens", en: "Division of marital property" } },
  { slug: "bens-comuns-particulares", group: "dp-partilha", international: false, title: { pt: "Definição de bens comuns e particulares", en: "Classifying marital and separate property" } },
  { slug: "apuracao-patrimonio", group: "dp-partilha", international: false, title: { pt: "Apuração de patrimônio", en: "Asset tracing and valuation" } },
  { slug: "partilha-empresas", group: "dp-partilha", international: false, title: { pt: "Partilha de empresas e participações societárias", en: "Division of businesses and equity interests" } },
  { slug: "partilha-imoveis", group: "dp-partilha", international: false, title: { pt: "Partilha de imóveis", en: "Division of real estate" } },
  { slug: "regularizacao-imovel-divorcio", group: "dp-partilha", international: false, title: { pt: "Regularização de imóvel após casamento ou divórcio", en: "Property title updates after marriage or divorce" } },
  { slug: "partilha-patrimonio-internacional", group: "dp-partilha", international: true, title: { pt: "Partilha de patrimônio internacional", en: "Division of international assets" } },
  { slug: "sobrepartilha-divorcio", group: "dp-partilha", international: false, title: { pt: "Sobrepartilha de bens do casal", en: "Supplementary division of marital property" } },

  // ───────── Filhos, Guarda e Convivência ─────────
  { slug: "guarda-compartilhada", group: "fg-guarda", international: false, title: { pt: "Guarda compartilhada", en: "Joint custody" } },
  { slug: "guarda-unilateral", group: "fg-guarda", international: false, title: { pt: "Guarda unilateral", en: "Sole custody" } },
  { slug: "modificacao-guarda", group: "fg-guarda", international: false, title: { pt: "Modificação de guarda", en: "Custody modification" } },

  { slug: "regulamentacao-convivencia", group: "fg-convivencia", international: false, title: { pt: "Regulamentação de convivência", en: "Establishing parenting time" } },
  { slug: "modificacao-convivencia", group: "fg-convivencia", international: false, title: { pt: "Modificação do regime de convivência", en: "Modifying parenting time" } },
  { slug: "residencia-filhos", group: "fg-convivencia", international: false, title: { pt: "Fixação de residência dos filhos", en: "Determining the children's residence" } },
  { slug: "mudanca-cidade-estado", group: "fg-convivencia", international: false, title: { pt: "Mudança de cidade ou estado com os filhos", en: "Relocating to another city or state with children" } },
  { slug: "mudanca-pais-filhos", group: "fg-convivencia", international: true, title: { pt: "Mudança de país com os filhos", en: "International relocation with children" } },

  { slug: "autorizacao-viagem-internacional", group: "fg-viagem", international: true, title: { pt: "Autorização para viagem internacional de menores", en: "Authorization for international travel of minors" } },
  { slug: "autorizacao-passaporte", group: "fg-viagem", international: true, title: { pt: "Autorização para emissão de passaporte", en: "Authorization for passport issuance" } },

  { slug: "subtracao-internacional", group: "fg-haia", international: true, title: { pt: "Subtração internacional de crianças — Convenção da Haia de 1980", en: "International child abduction — 1980 Hague Convention" } },
  { slug: "retorno-internacional", group: "fg-haia", international: true, title: { pt: "Retorno internacional de crianças", en: "International return of children" } },
  { slug: "residencia-habitual", group: "fg-haia", international: true, title: { pt: "Definição da residência habitual da criança", en: "Determining a child's habitual residence" } },
  { slug: "guarda-convivencia-internacional", group: "fg-haia", international: true, title: { pt: "Guarda e convivência internacionais", en: "International custody and parenting time" } },
  { slug: "conflitos-parentais-transnacionais", group: "fg-haia", international: true, title: { pt: "Conflitos parentais transnacionais", en: "Cross-border parental disputes" } },
  { slug: "prevencao-familias-dois-paises", group: "fg-haia", international: true, title: { pt: "Orientação preventiva para famílias que vivem entre dois países", en: "Preventive counsel for families living between two countries" } },

  // ───────── Alimentos ─────────
  { slug: "fixacao-pensao", group: "al-fixacao", international: false, title: { pt: "Fixação de pensão alimentícia", en: "Establishing child support" } },
  { slug: "alimentos-provisorios", group: "al-fixacao", international: false, title: { pt: "Alimentos provisórios", en: "Temporary support" } },
  { slug: "alimentos-gravidicos", group: "al-fixacao", international: false, title: { pt: "Alimentos gravídicos", en: "Pregnancy support" } },
  { slug: "alimentos-filhos-maiores", group: "al-fixacao", international: false, title: { pt: "Alimentos para filhos maiores", en: "Support for adult children" } },
  { slug: "alimentos-ex-conjuges", group: "al-fixacao", international: false, title: { pt: "Alimentos entre ex-cônjuges e ex-companheiros", en: "Spousal and former-partner support" } },
  { slug: "acordos-alimentos", group: "al-fixacao", international: false, title: { pt: "Orientação para acordos de alimentos", en: "Support agreements" } },

  { slug: "revisao-alimentos", group: "al-revisao", international: false, title: { pt: "Revisão de alimentos", en: "Support modification" } },
  { slug: "exoneracao-alimentos", group: "al-revisao", international: false, title: { pt: "Exoneração de alimentos", en: "Termination of support" } },
  { slug: "execucao-alimentos", group: "al-revisao", international: false, title: { pt: "Execução de alimentos", en: "Support enforcement" } },

  { slug: "despesas-extraordinarias", group: "al-despesas", international: false, title: { pt: "Despesas extraordinárias", en: "Extraordinary expenses" } },
  { slug: "rateio-despesas-filhos", group: "al-despesas", international: false, title: { pt: "Rateio de despesas dos filhos", en: "Sharing children's expenses" } },
  { slug: "reembolso-despesas", group: "al-despesas", international: false, title: { pt: "Reembolso de despesas", en: "Expense reimbursement" } },

  { slug: "alimentante-exterior", group: "al-internacional", international: true, title: { pt: "Pensão quando quem paga mora no exterior", en: "Support when the paying party lives abroad" } },
  { slug: "alimentando-exterior", group: "al-internacional", international: true, title: { pt: "Pensão quando quem recebe mora no exterior", en: "Support when the receiving party lives abroad" } },
  { slug: "cobranca-internacional-alimentos", group: "al-internacional", international: true, title: { pt: "Cobrança internacional de alimentos", en: "International support collection" } },

  // ───────── Filiação ─────────
  { slug: "investigacao-paternidade", group: "fi-reconhecimento", international: false, title: { pt: "Investigação de paternidade", en: "Paternity actions" } },
  { slug: "investigacao-maternidade", group: "fi-reconhecimento", international: false, title: { pt: "Investigação de maternidade", en: "Maternity actions" } },
  { slug: "reconhecimento-paternidade", group: "fi-reconhecimento", international: false, title: { pt: "Reconhecimento voluntário de paternidade", en: "Voluntary acknowledgment of paternity" } },
  { slug: "filiacao-socioafetiva", group: "fi-reconhecimento", international: false, title: { pt: "Reconhecimento de filiação socioafetiva", en: "Recognition of socio-affective parentage" } },
  { slug: "multiparentalidade", group: "fi-reconhecimento", international: false, title: { pt: "Multiparentalidade", en: "Multiple parentage" } },

  { slug: "negatoria-paternidade", group: "fi-contestacao", international: false, title: { pt: "Negatória de paternidade", en: "Actions to disprove paternity" } },
  { slug: "anulacao-registro-nascimento", group: "fi-contestacao", international: false, title: { pt: "Anulação e retificação de registro de nascimento", en: "Annulment and correction of birth records" } },

  { slug: "nascimento-exterior", group: "fi-internacional", international: true, title: { pt: "Registro de nascimento ocorrido no exterior", en: "Registration of births abroad" } },
  { slug: "filiacao-estrangeira", group: "fi-internacional", international: true, title: { pt: "Reconhecimento de filiação estabelecida no exterior", en: "Recognition of parentage established abroad" } },
  { slug: "filiacao-familias-binacionais", group: "fi-internacional", international: true, title: { pt: "Questões de filiação em famílias binacionais", en: "Parentage in binational families" } },
  { slug: "reproducao-assistida-internacional", group: "fi-internacional", international: true, title: { pt: "Planejamento jurídico para reprodução assistida internacional", en: "Legal planning for international assisted reproduction" } },

  // ───────── Inventário e Sucessões ─────────
  { slug: "inventario-judicial", group: "is-inventario", international: false, title: { pt: "Inventário judicial", en: "Court-supervised probate" } },
  { slug: "inventario-extrajudicial", group: "is-inventario", international: false, title: { pt: "Inventário extrajudicial (em cartório)", en: "Out-of-court probate (before a notary)" } },
  { slug: "inventario-patrimonio-elevado", group: "is-inventario", international: false, title: { pt: "Inventário com patrimônio elevado", en: "Probate of high-value estates" } },
  { slug: "dividas-espolio", group: "is-inventario", international: false, title: { pt: "Análise de dívidas do espólio", en: "Review of estate debts" } },
  { slug: "colacao", group: "is-inventario", international: false, title: { pt: "Colação", en: "Collation of lifetime gifts" } },
  { slug: "sobrepartilha-heranca", group: "is-inventario", international: false, title: { pt: "Sobrepartilha de bens da herança", en: "Supplementary division of estate assets" } },

  { slug: "inventario-herdeiros-exterior", group: "is-internacional", international: true, title: { pt: "Inventário com herdeiros no exterior ou estrangeiros", en: "Probate with heirs abroad or foreign heirs" } },
  { slug: "inventario-bens-exterior", group: "is-internacional", international: true, title: { pt: "Inventário com bens no exterior", en: "Probate involving assets abroad" } },
  { slug: "falecido-exterior", group: "is-internacional", international: true, title: { pt: "Inventário de brasileiro falecido no exterior", en: "Probate for Brazilians who died abroad" } },
  { slug: "heranca-exterior-brasileiro", group: "is-internacional", international: true, title: { pt: "Herança no exterior recebida por brasileiro", en: "Inheritances abroad received by Brazilians" } },

  { slug: "alvaras-judiciais", group: "is-atos", international: false, title: { pt: "Alvarás judiciais", en: "Court authorizations (alvarás)" } },
  { slug: "imoveis-espolio", group: "is-atos", international: false, title: { pt: "Venda e regularização de imóveis do espólio", en: "Sale and regularization of estate property" } },
  { slug: "renuncia-heranca", group: "is-atos", international: false, title: { pt: "Renúncia à herança", en: "Renunciation of inheritance" } },
  { slug: "cessao-direitos-hereditarios", group: "is-atos", international: false, title: { pt: "Cessão de direitos hereditários", en: "Assignment of inheritance rights" } },
  { slug: "heranca-jacente-vacante", group: "is-atos", international: false, title: { pt: "Herança jacente e vacante", en: "Unclaimed estates" } },

  { slug: "litigios-herdeiros", group: "is-litigio", international: false, title: { pt: "Litígios entre herdeiros", en: "Disputes among heirs" } },
  { slug: "mediacao-sucessoria", group: "is-litigio", international: false, title: { pt: "Mediação de conflitos sucessórios", en: "Mediation of inheritance disputes" } },
  { slug: "exclusao-herdeiro", group: "is-litigio", international: false, title: { pt: "Exclusão de herdeiro por indignidade e deserdação", en: "Exclusion of heirs for unworthiness and disinheritance" } },
  { slug: "sonegados", group: "is-litigio", international: false, title: { pt: "Ação de sonegados", en: "Actions for concealed estate assets" } },

  // ───────── Exclusivos do hub "Famílias entre Países" ─────────
  { slug: "consultoria-brasileiros-exterior", group: "hub-representacao", international: true, title: { pt: "Consultoria jurídica para brasileiros residentes no exterior", en: "Legal counsel for Brazilians living abroad" } },
  { slug: "regularizacao-vida-civil", group: "hub-representacao", international: true, title: { pt: "Regularização da vida civil no Brasil", en: "Regularizing civil records in Brazil" } },
  { slug: "bens-brasil-residentes-exterior", group: "hub-representacao", international: true, title: { pt: "Questões jurídicas de bens no Brasil de quem vive no exterior", en: "Legal matters for Brazilian assets of people living abroad" } },
  { slug: "procuracoes", group: "hub-representacao", international: true, title: { pt: "Procurações para atos de família e sucessões", en: "Powers of attorney for family and estate matters" } },
  { slug: "representacao-brasil", group: "hub-representacao", international: true, title: { pt: "Representação jurídica no Brasil", en: "Legal representation in Brazil" } },

  { slug: "homologacao-decisoes-estrangeiras", group: "hub-cooperacao", international: true, title: { pt: "Homologação e execução de decisões estrangeiras (STJ)", en: "Recognition and enforcement of foreign judgments (STJ)" } },
  { slug: "cooperacao-juridica-internacional", group: "hub-cooperacao", international: true, title: { pt: "Cooperação jurídica internacional", en: "International legal cooperation" } },
  { slug: "cartas-rogatorias", group: "hub-cooperacao", international: true, title: { pt: "Cartas rogatórias", en: "Letters rogatory" } },
  { slug: "citacao-exterior", group: "hub-cooperacao", international: true, title: { pt: "Citação de partes no exterior", en: "Service of process abroad" } },
  { slug: "documentos-processos-internacionais", group: "hub-cooperacao", international: true, title: { pt: "Produção de documentos para processos internacionais", en: "Document preparation for international proceedings" } },
  { slug: "coordenacao-brasil-exterior", group: "hub-cooperacao", international: true, title: { pt: "Coordenação jurídica Brasil–exterior", en: "Brazil–abroad legal coordination" } },
];

// ───────── Helpers ─────────

export const pillarOf = (s: Service) => groups[s.group].pillar;

/** Serviços de um pilar, agrupados na ordem definida em `groups`. */
export function servicesByPillar(pillar: PillarSlug) {
  return (Object.keys(groups) as GroupKey[])
    .filter((g) => groups[g].pillar === pillar)
    .map((g) => ({ key: g, title: groups[g].title, services: services.filter((s) => s.group === g) }));
}

/** Tudo que aparece no hub: internacionais dos pilares + exclusivos do hub. */
export function hubServices() {
  const fromPillars = pillars
    .map((p) => ({ pillar: p, services: services.filter((s) => s.international && pillarOf(s) === p.id) }))
    .filter((x) => x.services.length > 0);
  const exclusive = (Object.keys(groups) as GroupKey[])
    .filter((g) => groups[g].pillar === "hub")
    .map((g) => ({ key: g, title: groups[g].title, services: services.filter((s) => s.group === g) }));
  return { fromPillars, exclusive };
}
