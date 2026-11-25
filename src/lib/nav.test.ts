import { expect, test } from "vitest";

import { navHref } from "./nav";

test("a section link scrolls on the home page and leads back to it from other pages", () => {
  expect(navHref("#prices", true)).toBe("#prices");
  expect(navHref("#prices", false)).toBe("/#prices");
});

test("a link to another page stays the same everywhere", () => {
  expect(navHref("/blog/", true)).toBe("/blog/");
  expect(navHref("/blog/", false)).toBe("/blog/");
});
