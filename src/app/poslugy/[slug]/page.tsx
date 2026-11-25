import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ctaPrimary, linkAccent } from "@/components/cta";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { JsonLd } from "@/components/json-ld";
import { LeadButton } from "@/components/lead/lead-button";
import { MobileBar } from "@/components/mobile-bar";
import { FaqList } from "@/components/sections/faq";
import { LeadSection } from "@/components/sections/lead-section";
import { PriceCards, ProcessSteps } from "@/components/sections/process";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { uk } from "@/content/uk";
import { pageMeta } from "@/lib/page-meta";
import { breadcrumbJsonLd, faqJsonLd, pageUrl, serviceJsonLd } from "@/lib/seo";

import { siteConfig } from "../../../../site.config";

const services = uk.solutions.items;

// Only the services from the dictionary exist; any other address is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return {};
  return pageMeta(
    `/poslugy/${service.slug}/`,
    service.page.metaTitle,
    service.page.metaDescription,
  );
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  const t = uk.servicePage;
  const labels = uk.solutions;
  const { siteUrl, brand, prices } = siteConfig;
  const home = pageUrl(siteUrl, "/");
  const url = pageUrl(siteUrl, `/poslugy/${service.slug}/`);
  const faq = service.page.faq.map((item) => ({
    question: item.question,
    answer: [item.answer],
  }));
  const others = services.filter((item) => item.slug !== service.slug);

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
          { name: service.short, url },
        ])}
      />
      <JsonLd data={faqJsonLd(faq)} />

      <SiteHeader />
      <main>
        <section className="pt-6 pb-12 sm:pt-8 sm:pb-16">
          <div className="shell">
            <nav aria-label={t.breadcrumbLabel} className="text-[0.90625rem] text-subtle">
              <ol className="flex flex-wrap items-center gap-x-2">
                <li>
                  <Link href="/" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-foreground">
                    {t.home}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/#services" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-foreground">
                    {t.services}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li aria-current="page" className="text-foreground">
                  {service.short}
                </li>
              </ol>
            </nav>

            <div className="mt-5 grid items-start gap-x-16 gap-y-9 lg:mt-8 lg:grid-cols-[1.15fr_0.85fr]">
              <div>
                <p className="eyebrow">{t.eyebrow}</p>
                <h1 className="mt-4 text-[1.875rem] leading-[1.08] font-bold tracking-[-0.03em] sm:text-[2.5rem] lg:text-[2.875rem]">
                  {service.page.h1}
                </h1>
                <p className="mt-5 max-w-[38rem] text-[1.0625rem] text-muted-foreground sm:text-[1.1875rem]">
                  {service.page.intro}
                </p>
                <div className="mt-7 flex flex-col gap-x-6 gap-y-2 sm:flex-row sm:items-center">
                  <LeadButton className={ctaPrimary}>
                    {t.cta}
                    <ArrowIcon className="size-[1.125rem]" />
                  </LeadButton>
                  <a href="#prices" className={`${linkAccent} justify-center`}>
                    {t.pricesLink}
                  </a>
                </div>
              </div>

              <div className="rounded-[0.875rem] border border-border bg-card p-6 lg:mt-9">
                <p className="label">{labels.outcomeLabel}</p>
                <p className="mt-2 text-[1.0625rem] leading-normal font-medium">
                  {service.outcome}
                </p>
                <p className="label mt-5 border-t border-border pt-5">
                  {labels.integratesLabel}
                </p>
                <ul className="mt-2.5 flex flex-wrap gap-1.5">
                  {service.integrations.map((name) => (
                    <li
                      key={name}
                      className="rounded-md bg-signal-soft px-2.5 py-1 text-sm font-medium text-signal"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="band border-y border-border bg-card">
          <div className="shell grid gap-x-16 gap-y-10 lg:grid-cols-2">
            <div>
              <h2 className="h2">{t.includesTitle}</h2>
              <ul className="mt-6 space-y-3.5">
                {service.includes.map((line) => (
                  <li key={line} className="flex gap-3">
                    <CheckIcon className="mt-1.5 size-4 shrink-0 text-signal" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="h2">{t.fitsTitle}</h2>
              <ul className="mt-6">
                {service.page.fits.map((line) => (
                  <li key={line} className="border-t border-border-strong py-3.5 last:border-b">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="band">
          <div className="shell">
            <h2 className="h2">{t.processTitle}</h2>
            <div className="mt-8">
              <ProcessSteps />
            </div>
          </div>
        </section>

        <section id="prices" className="band border-y border-border bg-card">
          <div className="shell">
            <h2 className="h2">{t.pricesTitle}</h2>
            <p className="mt-2.5 text-muted-foreground">{t.pricesLead}</p>
            <div className="mt-8">
              <PriceCards />
            </div>
          </div>
        </section>

        <section className="band">
          <div className="shell grid gap-x-16 gap-y-7 lg:grid-cols-[0.8fr_1.2fr]">
            <h2 className="h2">{t.faqTitle}</h2>
            <FaqList name="service-faq" items={faq} />
          </div>
        </section>

        <section className="band border-t border-border bg-card">
          <div className="shell">
            <h2 className="h2">{t.otherTitle}</h2>
            <ul className="mt-7 grid gap-4 md:grid-cols-3">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/poslugy/${item.slug}/`}
                    className="group flex h-full flex-col gap-2 rounded-xl border border-border bg-background p-5 hover:border-signal"
                  >
                    <span className="text-lg leading-snug font-bold group-hover:text-signal">
                      {item.short}
                    </span>
                    <span className="text-[0.9375rem] leading-normal text-muted-foreground">
                      {item.summary}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <LeadSection />
      </main>
      <SiteFooter />
      <MobileBar />
    </>
  );
}
