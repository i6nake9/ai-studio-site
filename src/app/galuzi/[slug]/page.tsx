import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/json-ld";
import { LinkCards } from "@/components/link-cards";
import { MobileBar } from "@/components/mobile-bar";
import { PageHero } from "@/components/page-hero";
import { LeadSection } from "@/components/sections/lead-section";
import { FaqBand, PricesBand } from "@/components/sections/service-blocks";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { blogText, readingFor } from "@/content/articles";
import { catalogText } from "@/content/catalog";
import { findIndustry, industries } from "@/content/industries";
import { uk } from "@/content/uk";
import { articleCard, industryCard, serviceCard } from "@/lib/catalog";
import { pageMeta } from "@/lib/page-meta";
import { breadcrumbJsonLd, faqJsonLd, pageUrl } from "@/lib/seo";

import { siteConfig } from "../../../../site.config";

// Only the industries from the content file exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return industries.map((item) => ({ slug: item.slug }));
}

interface IndustryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = findIndustry(slug);
  if (!industry) return {};
  return pageMeta(`/galuzi/${industry.slug}/`, industry.metaTitle, industry.metaDescription);
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { slug } = await params;
  const industry = findIndustry(slug);
  if (!industry) notFound();

  const t = uk.servicePage;
  const text = catalogText.industry;
  const { siteUrl } = siteConfig;
  const faq = industry.faq.map((item) => ({ question: item.question, answer: [item.answer] }));
  const services = industry.services.map((link) => serviceCard(link.slug, link.why));
  const reading = readingFor(
    industry.services.map((link) => link.slug),
    3,
  ).map((item) => articleCard(item.slug));
  const others = industries
    .filter((item) => item.slug !== industry.slug)
    .map((item) => industryCard(item.slug));

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t.home, url: pageUrl(siteUrl, "/") },
          { name: text.crumb, url: pageUrl(siteUrl, "/galuzi/") },
          { name: industry.short, url: pageUrl(siteUrl, `/galuzi/${industry.slug}/`) },
        ])}
      />
      <JsonLd data={faqJsonLd(faq)} />

      <SiteHeader />
      <main>
        <PageHero
          crumbs={[
            { label: t.home, href: "/" },
            { label: text.crumb, href: "/galuzi/" },
            { label: industry.short },
          ]}
          eyebrow={text.eyebrow}
          title={industry.h1}
          intro={industry.intro}
          pricesLink
          aside={
            <>
              <p className="label">{text.startLabel}</p>
              <p className="mt-2 text-[1.0625rem] leading-normal font-medium">{industry.start}</p>
            </>
          }
        />

        <section className="band border-y border-border bg-card">
          <div className="shell">
            <h2 className="h2">{text.painsTitle}</h2>
            <ul className="mt-9 grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
              {industry.pains.map((item) => (
                <li key={item.title} className="border-t-2 border-foreground pt-[1.125rem]">
                  <h3 className="text-[1.1875rem] leading-tight font-bold">{item.title}</h3>
                  <p className="mt-2.5 text-[0.96875rem] leading-[1.55] text-muted-foreground">
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="band">
          <div className="shell">
            <h2 className="h2">{text.servicesTitle}</h2>
            <p className="mt-2.5 text-muted-foreground">{text.servicesLead}</p>
            <ul className="mt-7 border-b border-border-strong">
              {services.map((item) => (
                <li key={item.href} className="border-t border-border-strong">
                  <Link
                    href={item.href}
                    className="group grid items-baseline gap-x-10 gap-y-1 py-5 lg:grid-cols-[21rem_1fr_auto]"
                  >
                    <span className="text-[1.1875rem] leading-snug font-bold group-hover:text-signal">
                      {item.title}
                    </span>
                    <span className="leading-normal text-muted-foreground">{item.text}</span>
                    <span aria-hidden="true" className="hidden font-semibold text-signal lg:block">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <PricesBand />
        <FaqBand title={text.faqTitle} name="industry-faq" items={faq} />

        <section className="band border-t border-border bg-card">
          <div className="shell">
            <h2 className="h2">{text.otherTitle}</h2>
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
