import { getTranslations } from "next-intl/server";
import { Container, Section } from "@/components/ui/container";
import { Txt } from "@/components/ui/txt";
import { VideoFacade } from "./video-facade";
import type { Video } from "@/lib/content/types";

function formatDuration(seconds?: number): string | undefined {
  if (!seconds) return undefined;
  return `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, "0")}`;
}

/** Um vídeo em destaque (anexado a artigo ou a página de área). Player só após o clique e o consentimento. */
export async function VideoSection({ video, titleKey = "relatedVideo", tone = "white" }: { video: Video; titleKey?: "relatedVideo"; tone?: "white" | "cream" }) {
  const t = await getTranslations("articles");
  return (
    <Section tone={tone} labelledBy="video-section-title">
      <Container>
        <h2 id="video-section-title" className="text-3xl sm:text-4xl">
          {t(titleKey)}
        </h2>
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
          <VideoFacade provider={video.provider} providerId={video.providerId} providerHash={video.providerHash} title={video.title} thumbnailUrl={video.thumbnailUrl} duration={formatDuration(video.durationSeconds)} />
          <div>
            <h3 className="font-serif text-2xl leading-snug">
              <Txt>{video.title}</Txt>
            </h3>
            <p className="mt-3 text-fg-muted">
              <Txt>{video.description}</Txt>
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
