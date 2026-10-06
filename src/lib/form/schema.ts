import { z } from "zod";
import { isCountry } from "@/lib/countries";

import { AREA_VALUES, MESSAGE_MAX, MESSAGE_MIN } from "./constants";

export { AREA_VALUES, MESSAGE_MAX, MESSAGE_MIN };
export type { AreaValue } from "./constants";

/** Remove quebras de linha e caracteres de controle (evita injeção de cabeçalhos e lixo no assunto do e-mail). */
export const oneLine = (s: string): string => s.replace(/[\r\n\u0000-\u001f\u007f]+/g, " ").replace(/\s{2,}/g, " ").trim();

/**
 * Validação do formulário de contato (autoridade no servidor). As chaves dos erros são traduzidas na interface.
 */
export const contactSchema = z.object({
  name: z.string().transform(oneLine).pipe(z.string().min(2, "name").max(120, "name")),
  email: z.string().transform((s) => s.trim()).pipe(z.string().max(200, "email").pipe(z.email("email"))),
  dial: z.string().regex(/^\d{1,4}$/, "phone"),
  phone: z
    .string()
    .transform((s) => s.replace(/[^\d]/g, ""))
    .pipe(z.string().regex(/^\d{6,15}$/, "phone")),
  country: z.string().refine(isCountry, "country"),
  area: z.enum(AREA_VALUES, { error: "area" }),
  message: z
    .string()
    .transform((s) => s.replace(/\r\n/g, "\n").trim())
    .pipe(z.string().min(MESSAGE_MIN, "message").max(MESSAGE_MAX, "messageLong")),
  consent: z.literal("on", { error: "consent" }),
  locale: z.enum(["pt", "en"]),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type FieldKey = keyof ContactInput;
