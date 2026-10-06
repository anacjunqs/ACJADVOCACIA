import createImageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "../env";

type Crop = { top: number; bottom: number; left: number; right: number };
export type SanityImageSource = { ref: string; crop?: Crop | null; hotspot?: unknown; dims?: { width: number; height: number } | null };

const builder = () => createImageUrlBuilder({ projectId, dataset });

/** URL no CDN do Sanity já com o recorte definido no Studio (o `next/image` acrescenta a largura). */
export function sanityImageUrl(img: SanityImageSource): string {
  const source = { _type: "image", asset: { _type: "reference", _ref: img.ref }, crop: img.crop ?? undefined, hotspot: img.hotspot as never };
  return builder().image(source).url();
}

/** Dimensões finais, descontado o recorte. */
export function sanityImageSize(img: SanityImageSource): { width: number; height: number } {
  const w = img.dims?.width ?? 1200;
  const h = img.dims?.height ?? 800;
  const c = img.crop;
  if (!c) return { width: w, height: h };
  return { width: Math.max(1, Math.round(w * (1 - c.left - c.right))), height: Math.max(1, Math.round(h * (1 - c.top - c.bottom))) };
}

/** Extrai largura e altura do `_ref` do asset (formato `image-<hash>-<L>x<A>-<ext>`). */
export function sizeFromRef(ref: string): { width: number; height: number } | undefined {
  const m = /^image-[a-f0-9]+-(\d+)x(\d+)-[a-z]+$/i.exec(ref);
  return m ? { width: Number(m[1]), height: Number(m[2]) } : undefined;
}
