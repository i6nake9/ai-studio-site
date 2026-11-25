import { expect, test } from "vitest";

import {
  breadcrumbJsonLd,
  faqJsonLd,
  jsonLdScript,
  organizationJsonLd,
  pageUrl,
  serviceJsonLd,
} from "./seo";

test("pageUrl joins the site address and a path with single slashes and a trailing slash", () => {
  expect(pageUrl("https://x.test", "/")).toBe("https://x.test/");
  expect(pageUrl("https://x.test/sub", "/poslugy/a/")).toBe("https://x.test/sub/poslugy/a/");
  expect(pageUrl("https://x.test/", "poslugy/a")).toBe("https://x.test/poslugy/a/");
});

test("faqJsonLd puts every paragraph and list line of an answer into one text", () => {
  const data = faqJsonLd([
    { question: "Скільки коштує?", answer: ["Залежить від обсягу."], list: ["Пілот — $500", "Проєкт — від $2 000"] },
    { question: "Чи міняти CRM?", answer: ["Ні.", "Підключаємось через API."] },
  ]);
  expect(data["@type"]).toBe("FAQPage");
  expect(data.mainEntity).toEqual([
    {
      "@type": "Question",
      name: "Скільки коштує?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Залежить від обсягу. Пілот — $500. Проєкт — від $2 000.",
      },
    },
    {
      "@type": "Question",
      name: "Чи міняти CRM?",
      acceptedAnswer: { "@type": "Answer", text: "Ні. Підключаємось через API." },
    },
  ]);
});

test("serviceJsonLd carries the provider, the country and the price range in USD", () => {
  const data = serviceJsonLd({
    name: "Моніторинг цін конкурентів",
    description: "Щоденний збір цін.",
    url: "https://x.test/poslugy/a/",
    providerName: "Nerutyna",
    providerUrl: "https://x.test/",
    priceFromUsd: 500,
    priceToUsd: 1500,
  });
  expect(data).toMatchObject({
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Моніторинг цін конкурентів",
    url: "https://x.test/poslugy/a/",
    areaServed: { "@type": "Country", name: "UA" },
    provider: { "@type": "Organization", name: "Nerutyna", url: "https://x.test/" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: 500,
      highPrice: 1500,
    },
  });
});

test("breadcrumbJsonLd numbers positions from 1", () => {
  const data = breadcrumbJsonLd([
    { name: "Головна", url: "https://x.test/" },
    { name: "Послуга", url: "https://x.test/poslugy/a/" },
  ]);
  expect(data.itemListElement).toEqual([
    { "@type": "ListItem", position: 1, name: "Головна", item: "https://x.test/" },
    { "@type": "ListItem", position: 2, name: "Послуга", item: "https://x.test/poslugy/a/" },
  ]);
});

test("organizationJsonLd lists only the contacts that exist", () => {
  const bare = organizationJsonLd({ name: "Nerutyna", url: "https://x.test/", description: "d", logo: "https://x.test/og.png" });
  expect(bare).not.toHaveProperty("sameAs");
  expect(bare).not.toHaveProperty("email");
  const full = organizationJsonLd({
    name: "Nerutyna",
    url: "https://x.test/",
    description: "d",
    logo: "https://x.test/og.png",
    telegramUrl: "https://t.me/nerutyna",
    email: "hi@x.test",
  });
  expect(full.sameAs).toEqual(["https://t.me/nerutyna"]);
  expect(full.email).toBe("hi@x.test");
});

test("jsonLdScript cannot close the script tag it is placed in and stays valid JSON", () => {
  const source = { text: "</script><b>&" };
  const out = jsonLdScript(source);
  expect(out).not.toMatch(/<|>/);
  expect(JSON.parse(out)).toEqual(source);
});
