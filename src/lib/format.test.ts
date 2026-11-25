import { expect, test } from "vitest";

import { formatDateUk, formatMoney, formatMonths, formatNumber } from "./format";

// Intl uses non-breaking spaces as group separators; compare with plain ones.
const plain = (s: string) => s.replace(/[  ]/g, " ");

test("numbers are grouped the Ukrainian way, without decimals", () => {
  expect(plain(formatNumber(8400))).toBe("8 400");
  expect(plain(formatNumber(159.6))).toBe("160");
});

test("dollars are written with a leading sign", () => {
  expect(plain(formatMoney(8400, "USD"))).toBe("$8 400");
});

test("hryvnias are written with a trailing unit", () => {
  expect(plain(formatMoney(352800, "UAH"))).toBe("352 800 грн");
});

test("months keep one decimal with a comma", () => {
  expect(plain(formatMonths(4.26))).toBe("4,3 міс.");
  expect(plain(formatMonths(3))).toBe("3 міс.");
  expect(plain(formatMonths(12))).toBe("12 міс.");
});

test("a payback shorter than three months is never shown as an exact figure", () => {
  expect(plain(formatMonths(2.14))).toBe("до 3 міс.");
  expect(plain(formatMonths(0.2))).toBe("до 3 міс.");
});

test("formatDateUk writes a date the way people read it in Ukrainian", () => {
  expect(formatDateUk("2026-11-25")).toBe("25 листопада 2026");
  expect(formatDateUk("2027-01-03")).toBe("3 січня 2027");
});
