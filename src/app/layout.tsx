// Expected: Root layout shared by all pages. Keep global styles and app shell only.
import "../styles/globals.css";

import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteHeader } from "../components/layout/site-header";

export const metadata: Metadata = {
  title: "CIN Frontend",
  description: "Consulate CIN and appointment frontend"
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body>
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
