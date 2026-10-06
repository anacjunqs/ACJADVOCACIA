import type { Metadata, Viewport } from "next";
import { serif, sans } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "ACJ Advocacia",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#093247", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
