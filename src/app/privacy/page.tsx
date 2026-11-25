import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { uk } from "@/content/uk";

import { siteConfig } from "../../../site.config";

export const metadata: Metadata = {
  title: `${uk.privacy.title} — ${siteConfig.brand}`,
  alternates: { canonical: `${siteConfig.siteUrl}/privacy/` },
};

export default function PrivacyPage() {
  const t = uk.privacy;
  return (
    <>
      <SiteHeader variant="plain" />
      <main className="shell max-w-3xl py-14 sm:py-20">
        <p className="label-mono text-signal">{t.updated}</p>
        <h1 className="mt-5 font-display text-3xl font-medium sm:text-4xl">
          {t.title}
        </h1>
        <div className="mt-10 space-y-9">
          {t.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold">{section.title}</h2>
              {section.text.map((paragraph) => (
                <p key={paragraph} className="mt-2 text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
