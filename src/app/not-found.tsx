import type { Metadata } from "next";
import Link from "next/link";

import { ctaPrimary } from "@/components/cta";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { uk } from "@/content/uk";

import { siteConfig } from "../../site.config";

export const metadata: Metadata = {
  title: `${uk.notFound.title} | ${siteConfig.brand}`,
  description: uk.notFound.text,
};

export default function NotFound() {
  const t = uk.notFound;
  return (
    <>
      <SiteHeader />
      <main className="shell py-20 sm:py-28">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 text-[2rem] leading-[1.08] font-bold tracking-[-0.03em] sm:text-[2.75rem]">
          {t.title}
        </h1>
        <p className="mt-4 max-w-[34rem] text-muted-foreground">{t.text}</p>
        <Link href="/" className={`${ctaPrimary} mt-8`}>
          {t.back}
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
