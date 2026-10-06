"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { FilterChips } from "@/components/ui/filter-chips";
import { VideoFacade } from "./video-facade";
import { Txt } from "@/components/ui/txt";
import { pick } from "@/lib/i18n/localize";
import type { ArticleCategory, Video } from "@/lib/content/types";
import type { AppLocale } from "@/lib/i18n/routing";

function formatDuration(seconds?: number): string | undefined {
  if (!seconds) return undefined;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Grade de vídeos com miniatura (facade) e filtro por categoria. */
export function VideoGrid({ videos, categories }: { videos: Video[]; categories: ArticleCategory[] }) {
  const t = useTranslations("videos");
  const ta = useTranslations("articles");
  const locale = useLocale() as AppLocale;
  const params = useSearchParams();
  const [cat, setCat] = useState(params.get("cat") ?? "");

  const onChange = (id: string) => {
    setCat(id);
    const qs = id ? `?cat=${encodeURIComponent(id)}` : "";
    window.history.replaceState(null, "", `${window.location.pathname}${qs}`);
  };

  const shown = videos.filter((v) => !cat || v.category?.id === cat);
  const options = categories.map((c) => ({ id: c.id, label: pick(c.title, locale).text }));

  return (
    <div>
      <FilterChips label={ta("categoryLabel")} allLabel={ta("all")} options={options} value={cat} onChange={onChange} />
      <p role="status" aria-live="polite" className="mt-6 text-fg-muted">
        {t("results", { count: shown.length })}
      </p>
      {shown.length === 0 ? (
        <p className="mt-6 rounded-card border border-line bg-white p-8 text-center text-lg">{videos.length === 0 ? t("empty") : t("emptyFiltered")}</p>
      ) : (
        <ul className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((v) => (
            <li key={v.id}>
              <VideoFacade
                provider={v.provider}
                providerId={v.providerId}
                providerHash={v.providerHash}
                title={v.title}
                thumbnailUrl={v.thumbnailUrl}
                duration={formatDuration(v.durationSeconds)}
              />
              <h3 className="mt-3 font-serif text-2xl leading-snug">
                <Txt>{v.title}</Txt>
              </h3>
              {v.category && <p className="mt-1 text-sm font-semibold text-fg-muted">{pick(v.category.title, locale).text}</p>}
              <p className="mt-2 text-fg-muted">
                <Txt>{v.description}</Txt>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
