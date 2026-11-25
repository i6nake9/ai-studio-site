import { expect, test } from "vitest";

import { articles } from "@/content/articles";
import { industries } from "@/content/industries";
import { tasks } from "@/content/tasks";

import { llmsText } from "./llms";

const text = llmsText("https://x.test");

test("llms.txt starts with the studio name and a one-line summary", () => {
  const lines = text.split("\n");
  expect(lines[0]).toBe("# Nerutyna");
  expect(lines[2].startsWith("> ")).toBe(true);
});

test("llms.txt links every task, industry and article page with a description", () => {
  for (const task of tasks) {
    expect(text).toContain(`](https://x.test/poslugy/${task.slug}/): `);
  }
  for (const item of industries) {
    expect(text).toContain(`](https://x.test/galuzi/${item.slug}/): `);
  }
  for (const article of articles) {
    expect(text).toContain(`](https://x.test/blog/${article.slug}/): `);
  }
  expect(text).toContain("](https://x.test/ciny/): ");
});

test("llms.txt states the prices and how to get in touch", () => {
  // Intl groups digits with non-breaking spaces; compare with plain ones.
  expect(text.replace(/[\u00a0\u202f]/g, " ")).toContain("$500–1 500");
  expect(text).toContain("https://t.me/Nerutyna_ai");
});
