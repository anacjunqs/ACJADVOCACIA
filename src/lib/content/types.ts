import type { PillarSlug } from "@content/services";
import type { ValueIconName } from "@/components/ui/icon";

export type Locale = "pt" | "en";

/** Texto bilíngue. `en` pode estar vazio no CMS; nesse caso mostramos o PT marcado com lang="pt". */
export type LS = { pt: string; en?: string };

/** Rich text no formato Portable Text (mesmo formato no seed e no Sanity). */
export type RichBlock = { _type: string; _key?: string; [key: string]: unknown };
export type LRich = { pt: RichBlock[]; en?: RichBlock[] };

export type ImageRef = {
  /** URL final (seed local em /public ou CDN do Sanity). */
  src: string;
  alt: LS;
  width: number;
  height: number;
  /** Referência do asset no Sanity (para loader/crop). Ausente em imagens locais. */
  sanityRef?: string;
};

export type SiteSettings = {
  siteName: LS;
  logo?: ImageRef;
  /** E-mail público de exibição (o de recebimento do formulário fica em variável de ambiente). */
  email?: string;
  phone?: string;
  /** Somente dígitos, com DDI. Ex.: 5562900000000 */
  whatsapp?: string;
  whatsappMessage: LS;
  address?: { text: LS; mapQuery?: string };
  hours?: LS;
  timezone?: string;
  videoconference?: LS;
  social: { label: string; url: string }[];
  googlePlaceId?: string;
  processSteps: { title: LS; text: LS }[];
  footerText: LS;
  oabNotice: LS;
  jurisdictionNotice: LS;
  seo: { description: LS };
};

export type Founder = {
  name: string;
  oab: { number: string; uf: string };
  photo?: ImageRef;
  summary: LS;
  bio?: LRich;
  timeline: { year: string; title: LS; description?: LS }[];
  education: { title: LS; detail?: LS }[];
  languages: { name: LS }[];
  associations: { name: LS }[];
  approach?: LS;
  quote?: { text: LS; attribution?: LS };
  cta: { title: LS; text?: LS };
};

export type ValueItem = { title: LS; description: LS; icon: ValueIconName };

/** Textos editáveis das páginas (um único documento no CMS: "Textos das páginas"). */
export type PageTexts = {
  home: {
    heroTitle: LS;
    heroSubtitle: LS;
    hubText: LS;
    finalCtaTitle: LS;
    finalCtaText: LS;
  };
  areasIndex: { intro: LS };
  values: { intro: LS };
  articles: { intro: LS };
  videos: { intro: LS };
  contact: { intro: LS };
  testimonials: { intro: LS };
};

export type FaqItem = { question: LS; answer: LS };

export type PillarContent = {
  id: PillarSlug | "hub";
  intro: LS;
  whoFor: LS;
  whenToSeek: LS;
  internationalIntro?: LS;
  faq: FaqItem[];
  /** Vídeo relacionado (id do documento no CMS). */
  videoId?: string;
};

export type ArticleCategory = { id: string; title: LS };

export type PillarOrHubId = PillarSlug | "hub";

export type Article = {
  id: string;
  slug: string;
  language: Locale;
  title: string;
  excerpt: string;
  cover?: ImageRef;
  body: RichBlock[];
  category?: { id: string; title: string };
  authorName: string;
  publishedAt: string; // ISO
  pillar?: PillarOrHubId;
  videoId?: string;
  translationSlug?: string; // slug do artigo irmão no outro idioma
  seo?: { title?: string; description?: string };
  /** Verdadeiro para conteúdo de exemplo que ainda não foi publicado. */
  draft?: boolean;
};

export type VideoProvider = "youtube" | "vimeo";

export type Video = {
  id: string;
  provider: VideoProvider;
  providerId: string;
  url: string;
  title: string;
  description: string;
  language: Locale;
  category?: { id: string; title: string };
  pillar?: PillarOrHubId;
  thumbnail?: ImageRef;
  /** URL de miniatura resolvida no servidor (YouTube via next/image; Vimeo via oEmbed). */
  thumbnailUrl?: string;
  publishedAt: string;
  duration?: string; // ISO 8601, ex.: PT3M20S
  draft?: boolean;
};

export type LegalPageId = "privacy" | "terms" | "cookies";

export type LegalPage = {
  id: LegalPageId;
  title: LS;
  updatedAt?: string;
  body: LRich;
};
