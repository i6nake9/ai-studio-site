import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { uk } from "@/content/uk";
import { pageMeta } from "@/lib/page-meta";

import { siteConfig } from "../../../site.config";

export const metadata: Metadata = pageMeta(
  "/privacy/",
  `${uk.privacy.title} | ${siteConfig.brand}`,
  uk.privacy.sections[0].text[0],
);

export default function PrivacyPage() {
  const t = uk.privacy;
  return (
    <>
      <SiteHeader />
      <main className="shell max-w-3xl py-14 sm:py-20">
        <p className="eyebrow">{t.updated}</p>
        <h1 className="mt-4 text-[2rem] leading-[1.08] font-bold tracking-[-0.03em] sm:text-[2.75rem]">
          {t.title}
        </h1>
        <div className="mt-10 space-y-9">
          {t.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-bold">{section.title}</h2>
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
