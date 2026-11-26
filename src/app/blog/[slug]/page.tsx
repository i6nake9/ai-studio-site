import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "@/components/breadcrumbs";
import { ctaCompact, ctaPrimary } from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { LeadButton } from "@/components/lead/lead-button";
import { LinkCards } from "@/components/link-cards";
import { MobileBar } from "@/components/mobile-bar";
import { LeadSection } from "@/components/sections/lead-section";
import { FaqBand } from "@/components/sections/service-blocks";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { articles, blogText, findArticle, relatedArticles } from "@/content/articles";
import { uk } from "@/content/uk";
import { anchorId } from "@/lib/anchor";
import { articleCard, serviceCard } from "@/lib/catalog";
import { formatDateUk } from "@/lib/format";
import { pageMeta } from "@/lib/page-meta";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd, pageUrl } from "@/lib/seo";
import { cn } from "@/lib/utils";

import { siteConfig } from "../../../../site.config";

// Only the articles from the content file exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) return {};
  const meta = pageMeta(`/blog/${article.slug}/`, article.metaTitle, article.metaDescription);
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: "article",
      publishedTime: article.published,
      modifiedTime: article.updated ?? article.published,
    },
  };
}

const paragraph = "text-[1.0625rem] leading-[1.65]";

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = findArticle(slug);
  if (!article) notFound();

  const t = uk.servicePage;
  const { siteUrl, brand } = siteConfig;
  const home = pageUrl(siteUrl, "/");
  const url = pageUrl(siteUrl, `/blog/${article.slug}/`);
  const faq = article.faq.map((item) => ({ question: item.question, answer: [item.answer] }));
  const related = article.related.map((service) => serviceCard(service));
  const others = relatedArticles(article.slug, 3).map((item) => articleCard(item.slug));
  const toc = article.sections.map((section) => ({ id: anchorId(section.title), title: section.title }));

  return (
    <>
      <JsonLd
        data={articleJsonLd({
          headline: article.title,
          description: article.metaDescription,
          url,
          published: article.published,
          modified: article.updated,
          publisherName: brand,
          publisherUrl: home,
          logo: `${siteUrl}/og.png`,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: t.home, url: home },
          { name: blogText.crumb, url: pageUrl(siteUrl, "/blog/") },
          { name: article.title, url },
        ])}
      />
      <JsonLd data={faqJsonLd(faq)} />

      <SiteHeader />
      <main>
        <article className="pt-6 pb-14 sm:pt-8 sm:pb-[4.5rem]">
          <div className="shell">
            <Breadcrumbs
              crumbs={[
                { label: t.home, href: "/" },
                { label: blogText.crumb, href: "/blog/" },
                { label: article.title },
              ]}
            />
            <header className="mt-5 max-w-[50rem] lg:mt-8">
              <p className="eyebrow">{blogText.eyebrow}</p>
              <h1 className="mt-4 text-[1.875rem] leading-[1.08] font-bold tracking-[-0.03em] sm:text-[2.5rem] lg:text-[2.875rem]">
                {article.title}
              </h1>
              <p className="mt-4 text-[0.90625rem] text-subtle">
                {blogText.publishedLabel}{" "}
                <time dateTime={article.published}>{formatDateUk(article.published)}</time>
                {article.updated && article.updated !== article.published ? (
                  <>
                    {" · "}
                    {blogText.updatedLabel}{" "}
                    <time dateTime={article.updated}>{formatDateUk(article.updated)}</time>
                  </>
                ) : null}
                {" · "}
                {brand}
              </p>
            </header>

            <div className="mt-8 grid items-start gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,1fr)_19rem]">
              <div className="max-w-[45rem]">
                <div className="rounded-[0.875rem] border border-border bg-card p-5 sm:p-6">
                  <p className="label">{blogText.summaryLabel}</p>
                  <p className="mt-2.5 text-[1.0625rem] leading-[1.6] font-medium sm:text-[1.125rem]">
                    {article.summary}
                  </p>
                </div>

                <nav aria-labelledby="toc-title" className="mt-8">
                  <p id="toc-title" className="label">
                    {blogText.tocLabel}
                  </p>
                  <ol className="mt-3 space-y-1.5">
                    {toc.map((item, i) => (
                      <li key={item.id} className="flex gap-3 text-[1rem] leading-snug">
                        <span aria-hidden="true" className="w-5 shrink-0 text-subtle tabular-nums">
                          {i + 1}.
                        </span>
                        <a
                          href={`#${item.id}`}
                          className="font-medium underline decoration-border-strong underline-offset-4 hover:text-signal hover:decoration-signal"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>

                {article.sections.map((section) => (
                  <section key={section.title} className="mt-10 scroll-mt-24" id={anchorId(section.title)}>
                    <h2 className="text-[1.4375rem] leading-tight font-bold tracking-[-0.02em] sm:text-[1.75rem]">
                      {section.title}
                    </h2>
                    {section.text?.map((line) => (
                      <p key={line} className={cn(paragraph, "mt-4")}>
                        {line}
                      </p>
                    ))}
                    {section.list ? (
                      <ul className="mt-5 border-b border-border-strong">
                        {section.list.map((line) => (
                          <li
                            key={line}
                            className={cn(paragraph, "flex gap-4 border-t border-border-strong py-3")}
                          >
                            <span
                              aria-hidden="true"
                              className="mt-[0.8rem] h-0.5 w-4 shrink-0 bg-signal"
                            />
                            {line}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    {section.table ? (
                      <div className="mt-5 overflow-x-auto rounded-[0.875rem] border border-border">
                        <table className="w-full min-w-[32rem] border-collapse text-left text-[0.9375rem] leading-snug">
                          <thead className="bg-card">
                            <tr>
                              {section.table.head.map((cell) => (
                                <th key={cell} scope="col" className="border-b border-border-strong px-4 py-3 font-semibold">
                                  {cell}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {section.table.rows.map((row) => (
                              <tr key={row.join("|")} className="border-t border-border first:border-t-0">
                                {row.map((cell, i) =>
                                  i === 0 ? (
                                    <th key={i} scope="row" className="px-4 py-3 align-top font-semibold">
                                      {cell}
                                    </th>
                                  ) : (
                                    <td key={i} className="px-4 py-3 align-top">
                                      {cell}
                                    </td>
                                  ),
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : null}
                    {section.after?.map((line) => (
                      <p key={line} className={cn(paragraph, "mt-4")}>
                        {line}
                      </p>
                    ))}
                  </section>
                ))}
              </div>

              <aside className="space-y-4 lg:sticky lg:top-24">
                <div className="on-dark rounded-[0.875rem] p-6">
                  <p className="text-[1.1875rem] leading-snug font-bold">{blogText.aside.title}</p>
                  <p className="mt-2.5 text-[0.9375rem] leading-normal text-muted-foreground">
                    {blogText.aside.text}
                  </p>
                  <LeadButton className={cn(ctaPrimary, ctaCompact, "mt-5 w-full")}>
                    {blogText.aside.button}
                  </LeadButton>
                </div>
                <nav
                  aria-label={blogText.relatedTitle}
                  className="rounded-[0.875rem] border border-border bg-card p-6"
                >
                  <p className="label">{blogText.relatedTitle}</p>
                  <ul className="mt-2">
                    {related.map((item) => (
                      <li key={item.href} className="border-b border-border last:border-b-0">
                        <Link
                          href={item.href}
                          className="flex min-h-11 items-center py-2 leading-snug font-semibold hover:text-signal"
                        >
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>
            </div>
          </div>
        </article>

        <div className="border-t border-border bg-card">
          <FaqBand title={blogText.faqTitle} name="article-faq" items={faq} />
        </div>

        <section className="band border-t border-border">
          <div className="shell">
            <h2 className="h2">{blogText.relatedTitle}</h2>
            <LinkCards items={related} tone="card" className="mt-7" />
          </div>
        </section>

        <section className="band border-t border-border bg-card">
          <div className="shell">
            <h2 className="h2">{blogText.moreTitle}</h2>
            <LinkCards items={others} className="mt-7" />
            <Link
              href="/blog/"
              className="mt-4 inline-flex min-h-11 items-center font-semibold underline decoration-primary decoration-2 underline-offset-[5px] hover:text-signal"
            >
              {blogText.all} →
            </Link>
          </div>
        </section>

        <LeadSection />
      </main>
      <SiteFooter />
      <MobileBar />
    </>
  );
}
