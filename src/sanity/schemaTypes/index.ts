import type { SchemaTypeDefinition } from "sanity";
import { siteSettings } from "./siteSettings";
import { founder } from "./founder";
import { valuesList } from "./valuesList";
import { pageTexts } from "./pageTexts";
import { pillarContent } from "./pillarContent";
import { legalPage } from "./legalPage";
import { article } from "./article";
import { articleCategory } from "./articleCategory";
import { video } from "./video";
import { articleImage, table } from "./blocks";

export const schemaTypes: SchemaTypeDefinition[] = [
  siteSettings,
  founder,
  valuesList,
  pageTexts,
  pillarContent,
  legalPage,
  article,
  articleCategory,
  video,
  articleImage,
  table,
];

/** Documentos únicos: não podem ser criados, duplicados nem apagados. */
export const singletonTypes = ["siteSettings", "founder", "valuesList", "pageTexts"] as const;
/** Documentos de conjunto fixo (criados pela importação do seed): sem "novo" nem "apagar". */
export const fixedTypes = ["pillarContent", "legalPage"] as const;
