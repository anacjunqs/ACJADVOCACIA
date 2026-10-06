"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "@/components/ui/icon";
import { Img } from "@/components/ui/img";
import { buttonClasses } from "@/components/ui/button-styles";
import { useConsent } from "@/components/consent/consent-provider";
import { embedUrl, watchUrl } from "@/lib/video-url";
import type { VideoProvider } from "@/lib/content/types";

type Props = {
  provider: VideoProvider;
  providerId: string;
  providerHash?: string;
  title: string;
  thumbnailUrl?: string;
  /** Duração já formatada (ex.: "3:20"), opcional. */
  duration?: string;
  priority?: boolean;
};

const providerName: Record<VideoProvider, string> = { youtube: "YouTube", vimeo: "Vimeo" };

/**
 * "Facade": mostra a miniatura e um botão. O player (iframe) só é criado depois do clique e,
 * se ainda não houve consentimento para mídia de terceiros, só depois de a pessoa permitir.
 * YouTube via youtube-nocookie; Vimeo com dnt=1.
 */
export function VideoFacade({ provider, providerId, providerHash, title, thumbnailUrl, duration, priority }: Props) {
  const t = useTranslations("videos");
  const { consent, allowMedia } = useConsent();
  const [wantsPlay, setWantsPlay] = useState(false);
  const [thumbBroken, setThumbBroken] = useState(false);
  const name = providerName[provider];
  const playing = wantsPlay && consent?.media === true;
  const asking = wantsPlay && !playing;

  if (playing) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-card bg-navy-900">
        <iframe
          src={embedUrl({ provider, providerId, providerHash })}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="size-full border-0"
        />
      </div>
    );
  }

  return (
    <div className="surface-navy relative aspect-video w-full overflow-hidden rounded-card">
      {thumbnailUrl && !thumbBroken ? (
        <Img src={thumbnailUrl} alt="" fill priority={priority} sizes="(min-width: 1024px) 28rem, 90vw" className="object-cover" onError={() => setThumbBroken(true)} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-navy-100" aria-hidden="true">
          <Icon name="video" size={48} />
        </div>
      )}
      {asking ? (
        <div className="absolute inset-0 flex flex-col justify-center gap-3 bg-navy/95 p-4 text-sm sm:p-6 sm:text-base">
          <p className="font-serif text-xl leading-snug">{t("consentTitle", { provider: name })}</p>
          <p className="text-navy-100">{t("consentText", { provider: name })}</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={allowMedia} className={buttonClasses("secondary", "md", "min-h-11 px-4")}>
              {t("allowAndWatch")}
            </button>
            <a href={watchUrl({ provider, providerId, providerHash })} target="_blank" rel="noopener noreferrer" className={buttonClasses("ghost-on-navy", "md", "min-h-11 px-4")}>
              {t("openOn", { provider: name })}
            </a>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setWantsPlay(true)}
          aria-label={t("play", { title })}
          className="group absolute inset-0 flex items-center justify-center"
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-gold text-navy shadow-soft transition-transform group-hover:scale-105 sm:size-20">
            <Icon name="play" size={32} className="ml-1" />
          </span>
          {duration && <span className="absolute bottom-3 right-3 rounded bg-navy-900/90 px-2 py-0.5 text-sm font-semibold">{duration}</span>}
        </button>
      )}
    </div>
  );
}
