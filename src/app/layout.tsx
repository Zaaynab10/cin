// Expected: Root layout shared by all pages. Keep global styles and app shell only.
import "../styles/globals.css";

import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";

import { SiteHeader } from "../components/layout/site-header";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	title: "CIN Frontend",
	description: "Consulate CIN and appointment frontend",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
};

type RootLayoutProps = {
	children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="fr" className={inter.variable}>
			<body>
				<SiteHeader />
				<main>{children}</main>
			</body>
		</html>
	);
}
