import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Onest, Unbounded } from "next/font/google";

import { uk } from "@/content/uk";

import { siteConfig } from "../../site.config";
import "./globals.css";

const display = Unbounded({
  variable: "--font-unbounded",
  subsets: ["cyrillic", "latin"],
  weight: ["500", "700"],
  display: "swap",
});

const sans = Onest({
  variable: "--font-onest",
  subsets: ["cyrillic", "latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: false,
});

const ogImage = `${siteConfig.siteUrl}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(`${siteConfig.siteUrl}/`),
  title: uk.meta.title,
  description: uk.meta.description,
  alternates: { canonical: `${siteConfig.siteUrl}/` },
  robots: siteConfig.noindex
    ? { index: false, follow: false }
    : { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    siteName: siteConfig.brand,
    title: uk.meta.title,
    description: uk.meta.description,
    url: `${siteConfig.siteUrl}/`,
    images: [{ url: ogImage, width: 1200, height: 630, alt: uk.meta.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: uk.meta.title,
    description: uk.meta.description,
    images: [ogImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#0d1512",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="uk"
      className={`dark ${display.variable} ${sans.variable} ${mono.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
