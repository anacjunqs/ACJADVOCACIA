"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { Icon } from "@/components/ui/icon";
import { buttonClasses } from "@/components/ui/button-styles";
import { submitContact, type ContactState } from "@/app/(site)/[locale]/contato/actions";
import { COUNTRIES } from "@/lib/countries";
import { MESSAGE_MAX } from "@/lib/form/constants";
import type { AppLocale } from "@/lib/i18n/routing";

export type AreaOption = { value: string; label: string };
export type CountryOption = { code: string; name: string; dial: string };

const initial: ContactState = { status: "idle" };

const control =
  "min-h-12 w-full rounded-control border-2 border-navy-200 bg-white px-3 text-navy placeholder:text-navy-600 focus:border-navy aria-[invalid=true]:border-[#9a1b1b]";

function Field({ id, label, error, hint, children, required }: { id: string; label: string; error?: string; hint?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-bold">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-sm text-fg-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 flex items-start gap-1.5 text-sm font-semibold text-[#9a1b1b]">
          <Icon name="warning" size={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Formulário de contato. Mobile primeiro: teclados certos (e-mail, telefone), preenchimento automático,
 * alvos de 48px e erros em português ou inglês, ligados ao campo. Só envia um e-mail; nada é guardado em banco.
 */
export function ContactForm({
  areas,
  whatsappHref,
  countries,
  popular,
  dials,
}: {
  areas: AreaOption[];
  whatsappHref?: string;
  /** Lista de países montada NO SERVIDOR (o ICU do navegador ordena e escreve nomes de forma ligeiramente diferente). */
  countries: CountryOption[];
  popular: CountryOption[];
  dials: string[];
}) {
  const t = useTranslations("contact");
  const tc = useTranslations("common");
  const locale = useLocale() as AppLocale;
  const [state, action, pending] = useActionState(submitContact, initial);
  const [token, setToken] = useState("");
  const [dial, setDial] = useState("55");
  const [dialTouched, setDialTouched] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  const v = state.values ?? {};
  const errs = state.fieldErrors ?? {};
  const errorFor = (k: keyof typeof errs) => (errs[k] ? t(`errors.${errs[k]}` as never) : undefined);

  // Token de tempo mínimo de preenchimento (assinado no servidor).
  useEffect(() => {
    let alive = true;
    fetch("/api/form-token", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { token?: string }) => alive && setToken(d.token ?? ""))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // Leva a pessoa ao resumo de erros quando o envio falha.
  useEffect(() => {
    if (state.status === "error") summaryRef.current?.focus();
  }, [state]);

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-card border border-line bg-white p-6 sm:p-8">
        <span className="flex size-12 items-center justify-center rounded-full bg-navy text-white">
          <Icon name="check" size={26} />
        </span>
        <h2 className="mt-4 font-serif text-3xl">{t("success.title")}</h2>
        <p className="mt-2 text-lg text-fg-muted">{t("success.text")}</p>
        {whatsappHref && (
          <>
            <p className="mt-4 text-fg-muted">{t("success.whatsapp")}</p>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={buttonClasses("ghost", "md", "mt-3")}>
              <Icon name="message-circle" size={20} />
              {tc("whatsapp")}
              <span className="sr-only">{tc("opensInNewTab")}</span>
            </a>
          </>
        )}
      </div>
    );
  }

  const errorList = Object.entries(errs).map(([k, key]) => ({ field: k, msg: t(`errors.${key}` as never) }));
  const formError = state.formError ? t(`errors.${state.formError}` as never) : undefined;
  const anchorFor: Record<string, string> = { name: "f-name", email: "f-email", phone: "f-phone", dial: "f-phone", country: "f-country", area: "f-area", message: "f-message", consent: "f-consent" };

  return (
    <form action={action} className="space-y-5" noValidate={false}>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="t" value={token} />

      {(errorList.length > 0 || formError) && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-card border-2 border-[#9a1b1b] bg-white p-4">
          {formError ? <p className="font-semibold text-[#9a1b1b]">{formError}</p> : <p className="font-bold text-[#9a1b1b]">{t("errorSummary")}</p>}
          {errorList.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {errorList.map((e) => (
                <li key={e.field}>
                  <a href={`#${anchorFor[e.field] ?? "f-name"}`} className="underline underline-offset-4">
                    {e.msg}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Field id="f-name" label={t("fields.name")} required error={errorFor("name")}>
        <input id="f-name" name="name" type="text" required minLength={2} maxLength={120} autoComplete="name" defaultValue={v.name} aria-invalid={Boolean(errs.name)} aria-describedby={errs.name ? "f-name-error" : undefined} className={control} />
      </Field>

      <Field id="f-email" label={t("fields.email")} required error={errorFor("email")}>
        <input id="f-email" name="email" type="email" required maxLength={200} autoComplete="email" inputMode="email" defaultValue={v.email} aria-invalid={Boolean(errs.email)} aria-describedby={errs.email ? "f-email-error" : undefined} className={control} />
      </Field>

      <Field id="f-country" label={t("fields.country")} required error={errorFor("country")}>
        <select
          id="f-country"
          name="country"
          required
          defaultValue={v.country ?? ""}
          autoComplete="country"
          aria-invalid={Boolean(errs.country)}
          aria-describedby={errs.country ? "f-country-error" : undefined}
          onChange={(e) => {
            const c = COUNTRIES[e.target.value];
            if (c && !dialTouched) setDial(c);
          }}
          className={control}
        >
          <option value="">{t("fields.countryPlaceholder")}</option>
          <optgroup label={t("fields.popular")}>
            {popular.map((c) => (
              <option key={`p-${c.code}`} value={c.code}>
                {c.name}
              </option>
            ))}
          </optgroup>
          <optgroup label={t("fields.all")}>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </optgroup>
        </select>
      </Field>

      <div>
        <label htmlFor="f-phone" className="mb-1 block font-bold">
          {t("fields.phone")}
          <span aria-hidden="true"> *</span>
        </label>
        <div className="grid grid-cols-[6.5rem_1fr] gap-2">
          <select
            name="dial"
            aria-label={t("fields.dial")}
            value={dial}
            onChange={(e) => {
              setDial(e.target.value);
              setDialTouched(true);
            }}
            className={control}
          >
            {dials.map((d) => (
              <option key={d} value={d}>
                +{d}
              </option>
            ))}
          </select>
          <input
            id="f-phone"
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel-national"
            maxLength={24}
            defaultValue={v.phone}
            aria-invalid={Boolean(errs.phone)}
            aria-describedby={errs.phone ? "f-phone-error" : undefined}
            className={control}
          />
        </div>
        {errs.phone && (
          <p id="f-phone-error" className="mt-1 flex items-start gap-1.5 text-sm font-semibold text-[#9a1b1b]">
            <Icon name="warning" size={16} className="mt-0.5 shrink-0" />
            {errorFor("phone")}
          </p>
        )}
      </div>

      <Field id="f-area" label={t("fields.area")} required error={errorFor("area")}>
        <select id="f-area" name="area" required defaultValue={v.area ?? ""} aria-invalid={Boolean(errs.area)} aria-describedby={errs.area ? "f-area-error" : undefined} className={control}>
          <option value="">{t("fields.areaPlaceholder")}</option>
          {areas.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
      </Field>

      <Field id="f-message" label={t("fields.message")} required error={errorFor("message")} hint={t("fields.messageHint")}>
        <textarea
          id="f-message"
          name="message"
          required
          minLength={10}
          maxLength={MESSAGE_MAX}
          rows={6}
          defaultValue={v.message}
          aria-invalid={Boolean(errs.message)}
          aria-describedby={errs.message ? "f-message-error" : "f-message-hint"}
          className={`${control} py-3`}
        />
      </Field>

      {/* Honeypot: invisível para pessoas e leitores de tela; robôs costumam preencher. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
        <label>
          {t("fields.honeypot")}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            id="f-consent"
            name="consent"
            type="checkbox"
            required
            defaultChecked={v.consent === "on"}
            aria-invalid={Boolean(errs.consent)}
            aria-describedby={errs.consent ? "f-consent-error" : undefined}
            className="mt-1 size-6 shrink-0 accent-navy"
          />
          <span>
            {t("fields.consent")}{" "}
            <Link href="/privacidade" className="font-semibold underline underline-offset-4" target="_blank">
              {t("fields.privacyLink")}
            </Link>
            <span aria-hidden="true"> *</span>
          </span>
        </label>
        {errs.consent && (
          <p id="f-consent-error" className="mt-1 flex items-start gap-1.5 text-sm font-semibold text-[#9a1b1b]">
            <Icon name="warning" size={16} className="mt-0.5 shrink-0" />
            {errorFor("consent")}
          </p>
        )}
      </div>

      <button type="submit" disabled={pending} className={buttonClasses("primary", "lg", "w-full sm:w-auto")}>
        {pending ? t("sending") : t("submit")}
        {!pending && <Icon name="arrow-right" size={20} />}
      </button>
      <p className="text-sm text-fg-muted">
        <span aria-hidden="true">* </span>
        {t("fields.required")}
      </p>
    </form>
  );
}
