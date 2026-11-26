/** Builders for the structured data (JSON-LD) that search engines read. */

const CONTEXT = "https://schema.org";

/** Absolute address of a page: single slashes, always a trailing slash. */
export function pageUrl(siteUrl: string, path: string): string {
  const base = siteUrl.replace(/\/+$/, "");
  const clean = path.replace(/^\/+|\/+$/g, "");
  return clean ? `${base}/${clean}/` : `${base}/`;
}

interface FaqItem {
  question: string;
  answer: string[];
  list?: string[];
}

/** Ends a line with a full stop unless it already ends a sentence. */
function sentence(line: string): string {
  const text = line.trim();
  return /[.!?…:]$/.test(text) ? text.replace(/:$/, ".") : `${text}.`;
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: [...item.answer, ...(item.list ?? [])].map(sentence).join(" "),
      },
    })),
  };
}

interface ServiceInput {
  name: string;
  description: string;
  url: string;
  providerName: string;
  providerUrl: string;
  priceFromUsd: number;
  priceToUsd: number;
}

export function serviceJsonLd(service: ServiceInput) {
  return {
    "@context": CONTEXT,
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: service.url,
    areaServed: { "@type": "Country", name: "UA" },
    provider: {
      "@type": "Organization",
      name: service.providerName,
      url: service.providerUrl,
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: service.priceFromUsd,
      highPrice: service.priceToUsd,
    },
  };
}

export function breadcrumbJsonLd(crumbs: { name: string; url: string }[]) {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

interface OrganizationInput {
  name: string;
  url: string;
  description: string;
  logo: string;
  telegramUrl?: string | null;
  email?: string;
  /** Topics the studio works on, for search engines and AI assistants. */
  knowsAbout?: string[];
}

export function organizationJsonLd(org: OrganizationInput) {
  const email = org.email?.trim();
  return {
    "@context": CONTEXT,
    "@type": "Organization",
    name: org.name,
    url: org.url,
    description: org.description,
    logo: org.logo,
    areaServed: { "@type": "Country", name: "UA" },
    ...(org.telegramUrl
      ? {
          sameAs: [org.telegramUrl],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            url: org.telegramUrl,
            availableLanguage: ["uk"],
          },
        }
      : {}),
    ...(org.knowsAbout?.length ? { knowsAbout: org.knowsAbout } : {}),
    ...(email ? { email } : {}),
  };
}

/** JSON for a <script type="application/ld+json">: it can never close the tag. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

interface ArticleInput {
  headline: string;
  description: string;
  url: string;
  /** YYYY-MM-DD. */
  published: string;
  /** YYYY-MM-DD; the day of publication when left out. */
  modified?: string;
  publisherName: string;
  publisherUrl: string;
  logo: string;
}

export function articleJsonLd(article: ArticleInput) {
  const studio = {
    "@type": "Organization",
    name: article.publisherName,
    url: article.publisherUrl,
  };
  return {
    "@context": CONTEXT,
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    inLanguage: "uk",
    url: article.url,
    mainEntityOfPage: article.url,
    datePublished: article.published,
    dateModified: article.modified ?? article.published,
    author: studio,
    publisher: { ...studio, logo: { "@type": "ImageObject", url: article.logo } },
  };
}

export function websiteJsonLd(site: { name: string; url: string }) {
  return {
    "@context": CONTEXT,
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    inLanguage: "uk",
  };
}

interface BlogInput {
  name: string;
  url: string;
  publisherName: string;
  posts: { headline: string; url: string; published: string; modified?: string }[];
}

/** The blog index: the list of posts, so search engines see them as one blog. */
export function blogJsonLd(blog: BlogInput) {
  return {
    "@context": CONTEXT,
    "@type": "Blog",
    name: blog.name,
    url: blog.url,
    inLanguage: "uk",
    publisher: { "@type": "Organization", name: blog.publisherName },
    blogPost: blog.posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.headline,
      url: post.url,
      datePublished: post.published,
      dateModified: post.modified ?? post.published,
    })),
  };
}
