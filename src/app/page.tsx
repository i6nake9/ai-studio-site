import type { Metadata } from "next";

import { JsonLd } from "@/components/json-ld";
import { MobileBar } from "@/components/mobile-bar";
import { BlogTeaser } from "@/components/sections/blog-teaser";
import { Comparison } from "@/components/sections/comparison";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { LeadSection } from "@/components/sections/lead-section";
import { OwnProjects } from "@/components/sections/own-projects";
import { Pains } from "@/components/sections/pains";
import { Process } from "@/components/sections/process";
import { RoiCalculator } from "@/components/sections/roi-calculator";
import { Scenarios } from "@/components/sections/scenarios";
import { Solutions } from "@/components/sections/solutions";
import { TaskCatalog } from "@/components/sections/task-catalog";
import { Trust } from "@/components/sections/trust";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { uk } from "@/content/uk";
import { telegramProfileUrl } from "@/lib/contacts";
import { pageMeta } from "@/lib/page-meta";
import { faqJsonLd, organizationJsonLd, pageUrl, websiteJsonLd } from "@/lib/seo";

import { siteConfig } from "../../site.config";

export const metadata: Metadata = pageMeta("/", uk.meta.title, uk.meta.description);

export default function HomePage() {
  const home = pageUrl(siteConfig.siteUrl, "/");
  return (
    <>
      <JsonLd
        data={organizationJsonLd({
          name: siteConfig.brand,
          url: home,
          description: uk.meta.description,
          logo: `${siteConfig.siteUrl}/og.png`,
          telegramUrl: telegramProfileUrl,
          email: siteConfig.email,
          knowsAbout: [
            "Автоматизація бізнес-процесів",
            "ШІ-агенти",
            "Чат-боти для Telegram та Instagram",
            "Інтеграція CRM з Новою Поштою",
            "Інтеграція з 1С і BAS",
            "Моніторинг і парсинг цін конкурентів",
            "Розпізнавання документів",
          ],
        })}
      />
      <JsonLd data={websiteJsonLd({ name: siteConfig.brand, url: home })} />
      <JsonLd data={faqJsonLd(uk.faq.items)} />
      <SiteHeader home />
      <main id="top">
        <Hero />
        <Trust />
        <Pains />
        <Solutions />
        <TaskCatalog />
        <RoiCalculator />
        <Process />
        <Scenarios />
        <OwnProjects />
        <Comparison />
        <BlogTeaser />
        <Faq />
        <LeadSection />
      </main>
      <SiteFooter />
      <MobileBar />
    </>
  );
}
