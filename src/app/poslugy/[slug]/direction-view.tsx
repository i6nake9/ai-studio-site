import { JsonLd } from "@/components/json-ld";
import { LinkCards } from "@/components/link-cards";
import { MobileBar } from "@/components/mobile-bar";
import { OutcomeCard, PageHero } from "@/components/page-hero";
import { LeadSection } from "@/components/sections/lead-section";
import { ProcessSteps } from "@/components/sections/process";
import { FaqBand, IncludesAndFits, PricesBand } from "@/components/sections/service-blocks";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { blogText, readingFor } from "@/content/articles";
import { catalogText } from "@/content/catalog";
import { tasksOf } from "@/content/tasks";
import type { Dictionary } from "@/content/types";
import { uk } from "@/content/uk";
import { articleCard, serviceCard } from "@/lib/catalog";
import { breadcrumbJsonLd, faqJsonLd, pageUrl, serviceJsonLd } from "@/lib/seo";

import { siteConfig } from "../../../../site.config";

type Direction = Dictionary["solutions"]["items"][number];

/** Page of one of the four directions: what it covers and the tasks inside it. */
export function DirectionView({ service }: { service: Direction }) {
  const t = uk.servicePage;
  const { siteUrl, brand, prices } = siteConfig;
  const home = pageUrl(siteUrl, "/");
  const hub = pageUrl(siteUrl, "/poslugy/");
  const url = pageUrl(siteUrl, `/poslugy/${service.slug}/`);
  const faq = service.page.faq.map((item) => ({
    question: item.question,
    answer: [item.answer],
  }));
  const children = tasksOf(service.slug).map((task) => serviceCard(task.slug));
  const reading = readingFor([service.slug, ...tasksOf(service.slug).map((task) => task.slug)], 3).map(
    (item) => articleCard(item.slug),
  );
  const others = uk.solutions.items
    .filter((item) => item.slug !== service.slug)
    .map((item) => serviceCard(item.slug));

  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: service.title,
          description: service.page.metaDescription,
          url,
          providerName: brand,
          providerUrl: home,
          priceFromUsd: prices.pilot[0],
          priceToUsd: prices.full[1],
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t.home, url: home },
          { name: t.services, url: hub },
          { name: service.short, url },
        ])}
      />
      <JsonLd data={faqJsonLd(faq)} />

      <SiteHeader />
      <main>
        <PageHero
          crumbs={[
            { label: t.home, href: "/" },
            { label: t.services, href: "/poslugy/" },
            { label: service.short },
          ]}
          eyebrow={t.eyebrow}
          title={service.page.h1}
          intro={service.page.intro}
          pricesLink
          aside={<OutcomeCard outcome={service.outcome} integrations={service.integrations} />}
        />

        <IncludesAndFits includes={service.includes} fits={service.page.fits} />

        {children.length ? (
          <section className="band">
            <div className="shell">
              <h2 className="h2">{catalogText.direction.tasksTitle}</h2>
              <p className="mt-2.5 text-muted-foreground">{catalogText.direction.tasksLead}</p>
              <LinkCards items={children} tone="card" className="mt-8" />
            </div>
          </section>
        ) : null}

        <section className={children.length ? "band border-t border-border" : "band"}>
          <div className="shell">
            <h2 className="h2">{t.processTitle}</h2>
            <div className="mt-8">
              <ProcessSteps />
            </div>
          </div>
        </section>

        <PricesBand />
        <FaqBand title={t.faqTitle} name="service-faq" items={faq} />

        <section className="band border-t border-border bg-card">
          <div className="shell">
            <h2 className="h2">{t.otherTitle}</h2>
            <LinkCards items={others} className="mt-7" />
          </div>
        </section>

        {reading.length ? (
          <section className="band border-t border-border">
            <div className="shell">
              <h2 className="h2">{blogText.taskTitle}</h2>
              <LinkCards items={reading} tone="card" className="mt-7" />
            </div>
          </section>
        ) : null}

        <LeadSection />
      </main>
      <SiteFooter />
      <MobileBar />
    </>
  );
}
