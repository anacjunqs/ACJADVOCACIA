import NextImage, { type ImageProps } from "next/image";
import { Image as SanityImage } from "next-sanity/image";

/**
 * Imagem do site. Usa `next/image` sempre: com o carregador do CDN do Sanity quando a origem é o Sanity,
 * e com o otimizador padrão para arquivos locais (/public) e miniaturas remotas permitidas.
 */
export function Img(props: ImageProps & { src: string }) {
  if (props.src.startsWith("https://cdn.sanity.io/")) {
    const { loader: _loader, ...rest } = props as ImageProps & { loader?: never };
    void _loader;
    return <SanityImage {...(rest as React.ComponentProps<typeof SanityImage>)} />;
  }
  return <NextImage {...props} />;
}
