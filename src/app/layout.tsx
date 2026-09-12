import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteHeader } from "@/components/navigation/site-header";

export const metadata: Metadata = {
  title: { default: "La Maison Malgache", template: "%s | La Maison Malgache" },
  description: "La Maison Malgache relie objets, matières, gestes et territoires dans une expérience éditoriale et commerciale contemporaine.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
