import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { Container, Section } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Txt } from "@/components/ui/txt";
import { VideoFacade } from "@/components/video/video-facade";
import { getFeaturedVideo } from "@/lib/content/articles";
import { withThumbnails } from "@/lib/video-thumbnail";
import type { AppLocale } from "@/lib/i18n/routing";

/** Um vídeo em destaque (o mais recente no idioma). Sem vídeos publicados, a seção não aparece. */
export async function FeaturedVideo({ locale }: { locale: AppLocale }) {
  const [t, raw] = await Promise.all([getTranslations("home"), getFeaturedVideo(locale)]);
  if (!raw) return null;
  const [video] = await withThumbnails([raw]);
  if (!video) return null;
  return (
    <Section tone="cream" labelledBy="featured-video-title">
      <Container>
        <h2 id="featured-video-title" className="text-3xl sm:text-4xl">
          {t("videoTitle")}
        </h2>
        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <VideoFacade provider={video.provider} providerId={video.providerId} providerHash={video.providerHash} title={video.title} thumbnailUrl={video.thumbnailUrl} />
          <div>
            <h3 className="font-serif text-2xl leading-snug">
              <Txt>{video.title}</Txt>
            </h3>
            <p className="mt-3 text-fg-muted">
              <Txt>{video.description}</Txt>
            </p>
            <Link href="/videos" className="mt-5 inline-flex min-h-11 items-center gap-2 font-bold underline underline-offset-4">
              {t("videoCta")}
              <Icon name="arrow-right" size={18} />
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
