import { expect, test } from "vitest";

import { adLabel, leadPage } from "./attribution";

test("adLabel keeps only the campaign labels of a link, in a fixed order", () => {
  expect(adLabel("?utm_campaign=spring&fbclid=AbC123&utm_source=facebook&x=1")).toBe(
    "utm_source=facebook&utm_campaign=spring",
  );
  expect(adLabel("?utm_source=fb&utm_medium=cpc&utm_campaign=ttn&utm_content=video1&utm_term=crm")).toBe(
    "utm_source=fb&utm_medium=cpc&utm_campaign=ttn&utm_content=video1&utm_term=crm",
  );
});

test("adLabel is empty for a link without campaign labels", () => {
  expect(adLabel("")).toBe("");
  expect(adLabel("?fbclid=AbC123&page=2")).toBe("");
  expect(adLabel("?utm_source=")).toBe("");
});

test("adLabel drops anything but letters, digits, dot, dash and underscore, and cuts long values", () => {
  expect(adLabel("?utm_source=face book<script>&utm_campaign=весна-2026")).toBe(
    "utm_source=facebookscript&utm_campaign=-2026",
  );
  expect(adLabel(`?utm_source=${"a".repeat(80)}`)).toBe(`utm_source=${"a".repeat(40)}`);
});

test("leadPage adds the campaign labels to the path of the page the form was sent from", () => {
  expect(leadPage("/blog/a/", "")).toBe("/blog/a/");
  expect(leadPage("/blog/a/", "utm_source=facebook")).toBe("/blog/a/?utm_source=facebook");
});

test("leadPage never grows past what the lead receiver stores", () => {
  const page = leadPage(`/${"p".repeat(150)}/`, `utm_source=${"a".repeat(40)}&utm_campaign=${"b".repeat(40)}`);
  expect(page.length).toBeLessThanOrEqual(200);
  expect(page.startsWith("/")).toBe(true);
});
