import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { defineLocations, presentationTool } from "sanity/presentation";
import { dataset, projectId } from "./src/sanity/env";
import { schemaTypes, singletonTypes, fixedTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";
import { pillars, pillarSlug } from "./src/lib/services/catalog";

const lockedTypes = new Set<string>([...singletonTypes, ...fixedTypes]);
const noDelete = new Set(["delete", "duplicate", "unpublish"]);

/** Endereço público de cada documento, para o botão "abrir no site" da pré-visualização. */
const articlePath = (language?: string, slug?: string) =>
  slug ? (language === "en" ? `/en/articles/${slug}` : `/pt/artigos/${slug}`) : undefined;

export default defineConfig({
  name: "acj",
  title: "ACJ Advocacia — painel",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure }),
    presentationTool({
      // O modo de rascunho é ativado pela rota /api/draft-mode/enable, validada pelo próprio Sanity
      // (segredo criado com a sessão da pessoa logada; nada fica exposto no navegador).
      previewUrl: { initial: "/pt", previewMode: { enable: "/api/draft-mode/enable", disable: "/api/draft-mode/disable" } },
      resolve: {
        locations: {
          founder: defineLocations({
            message: "Aparece na página Sobre a Fundadora",
            locations: [
              { title: "Sobre a Fundadora (PT)", href: "/pt/sobre" },
              { title: "About the Founder (EN)", href: "/en/about" },
            ],
          }),
          valuesList: defineLocations({
            locations: [
              { title: "Nossos Valores (PT)", href: "/pt/valores" },
              { title: "Our Values (EN)", href: "/en/values" },
            ],
          }),
          pageTexts: defineLocations({ locations: [{ title: "Página inicial", href: "/pt" }] }),
          siteSettings: defineLocations({ locations: [{ title: "Página inicial", href: "/pt" }] }),
          pillarContent: defineLocations({
            select: { id: "pillarId" },
            resolve: (doc) => {
              const p = pillars.find((x) => x.id === doc?.id);
              if (!p) return doc?.id === "hub" ? { locations: [{ title: "Famílias entre Países", href: "/pt/familias-entre-paises" }] } : null;
              return {
                locations: [
                  { title: `${p.title.pt} (PT)`, href: `/pt/areas-de-atuacao/${pillarSlug(p, "pt")}` },
                  { title: `${p.title.en} (EN)`, href: `/en/practice-areas/${pillarSlug(p, "en")}` },
                ],
              };
            },
          }),
          article: defineLocations({
            select: { title: "title", slug: "slug.current", language: "language" },
            resolve: (doc) => {
              const href = articlePath(doc?.language, doc?.slug);
              return href ? { locations: [{ title: doc?.title || "Artigo", href }] } : null;
            },
          }),
        },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !lockedTypes.has(schemaType)),
  },
  document: {
    actions: (prev, { schemaType }) => (lockedTypes.has(schemaType) ? prev.filter(({ action }) => !(action && noDelete.has(action))) : prev),
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === "global" ? prev.filter((item) => !lockedTypes.has(item.templateId)) : prev,
  },
});
