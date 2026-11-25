import { expect, test } from "vitest";

import { uk } from "./uk";

/** Every string in the dictionary, with the top-level block it belongs to. */
function collectStrings(
  value: unknown,
  block: string,
  out: { block: string; text: string }[] = [],
) {
  if (typeof value === "string") out.push({ block, text: value });
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, block, out));
  else if (value && typeof value === "object")
    Object.values(value).forEach((v) => collectStrings(v, block, out));
  return out;
}

const strings = Object.entries(uk).flatMap(([block, value]) =>
  collectStrings(value, block),
);

test("each block has the number of items the page layout expects", () => {
  expect(uk.hero.checklist.items).toHaveLength(5);
  expect(uk.trust.items).toHaveLength(4);
  expect(uk.prices.items).toHaveLength(4);
  expect(uk.lead.steps).toHaveLength(3);
  expect(uk.pains.items).toHaveLength(4);
  expect(uk.solutions.items).toHaveLength(4);
  expect(uk.scenarios.items).toHaveLength(3);
  expect(uk.ownProjects.items).toHaveLength(4);
  expect(uk.comparison.rows).toHaveLength(3);
  expect(uk.process.steps).toHaveLength(5);
  expect(uk.faq.items).toHaveLength(4);
});

test("the first solution is the one that can be shown today", () => {
  expect(uk.solutions.items[0].title).toMatch(/моніторинг/i);
});

test("no promises or claims the site is not allowed to make", () => {
  const banned = [
    /3\s*[–-]\s*5\s*раз/i,
    /глибок\S* експертиз/i,
    /антибот/i,
    /десятки впроваджень/i,
    /гаранту/i,
  ];
  for (const { block, text } of strings) {
    for (const pattern of banned) {
      expect(text, `${block}: "${text}"`).not.toMatch(pattern);
    }
  }
});

test("percentages appear only in the calculator and the FAQ", () => {
  const offenders = strings.filter(
    ({ block, text }) =>
      text.includes("%") && block !== "calculator" && block !== "faq",
  );
  expect(offenders).toEqual([]);
});

test("scenarios say they are examples, not client stories", () => {
  expect(uk.scenarios.title).toBe("Типові сценарії");
  expect(uk.scenarios.note).toMatch(/не історії клієнтів/);
});

test("no empty strings", () => {
  expect(strings.filter(({ text }) => !text.trim())).toEqual([]);
});

test("the calculator says what its figure is and what it leaves out", () => {
  expect(uk.calculator.results.yearly).not.toMatch(/економія/i);
  const method = uk.calculator.how.join(" ");
  expect(method).toMatch(/підтримк/i);
  expect(method).toMatch(/не входять/);
});

test("there is a text for the state where leads have nowhere to go", () => {
  expect(uk.lead.notReady.title.trim()).not.toBe("");
  expect(uk.lead.notReady.text.trim()).not.toBe("");
});

const length = (text: string) => Array.from(text).length;

test("the home page title and description fit a search result", () => {
  expect(length(uk.meta.title)).toBeLessThanOrEqual(60);
  expect(length(uk.meta.description)).toBeGreaterThanOrEqual(110);
  expect(length(uk.meta.description)).toBeLessThanOrEqual(160);
  expect(uk.hero.title).toMatch(/автоматизаці/i);
});

test("every service has its own address, search title, description and page texts", () => {
  const slugs = uk.solutions.items.map((item) => item.slug);
  expect(new Set(slugs).size).toBe(4);
  const titles = uk.solutions.items.map((item) => item.page.metaTitle);
  expect(new Set(titles).size).toBe(4);
  for (const item of uk.solutions.items) {
    expect(item.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    expect(length(item.page.metaTitle), item.page.metaTitle).toBeLessThanOrEqual(60);
    expect(length(item.page.metaDescription), item.slug).toBeGreaterThanOrEqual(110);
    expect(length(item.page.metaDescription), item.slug).toBeLessThanOrEqual(160);
    expect(item.page.h1).not.toBe(uk.hero.title);
    expect(item.page.fits.length).toBeGreaterThanOrEqual(3);
    expect(item.page.faq.length).toBeGreaterThanOrEqual(3);
  }
});

test("the form block says what happens after a lead is sent", () => {
  expect(uk.lead.steps.join(" ")).toMatch(/30–40 хвилин/);
});

test("the form asks for an e-mail and the privacy page says so", () => {
  expect(uk.lead.fields.email.label).toMatch(/e-mail/i);
  expect(uk.lead.invalidEmail.trim()).not.toBe("");
  expect(uk.privacy.sections[0].text.join(" ")).toMatch(/e-mail/i);
});
