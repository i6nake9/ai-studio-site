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
  expect(uk.hero.diagram.nodes).toHaveLength(5);
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
