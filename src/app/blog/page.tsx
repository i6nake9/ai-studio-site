import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { MobileBar } from "@/components/mobile-bar";
import { PageHero } from "@/components/page-hero";
import { LeadSection } from "@/components/sections/lead-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { articles, blogText } from "@/content/articles";
import { uk } from "@/content/uk";
import { formatDateUk } from "@/lib/format";
import { pageMeta } from "@/lib/page-meta";
import { breadcrumbJsonLd, pageUrl } from "@/lib/seo";

import { siteConfig } from "../../../site.config";

export const metadata: Metadata = pageMeta("/blog/", blogText.metaTitle, blogText.metaDescription);

/** Index of the blog: every article as a row with its short description. */
export default function BlogIndexPage() {
  const t = uk.servicePage;
  const { siteUrl } = siteConfig;
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t.home, url: pageUrl(siteUrl, "/") },
          { name: blogText.crumb, url: pageUrl(siteUrl, "/blog/") },
        ])}
      />
      <SiteHeader />
      <main>
        <PageHero
          crumbs={[{ label: t.home, href: "/" }, { label: blogText.crumb }]}
          eyebrow={blogText.eyebrow}
          title={blogText.h1}
          intro={blogText.intro}
        />

        <section className="band border-t border-border bg-card">
          <div className="shell">
            <ul className="border-b border-border-strong">
              {articles.map((article) => (
                <li key={article.slug} className="border-t border-border-strong">
                  <Link
                    href={`/blog/${article.slug}/`}
                    className="group grid items-baseline gap-x-10 gap-y-1.5 py-6 lg:grid-cols-[1.1fr_1fr_auto]"
                  >
                    <h2 className="text-[1.25rem] leading-snug font-bold group-hover:text-signal sm:text-[1.375rem]">
                      {article.title}
                    </h2>
                    <span className="leading-normal text-muted-foreground">{article.card}</span>
                    <time
                      dateTime={article.published}
                      className="text-[0.90625rem] whitespace-nowrap text-subtle"
                    >
                      {formatDateUk(article.published)}
                    </time>
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
