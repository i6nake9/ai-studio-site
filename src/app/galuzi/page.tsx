import type { Metadata } from "next";
import Link from "next/link";

import { linkAccent } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { LinkCards } from "@/components/link-cards";
import { MobileBar } from "@/components/mobile-bar";
import { PageHero } from "@/components/page-hero";
import { LeadSection } from "@/components/sections/lead-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { catalogText } from "@/content/catalog";
import { industries } from "@/content/industries";
import { uk } from "@/content/uk";
import { industryCard } from "@/lib/catalog";
import { pageMeta } from "@/lib/page-meta";
import { breadcrumbJsonLd, pageUrl } from "@/lib/seo";

import { siteConfig } from "../../../site.config";

const text = catalogText.industriesIndex;

export const metadata: Metadata = pageMeta("/galuzi/", text.metaTitle, text.metaDescription);

/** Index of the pages written for particular types of business. */
export default function IndustriesIndexPage() {
  const t = uk.servicePage;
  const { siteUrl } = siteConfig;
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t.home, url: pageUrl(siteUrl, "/") },
          { name: catalogText.industry.crumb, url: pageUrl(siteUrl, "/galuzi/") },
        ])}
      />
      <SiteHeader />
      <main>
        <PageHero
          crumbs={[{ label: t.home, href: "/" }, { label: catalogText.industry.crumb }]}
          eyebrow={text.eyebrow}
          title={text.h1}
          intro={text.intro}
        />
        <section className="band border-t border-border bg-card">
          <div className="shell">
            <LinkCards items={industries.map((item) => industryCard(item.slug))} />
            <Link href="/poslugy/" className={`${linkAccent} mt-5`}>
              {text.servicesLink} →
            </Link>
          </div>
        </section>
        <section className="band border-t border-border">
          <div className="shell max-w-[48rem]">
            <h2 className="h2">{text.moreTitle}</h2>
            {text.more.map((line) => (
              <p key={line} className="mt-4 text-[1.0625rem] leading-[1.65]">
                {line}
              </p>
            ))}
          </div>
        </section>
        <LeadSection />
      </main>
      <SiteFooter />
      <MobileBar />
    </>
  );
}
