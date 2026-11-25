import type { Metadata } from "next";
import Link from "next/link";

import { linkAccent } from "@/components/cta";
import { CheckIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { MobileBar } from "@/components/mobile-bar";
import { PageHero } from "@/components/page-hero";
import { LeadSection } from "@/components/sections/lead-section";
import { FaqBand } from "@/components/sections/service-blocks";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { pricingPage } from "@/content/pricing";
import { uk } from "@/content/uk";
import { serviceCard } from "@/lib/catalog";
import { pageMeta } from "@/lib/page-meta";
import { breadcrumbJsonLd, faqJsonLd, pageUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";

import { siteConfig } from "../../../site.config";

const text = pricingPage;

export const metadata: Metadata = pageMeta("/ciny/", text.metaTitle, text.metaDescription);

/** Prices in full: what each format includes, what moves the price, what is paid apart. */
export default function PricingPage() {
  const t = uk.servicePage;
  const { siteUrl } = siteConfig;
  const faq = text.faq.map((item) => ({ question: item.question, answer: [item.answer] }));
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t.home, url: pageUrl(siteUrl, "/") },
          { name: text.eyebrow, url: pageUrl(siteUrl, "/ciny/") },
        ])}
      />
      <JsonLd data={faqJsonLd(faq)} />

      <SiteHeader />
      <main>
        <PageHero
          crumbs={[{ label: t.home, href: "/" }, { label: text.eyebrow }]}
          eyebrow={text.eyebrow}
          title={text.h1}
          intro={text.intro}
        />

        <section id="prices" className="band border-y border-border bg-card">
          <div className="shell">
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {text.formats.map((item) => (
                <li
                  key={item.title}
                  className={cn(
                    "flex flex-col rounded-xl border p-[1.375rem]",
                    item.badge ? "on-dark border-background" : "border-border bg-background",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="leading-snug font-bold">{item.title}</h2>
                    {item.badge ? (
                      <span className="rounded-md bg-primary px-2 py-0.5 text-[0.78125rem] font-semibold text-primary-foreground">
                        {item.badge}
                      </span>
                    ) : null}
                  </div>
                  <p
                    className={cn(
                      "mt-2 font-display text-[1.6875rem] leading-tight font-semibold tracking-[-0.02em]",
                      item.badge && "text-signal",
                    )}
                  >
                    {item.price}
                  </p>
                  <p className="mt-2 text-[0.90625rem] leading-normal text-muted-foreground">
                    {item.text}
                  </p>
                  <p className="label mt-5 border-t border-border pt-4">{text.includesLabel}</p>
                  <ul className="mt-3 space-y-2.5 text-[0.9375rem] leading-normal">
                    {item.includes.map((line) => (
                      <li key={line} className="flex gap-2.5">
                        <CheckIcon className="mt-1 size-4 shrink-0 text-signal" />
                        {line}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
            <Link href="/#calculator" className={`${linkAccent} mt-5`}>
              {text.calculatorLink} →
            </Link>
          </div>
        </section>

        <section className="band">
          <div className="shell grid gap-x-16 gap-y-12 lg:grid-cols-2">
            <div>
              <h2 className="h2">{text.factors.title}</h2>
              <ul className="mt-6 border-b border-border-strong">
                {text.factors.items.map((line) => (
                  <li
                    key={line}
                    className="flex gap-4 border-t border-border-strong py-3.5 leading-normal"
                  >
                    <span aria-hidden="true" className="mt-[0.7rem] h-0.5 w-4 shrink-0 bg-signal" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="h2">{text.extra.title}</h2>
              <p className="mt-2.5 text-muted-foreground">{text.extra.lead}</p>
              <ul className="mt-4 border-b border-border-strong">
                {text.extra.items.map((line) => (
                  <li
                    key={line}
                    className="flex gap-4 border-t border-border-strong py-3.5 leading-normal"
                  >
                    <span aria-hidden="true" className="mt-[0.7rem] h-0.5 w-4 shrink-0 bg-amber" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="band border-y border-border bg-card">
          <div className="shell">
            <h2 className="h2">{text.examples.title}</h2>
            <p className="mt-2.5 text-muted-foreground">{text.examples.lead}</p>
            <div className="mt-8 grid gap-x-16 gap-y-10 lg:grid-cols-2">
              {text.examples.items.map((group) => (
                <div key={group.format}>
                  <h3 className="text-[1.1875rem] leading-snug font-bold">{group.format}</h3>
                  <ul className="mt-3 border-b border-border-strong">
                    {group.slugs.map((slug) => {
                      const card = serviceCard(slug);
                      return (
                        <li key={slug} className="border-t border-border-strong">
                          <Link
                            href={card.href}
                            className="group flex min-h-12 items-center justify-between gap-4 py-2.5 leading-snug font-semibold hover:text-signal"
                          >
                            {card.title}
                            <span aria-hidden="true" className="text-signal">
                              →
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <FaqBand title={text.faqTitle} name="pricing-faq" items={faq} />
        <LeadSection />
      </main>
      <SiteFooter />
      <MobileBar />
    </>
  );
}
