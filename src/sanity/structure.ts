import type { StructureBuilder, StructureResolver } from "sanity/structure";

/**
 * Menu do Studio em português. "Configurações do escritório" só aparece para Administradores
 * (isso organiza a interface; a permissão real é definida nos papéis do projeto no Sanity).
 */
export const structure: StructureResolver = (S: StructureBuilder, context) => {
  const isAdmin = (context.currentUser?.roles ?? []).some((r) => r.name === "administrator");

  const single = (type: string, title: string) =>
    S.listItem().title(title).id(type).child(S.document().schemaType(type).documentId(type).title(title));

  // documentList não mostra o botão "novo": o conjunto de documentos é fixo.
  const fixed = (type: string, title: string, order: string) =>
    S.listItem()
      .title(title)
      .id(type)
      .child(S.documentList().title(title).filter("_type == $type").params({ type }).defaultOrdering([{ field: order, direction: "asc" }]));

  return S.list()
    .title("Conteúdo do site")
    .items([
      ...(isAdmin ? [single("siteSettings", "Configurações do escritório")] : []),
      single("pageTexts", "Textos das páginas"),
      S.divider(),
      single("founder", "Sobre a Fundadora"),
      single("valuesList", "Nossos Valores"),
      fixed("pillarContent", "Áreas de atuação (textos e perguntas)", "pillarId"),
      S.divider(),
      S.listItem()
        .title("Artigos")
        .id("articles")
        .child(
          S.list()
            .title("Artigos")
            .items([
              S.listItem().title("Todos os artigos").child(S.documentTypeList("article").title("Todos os artigos")),
              S.listItem()
                .title("Em português")
                .child(S.documentList().title("Artigos em português").filter('_type == "article" && language == "pt"').defaultOrdering([{ field: "publishedAt", direction: "desc" }])),
              S.listItem()
                .title("In English")
                .child(S.documentList().title("Artigos em inglês").filter('_type == "article" && language == "en"').defaultOrdering([{ field: "publishedAt", direction: "desc" }])),
              S.listItem().title("Categorias").child(S.documentTypeList("articleCategory").title("Categorias")),
            ]),
        ),
      S.documentTypeListItem("video").title("Vídeos"),
      S.divider(),
      fixed("legalPage", "Páginas legais", "pageId"),
    ]);
};
