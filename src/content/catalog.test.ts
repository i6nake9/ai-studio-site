import { expect, test } from "vitest";

import { catalogText } from "./catalog";
import { industries } from "./industries";
import { tasks } from "./tasks";
import { uk } from "./uk";

const length = (text: string) => Array.from(text).length;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const directionSlugs = uk.solutions.items.map((item) => item.slug);
const taskSlugs = tasks.map((task) => task.slug);

function collectStrings(value: unknown, out: string[] = []) {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => collectStrings(v, out));
  else if (value && typeof value === "object")
    Object.values(value).forEach((v) => collectStrings(v, out));
  return out;
}
const strings = collectStrings([tasks, industries, catalogText]);

test("the tasks the owner named have their own pages", () => {
  const titles = tasks.map((task) => task.h1);
  expect(titles.some((t) => /Prom/.test(t) && /ТТН/.test(t) && /друк/i.test(t))).toBe(true);
  expect(titles.some((t) => /етикет/i.test(t))).toBe(true);
  expect(titles.some((t) => /GPS/.test(t))).toBe(true);
  expect(tasks.length).toBeGreaterThanOrEqual(10);
});

test("every task page has its own address under one of the four directions", () => {
  expect(new Set(taskSlugs).size).toBe(tasks.length);
  for (const task of tasks) {
    expect(task.slug).toMatch(SLUG);
    expect(directionSlugs, task.slug).not.toContain(task.slug);
    expect(directionSlugs, task.slug).toContain(task.parent);
  }
});

test("every task page has a search title, a description and enough of its own text", () => {
  const titles = [
    ...tasks.map((task) => task.metaTitle),
    ...uk.solutions.items.map((item) => item.page.metaTitle),
  ];
  expect(new Set(titles).size).toBe(titles.length);
  expect(new Set(tasks.map((task) => task.h1)).size).toBe(tasks.length);
  for (const task of tasks) {
    expect(length(task.metaTitle), task.metaTitle).toBeLessThanOrEqual(60);
    expect(length(task.metaDescription), task.slug).toBeGreaterThanOrEqual(110);
    expect(length(task.metaDescription), task.slug).toBeLessThanOrEqual(160);
    expect(length(task.card), task.slug).toBeLessThanOrEqual(140);
    expect(task.pains.length, task.slug).toBeGreaterThanOrEqual(3);
    expect(task.steps.length, task.slug).toBeGreaterThanOrEqual(4);
    expect(task.includes.length, task.slug).toBeGreaterThanOrEqual(4);
    expect(task.fits.length, task.slug).toBeGreaterThanOrEqual(3);
    expect(task.faq.length, task.slug).toBeGreaterThanOrEqual(3);
    expect(task.integrations.length, task.slug).toBeGreaterThanOrEqual(3);
  }
});

test("every industry page has an address, search texts and links to existing services", () => {
  const slugs = industries.map((item) => item.slug);
  expect(industries.length).toBeGreaterThanOrEqual(5);
  expect(new Set(slugs).size).toBe(industries.length);
  expect(new Set(industries.map((item) => item.metaTitle)).size).toBe(industries.length);
  for (const item of industries) {
    expect(item.slug).toMatch(SLUG);
    expect(length(item.metaTitle), item.metaTitle).toBeLessThanOrEqual(60);
    expect(length(item.metaDescription), item.slug).toBeGreaterThanOrEqual(110);
    expect(length(item.metaDescription), item.slug).toBeLessThanOrEqual(160);
    expect(item.pains.length, item.slug).toBeGreaterThanOrEqual(3);
    expect(item.faq.length, item.slug).toBeGreaterThanOrEqual(3);
    expect(item.services.length, item.slug).toBeGreaterThanOrEqual(3);
    for (const link of item.services) {
      expect([...taskSlugs, ...directionSlugs], `${item.slug} -> ${link.slug}`).toContain(link.slug);
    }
  }
});

test("every task is reachable from at least one industry page", () => {
  const linked = new Set(industries.flatMap((item) => item.services.map((s) => s.slug)));
  expect(taskSlugs.filter((slug) => !linked.has(slug))).toEqual([]);
});

test("task and industry pages make no promises the site is not allowed to make", () => {
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
  for (const text of strings) {
    expect(text.trim(), "empty string").not.toBe("");
    for (const pattern of banned) expect(text).not.toMatch(pattern);
  }
});

test("the services index and the industries index have search texts", () => {
  for (const page of [catalogText.hub, catalogText.industriesIndex]) {
    expect(length(page.metaTitle), page.metaTitle).toBeLessThanOrEqual(60);
    expect(length(page.metaDescription), page.metaTitle).toBeGreaterThanOrEqual(110);
    expect(length(page.metaDescription), page.metaTitle).toBeLessThanOrEqual(160);
  }
  expect(catalogText.hub.metaTitle).not.toBe(catalogText.industriesIndex.metaTitle);
});

test("the tasks people search for have their own pages", () => {
  const titles = tasks.map((task) => task.h1).join(" | ");
  expect(titles).toMatch(/Telegram-бота/);
  expect(titles).toMatch(/Instagram/);
  expect(titles).toMatch(/1С/);
  expect(titles).toMatch(/BAS/);
  expect(titles).toMatch(/Checkbox/);
  expect(titles).toMatch(/Парсинг/);
  expect(titles).toMatch(/розсилк/i);
  expect(titles).toMatch(/ТТН Нової Пошти й Укрпошти/);
  expect(titles).toMatch(/ШІ-консультант/);
  expect(titles).toMatch(/прайсів постачальників/);
  expect(titles).toMatch(/Google Sheets/);
  expect(titles).toMatch(/Комерційні пропозиції/);
});

test("small businesses and sales departments have their own pages", () => {
  const slugs = industries.map((item) => item.slug);
  expect(slugs).toContain("maliy-biznes");
  expect(slugs).toContain("b2b-viddil-prodazhiv");
});
