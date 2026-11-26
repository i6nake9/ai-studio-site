import { JsonLd } from "@/components/json-ld";
import { LinkCards } from "@/components/link-cards";
import { MobileBar } from "@/components/mobile-bar";
import { OutcomeCard, PageHero } from "@/components/page-hero";
import { LeadSection } from "@/components/sections/lead-section";
import { FaqBand, IncludesAndFits, PricesBand } from "@/components/sections/service-blocks";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { blogText, readingFor } from "@/content/articles";
import { catalogText } from "@/content/catalog";
import { tasksOf } from "@/content/tasks";
import type { TaskPage } from "@/content/types";
import { uk } from "@/content/uk";
import { articleCard, industriesWith, serviceCard } from "@/lib/catalog";
import { breadcrumbJsonLd, faqJsonLd, pageUrl, serviceJsonLd } from "@/lib/seo";

import { siteConfig } from "../../../../site.config";

/** Page of one concrete task: what hurts today, how the automation works, for whom. */
export function TaskView({ task }: { task: TaskPage }) {
  const t = uk.servicePage;
  const text = catalogText.task;
  const { siteUrl, brand, prices } = siteConfig;
  const home = pageUrl(siteUrl, "/");
  const hub = pageUrl(siteUrl, "/poslugy/");
  const url = pageUrl(siteUrl, `/poslugy/${task.slug}/`);
  const parent = uk.solutions.items.find((item) => item.slug === task.parent);
  const faq = task.faq.map((item) => ({ question: item.question, answer: [item.answer] }));
  const industries = industriesWith(task.slug);
  const siblings = tasksOf(task.parent).map((item) => item.slug);
  const reading = readingFor([task.slug, task.parent, ...siblings], 3).map((item) => articleCard(item.slug));
  const related = [
    ...tasksOf(task.parent)
      .filter((item) => item.slug !== task.slug)
      .slice(0, 5)
      .map((item) => serviceCard(item.slug)),
    ...(parent ? [serviceCard(parent.slug)] : []),
  ];

  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: task.h1,
          description: task.metaDescription,
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
          ...(parent
            ? [{ name: parent.short, url: pageUrl(siteUrl, `/poslugy/${parent.slug}/`) }]
            : []),
          { name: task.short, url },
        ])}
      />
      <JsonLd data={faqJsonLd(faq)} />

      <SiteHeader />
      <main>
        <PageHero
          crumbs={[
            { label: t.home, href: "/" },
            { label: t.services, href: "/poslugy/" },
            ...(parent ? [{ label: parent.short, href: `/poslugy/${parent.slug}/` }] : []),
            { label: task.short },
          ]}
          eyebrow={text.eyebrow}
          title={task.h1}
          intro={task.intro}
          pricesLink
          aside={<OutcomeCard outcome={task.outcome} integrations={task.integrations} />}
        />

        <section className="band border-y border-border bg-card">
          <div className="shell grid gap-x-16 gap-y-7 lg:grid-cols-[0.8fr_1.2fr]">
            <h2 className="h2">{text.painsTitle}</h2>
            <ul>
              {task.pains.map((line) => (
                <li
                  key={line}
                  className="flex gap-4 border-t border-border-strong py-4 text-[1.0625rem] leading-normal last:border-b"
                >
                  <span aria-hidden="true" className="mt-[0.7rem] h-0.5 w-4 shrink-0 bg-amber" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="band">
          <div className="shell">
            <h2 className="h2">{text.stepsTitle}</h2>
            <ol className="mt-8 border-b border-border-strong">
              {task.steps.map((step, i) => (
                <li
                  key={step.title}
                  className="grid gap-x-8 gap-y-1.5 border-t border-border-strong py-5 sm:grid-cols-[3rem_1fr] lg:grid-cols-[3.5rem_19rem_1fr]"
                >
                  <p aria-hidden="true" className="font-display text-[0.9375rem] font-semibold text-signal sm:pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-[1.1875rem] leading-snug font-bold">{step.title}</h3>
                  <p className="leading-[1.6] text-muted-foreground sm:col-start-2 lg:col-start-3">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <IncludesAndFits includes={task.includes} fits={task.fits} />
        <FaqBand title={t.faqTitle} name="task-faq" items={faq} />
        <PricesBand />

        {industries.length ? (
          <section className="band">
            <div className="shell">
              <h2 className="h2">{text.industriesTitle}</h2>
              <LinkCards items={industries} tone="card" className="mt-7" />
            </div>
          </section>
        ) : null}

        <section className="band border-t border-border bg-card">
          <div className="shell">
            <h2 className="h2">{text.relatedTitle}</h2>
            <LinkCards items={related} className="mt-7" />
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
