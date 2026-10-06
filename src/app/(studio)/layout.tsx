export const metadata = { title: "ACJ Advocacia — painel", robots: { index: false, follow: false } };

/** Layout raiz próprio do Studio (separado do site público). */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
