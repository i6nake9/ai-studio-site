import { expect, test } from "vitest";

import { articles, articlesAbout, blogText } from "./articles";
import { pricingPage } from "./pricing";
import { tasks } from "./tasks";
import { uk } from "./uk";

const length = (text: string) => Array.from(text).length;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const serviceSlugs = [...tasks.map((t) => t.slug), ...uk.solutions.items.map((i) => i.slug)];

function collectStrings(value: unknown, out: string[] = []) {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out));
  else if (value && typeof value === "object")
    Object.values(value).forEach((v) => collectStrings(v, out));
  return out;
}

test("the blog answers the questions people type into search", () => {
  const titles = articles.map((a) => a.title).join(" | ");
  expect(titles).toMatch(/ШІ-агент/);
  expect(titles).toMatch(/Скільки коштує.*бот/i);
  expect(titles).toMatch(/інтернет-магазин/i);
  expect(titles).toMatch(/ТТН/);
  expect(titles).toMatch(/малого бізнесу/i);
  expect(titles).toMatch(/ChatGPT/);
  expect(titles).toMatch(/[Пп]арсинг цін/);
  expect(articles.length).toBeGreaterThanOrEqual(8);
});

test("every article has an address, search texts, a date and a direct answer first", () => {
  expect(new Set(articles.map((a) => a.slug)).size).toBe(articles.length);
  expect(new Set(articles.map((a) => a.metaTitle)).size).toBe(articles.length);
  for (const a of articles) {
    expect(a.slug).toMatch(SLUG);
    expect(serviceSlugs, a.slug).not.toContain(a.slug);
    expect(length(a.metaTitle), a.metaTitle).toBeLessThanOrEqual(60);
    expect(length(a.metaDescription), a.slug).toBeGreaterThanOrEqual(110);
    expect(length(a.metaDescription), a.slug).toBeLessThanOrEqual(160);
    expect(length(a.card), a.slug).toBeLessThanOrEqual(160);
    expect(a.published, a.slug).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(Date.parse(a.published)), a.slug).toBe(false);
    // The answer comes before the details: two to four sentences.
    expect(length(a.summary), a.slug).toBeGreaterThanOrEqual(180);
    expect(length(a.summary), a.slug).toBeLessThanOrEqual(520);
    expect(a.sections.length, a.slug).toBeGreaterThanOrEqual(4);
    expect(a.faq.length, a.slug).toBeGreaterThanOrEqual(3);
    for (const s of a.sections) {
      expect((s.text?.length ?? 0) + (s.list?.length ?? 0), `${a.slug}: ${s.title}`).toBeGreaterThan(0);
    }
  }
});

test("every article is long enough to answer its question", () => {
  for (const a of articles) {
    const words = collectStrings([a.summary, a.sections, a.faq]).join(" ").split(/\s+/).length;
    expect(words, a.slug).toBeGreaterThanOrEqual(380);
  }
});

test("every article links to existing service pages, and they link back", () => {
  for (const a of articles) {
    expect(a.related.length, a.slug).toBeGreaterThanOrEqual(2);
    for (const slug of a.related) expect(serviceSlugs, `${a.slug} -> ${slug}`).toContain(slug);
  }
  const first = articles[0];
  expect(articlesAbout(first.related[0]).map((a) => a.slug)).toContain(first.slug);
  expect(articlesAbout("no-such-page")).toEqual([]);
});

test("the pricing page names every price format and what is paid separately", () => {
  expect(length(pricingPage.metaTitle)).toBeLessThanOrEqual(60);
  expect(length(pricingPage.metaDescription)).toBeGreaterThanOrEqual(110);
  expect(length(pricingPage.metaDescription)).toBeLessThanOrEqual(160);
  expect(pricingPage.formats).toHaveLength(4);
  for (const f of pricingPage.formats) {
    expect(f.price, f.title).toMatch(/\$/);
    expect(f.includes.length, f.title).toBeGreaterThanOrEqual(3);
  }
  expect(pricingPage.factors.items.length).toBeGreaterThanOrEqual(4);
  expect(pricingPage.extra.items.join(" ")).toMatch(/ШІ-модел/);
  expect(pricingPage.faq.length).toBeGreaterThanOrEqual(3);
  for (const ex of pricingPage.examples.items) {
    for (const slug of ex.slugs) expect(serviceSlugs, slug).toContain(slug);
  }
});

test("blog and pricing texts follow the same honesty rules as the rest of the site", () => {
  const banned = [
    /3\s*[–-]\s*5\s*раз/i,
    /глибок\S* експертиз/i,
    /антибот/i,
    /десятки впроваджень/i,
    /гаранту/i,
    /наші клієнти/i,
    /(найчастіше|часто|зазвичай) починаємо/i,
    /%/,
  ];
  for (const text of collectStrings([articles, pricingPage, blogText])) {
    expect(text.trim(), "empty string").not.toBe("");
    for (const pattern of banned) expect(text).not.toMatch(pattern);
  }
});
