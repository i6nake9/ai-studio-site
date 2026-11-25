import { expect, test } from "vitest";

import { uk } from "../content/uk";
import { siteConfig } from "../../site.config";
import robots from "./robots";
import sitemap from "./sitemap";

test("the sitemap lists the home page, every service page and the privacy page", () => {
  const urls = sitemap().map((entry) => entry.url);
  expect(urls).toContain(`${siteConfig.siteUrl}/`);
  expect(urls).toContain(`${siteConfig.siteUrl}/privacy/`);
  for (const service of uk.solutions.items) {
    expect(urls).toContain(`${siteConfig.siteUrl}/poslugy/${service.slug}/`);
  }
  expect(new Set(urls).size).toBe(urls.length);
});

test("robots.txt never blocks crawling, so the noindex tag on pages stays readable", () => {
  const rules = robots().rules;
  const list = Array.isArray(rules) ? rules : [rules];
  for (const rule of list) expect(rule.disallow ?? "").not.toBe("/");
});
