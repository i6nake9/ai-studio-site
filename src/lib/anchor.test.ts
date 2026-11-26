import { expect, test } from "vitest";

import { anchorId } from "./anchor";

test("anchorId turns a Ukrainian heading into a short latin anchor", () => {
  expect(anchorId("Що таке ШІ-агент")).toBe("shcho-take-shi-agent");
  expect(anchorId("Крок 1. Випишіть шлях одного замовлення")).toBe("krok-1-vypyshit-shlyah-odnogo-zamovlennya");
  expect(anchorId("ChatGPT, Claude, Gemini чи локальна модель")).toBe("chatgpt-claude-gemini-chy-lokalna-model");
});

test("anchorId drops apostrophes and keeps anchors at most 60 characters on a word boundary", () => {
  expect(anchorId("Пам'ять і з'єднання")).toBe("pamyat-i-zyednannya");
  const id = anchorId("Дуже довгий заголовок розділу, який не повинен перетворитися на нескінченну адресу");
  expect(id.length).toBeLessThanOrEqual(60);
  expect(id.endsWith("-")).toBe(false);
});
