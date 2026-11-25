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
import { tasksOf } from "@/content/tasks";
import { uk } from "@/content/uk";
import { industryCard, serviceCard } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { pageMeta } from "@/lib/page-meta";
import { breadcrumbJsonLd, pageUrl } from "@/lib/seo";

import { siteConfig } from "../../../site.config";

const text = catalogText.hub;

export const metadata: Metadata = pageMeta("/poslugy/", text.metaTitle, text.metaDescription);

/** Index of everything the studio does: four directions with their tasks, then industries. */
export default function ServicesIndexPage() {
  const t = uk.servicePage;
  const { siteUrl } = siteConfig;
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t.home, url: pageUrl(siteUrl, "/") },
          { name: t.services, url: pageUrl(siteUrl, "/poslugy/") },
        ])}
      />
      <SiteHeader />
      <main>
        <PageHero
          crumbs={[{ label: t.home, href: "/" }, { label: t.services }]}
          eyebrow={text.eyebrow}
          title={text.h1}
          intro={text.intro}
        />

        {uk.solutions.items.map((direction, i) => (
          <section
            key={direction.slug}
            className={cn("band border-t border-border", i % 2 === 0 && "bg-card")}
          >
            <div className="shell">
              <div className="max-w-[47.5rem]">
                <h2 className="h2">{direction.title}</h2>
                <p className="mt-2.5 text-muted-foreground">{direction.summary}</p>
                <Link href={`/poslugy/${direction.slug}/`} className={cn(linkAccent, "mt-1")}>
                  {text.directionLink}: {direction.short} →
                </Link>
              </div>
              <LinkCards
                items={tasksOf(direction.slug).map((task) => serviceCard(task.slug))}
                tone={i % 2 === 0 ? "page" : "card"}
                className="mt-6"
              />
            </div>
          </section>
        ))}

        <section id="galuzi" className="band border-t border-border bg-card">
          <div className="shell">
            <div className="max-w-[47.5rem]">
              <h2 className="h2">{text.industriesTitle}</h2>
              <p className="mt-2.5 text-muted-foreground">{text.industriesLead}</p>
            </div>
            <LinkCards items={industries.map((item) => industryCard(item.slug))} className="mt-7" />
          </div>
        </section>

        <LeadSection />
      </main>
      <SiteFooter />
      <MobileBar />
    </>
  );
}
