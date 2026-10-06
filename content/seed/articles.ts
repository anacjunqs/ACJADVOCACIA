import type { Article, ArticleCategory, RichBlock, Video } from "../../src/lib/content/types.ts";
import { heading, para, RJ } from "./helpers.ts";

/**
 * Exemplos de artigos (um artigo em PT e a sua tradução em EN) e um vídeo, todos marcados como rascunho.
 * Só aparecem em desenvolvimento e pré-visualização (ou com SHOW_SEED_DRAFTS=true).
 */
export const categoriesSeed: ArticleCategory[] = [
  { id: "inventario-sucessoes", title: { pt: "Inventário e Sucessões", en: "Probate & Inheritance" } },
  { id: "familias-entre-paises", title: { pt: "Famílias entre Países", en: "Cross-Border Families" } },
];

const bullet = (text: string, key: string): RichBlock => ({
  _type: "block",
  _key: key,
  style: "normal",
  listItem: "bullet",
  level: 1,
  markDefs: [],
  children: [{ _type: "span", _key: `${key}-s`, text, marks: [] }],
});

const quote = (text: string, key: string): RichBlock => ({
  _type: "block",
  _key: key,
  style: "blockquote",
  markDefs: [],
  children: [{ _type: "span", _key: `${key}-s`, text, marks: [] }],
});

const table = (key: string, caption: string, rows: string[][]): RichBlock => ({
  _type: "table",
  _key: key,
  caption,
  hasHeader: true,
  rows: rows.map((cells, i) => ({ _key: `${key}-r${i}`, cells })),
});

const bodyPt: RichBlock[] = [
  heading("O que é inventário", "h1"),
  para(`Inventário é o procedimento que identifica os bens, os direitos e as dívidas deixados por uma pessoa que faleceu e define como eles serão divididos entre os herdeiros. Herdeiros são as pessoas que têm direito à herança, de acordo com a situação familiar de quem faleceu. ${RJ}`, "p1"),
  heading("Cartório ou Justiça?", "h2"),
  para(`O inventário pode ser feito em cartório (inventário extrajudicial) ou pela Justiça (inventário judicial). A escolha depende da situação de cada família. ${RJ}`, "p2"),
  table("t1", "Dois caminhos para o inventário", [
    ["", "Em cartório", "Pela Justiça"],
    ["Onde é feito", "Cartório de notas", "Poder Judiciário"],
    ["Quando costuma ser considerado", "Quando há acordo entre os herdeiros", "Quando há desacordo ou situações que exigem decisão judicial"],
  ]),
  heading("Por onde começar", "h3"),
  bullet("Reúna os documentos pessoais de quem faleceu e dos herdeiros.", "b1"),
  bullet("Liste os bens conhecidos, como imóveis e contas.", "b2"),
  bullet("Anote as dívidas que você conhece.", "b3"),
  bullet("Procure orientação antes de assinar qualquer documento.", "b4"),
  quote("Não existe um único caminho para todas as famílias.", "q1"),
  heading("E quando há bens ou herdeiros no exterior?", "h4"),
  para(`Cada país tem as suas próprias regras. Nossa atuação cobre os aspectos do direito brasileiro, em coordenação com profissionais locais quando necessário. ${RJ}`, "p3"),
];

const bodyEn: RichBlock[] = [
  heading("What probate is", "h1"),
  para(`Probate (inventário) is the procedure that identifies the assets, rights and debts left by a person who has died and defines how they will be divided among the heirs. Heirs are the people entitled to the inheritance, according to the family situation of the person who died. ${RJ}`, "p1"),
  heading("Notary or court?", "h2"),
  para(`Probate can be handled before a notary (out-of-court probate) or by the courts (court probate). The choice depends on each family's situation. ${RJ}`, "p2"),
  table("t1", "Two paths for probate", [
    ["", "Before a notary", "By the courts"],
    ["Where it is done", "Notary office", "Judiciary"],
    ["When it is usually considered", "When the heirs agree", "When there is disagreement or situations that call for a court decision"],
  ]),
  heading("Where to start", "h3"),
  bullet("Gather the personal documents of the person who died and of the heirs.", "b1"),
  bullet("List the assets you know of, such as property and accounts.", "b2"),
  bullet("Note the debts you are aware of.", "b3"),
  bullet("Seek guidance before signing any document.", "b4"),
  quote("There is no single path for every family.", "q1"),
  heading("What if there are assets or heirs abroad?", "h4"),
  para(`Each country has its own rules. Our work covers the aspects of Brazilian law, in coordination with local professionals when necessary. ${RJ}`, "p3"),
];

const category = categoriesSeed[0]!;

export const articlesSeed: Article[] = [
  {
    id: "article-exemplo-pt",
    slug: "inventario-o-que-e-e-por-onde-comecar",
    language: "pt",
    title: "Inventário: o que é e por onde começar",
    excerpt: `Entenda, em linguagem simples, o que é inventário, quem são os herdeiros e quais caminhos existem para organizar a herança. ${RJ}`,
    category,
    authorName: "Ana Clara Junqueira",
    publishedAt: "2026-10-01T12:00:00.000Z",
    readingMinutes: 2,
    body: bodyPt,
    pillar: "inventario-sucessoes",
    videoId: "video-exemplo",
    translation: { slug: "probate-what-it-is-and-where-to-start", language: "en" },
    draft: true,
  },
  {
    id: "article-exemplo-en",
    slug: "probate-what-it-is-and-where-to-start",
    language: "en",
    title: "Probate: what it is and where to start",
    excerpt: `Understand, in plain language, what probate is, who the heirs are and which paths exist to organize an inheritance. ${RJ}`,
    category,
    authorName: "Ana Clara Junqueira",
    publishedAt: "2026-10-01T12:00:00.000Z",
    readingMinutes: 2,
    body: bodyEn,
    pillar: "inventario-sucessoes",
    videoId: "video-exemplo",
    translation: { slug: "inventario-o-que-e-e-por-onde-comecar", language: "pt" },
    draft: true,
  },
];

/** Vídeo de exemplo. O endereço é um espaço reservado: troque por um vídeo real no CMS. */
export const videosSeed: Video[] = [
  {
    id: "video-exemplo",
    provider: "youtube",
    providerId: "PREENCHER00",
    url: "https://www.youtube.com/watch?v=PREENCHER00",
    title: `O que é inventário? ${RJ}`,
    description: `[PREENCHER: vídeo real e descrição] Explicação curta e em linguagem simples sobre o que é inventário. ${RJ}`,
    language: "pt",
    category,
    pillar: "inventario-sucessoes",
    publishedAt: "2026-10-01T12:00:00.000Z",
    draft: true,
  },
];
