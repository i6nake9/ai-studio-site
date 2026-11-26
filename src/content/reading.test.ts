import { expect, test } from "vitest";

import { articles, readingFor } from "./articles";
import { industries } from "./industries";
import { tasks, tasksOf } from "./tasks";
import { uk } from "./uk";

test("readingFor puts articles about the first page first, then those about the others", () => {
  const first = articles[0].related[0];
  const found = readingFor([first, "no-such-page"], 3);
  expect(found[0].related).toContain(first);
  expect(readingFor(["no-such-page"], 3)).toEqual([]);
  expect(readingFor([first], 1)).toHaveLength(1);
});

test("every service, direction and industry page gets something to read", () => {
  for (const task of tasks) {
    const siblings = tasksOf(task.parent).map((t) => t.slug);
    expect(readingFor([task.slug, task.parent, ...siblings], 3).length, task.slug).toBeGreaterThan(0);
  }
  for (const item of uk.solutions.items) {
    const slugs = [item.slug, ...tasksOf(item.slug).map((t) => t.slug)];
    expect(readingFor(slugs, 3).length, item.slug).toBeGreaterThan(0);
  }
  for (const industry of industries) {
    expect(readingFor(industry.services.map((s) => s.slug), 3).length, industry.slug).toBeGreaterThan(0);
  }
});

test("the blog's start-here list points at existing articles", async () => {
  const { blogText, findArticle } = await import("./articles");
  for (const item of blogText.start.items) expect(findArticle(item.slug), item.slug).toBeDefined();
});
