import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/json-ld";
import { MobileBar } from "@/components/mobile-bar";
import { PageHero } from "@/components/page-hero";
import { LeadSection } from "@/components/sections/lead-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { articles, blogText, findArticle } from "@/content/articles";
import { uk } from "@/content/uk";
import { formatDateUk } from "@/lib/format";
import { pageMeta } from "@/lib/page-meta";
import { blogJsonLd, breadcrumbJsonLd, pageUrl } from "@/lib/seo";

import { siteConfig } from "../../../site.config";

export const metadata: Metadata = pageMeta("/blog/", blogText.metaTitle, blogText.metaDescription);

/** Index of the blog: every article as a row with its short description. */
export default function BlogIndexPage() {
  const t = uk.servicePage;
  const { siteUrl, brand } = siteConfig;
  return (
    <>
      <JsonLd
        data={blogJsonLd({
          name: blogText.h1,
          url: pageUrl(siteUrl, "/blog/"),
          publisherName: brand,
          posts: articles.map((article) => ({
            headline: article.title,
            url: pageUrl(siteUrl, `/blog/${article.slug}/`),
            published: article.published,
            modified: article.updated,
          })),
        })}
      />
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

        <section className="band border-t border-border">
          <div className="shell">
            <h2 className="h2">{blogText.start.title}</h2>
            <ul className="mt-6 grid gap-4 lg:grid-cols-3">
              {blogText.start.items.map((item) => {
                const article = findArticle(item.slug);
                if (!article) return null;
                return (
                  <li key={item.slug}>
                    <Link
                      href={`/blog/${article.slug}/`}
                      className="group block h-full rounded-[0.875rem] border border-border bg-card p-5 hover:border-signal"
                    >
                      <span className="block leading-snug font-bold group-hover:text-signal">{article.title}</span>
                      <span className="mt-2 block text-[0.9375rem] leading-normal text-muted-foreground">
                        {item.why}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

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
                      dateTime={article.updated ?? article.published}
                      className="text-[0.90625rem] whitespace-nowrap text-subtle"
                    >
                      {formatDateUk(article.updated ?? article.published)}
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
