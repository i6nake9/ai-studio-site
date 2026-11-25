import { expect, test } from "vitest";

import { formatMoney, formatMonths, formatNumber } from "./format";

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
  expect(plain(formatMonths(2.14))).toBe("2,1 міс.");
  expect(plain(formatMonths(12))).toBe("12 міс.");
});

test("less than one month is said in words", () => {
  expect(formatMonths(0.8)).toBe("менше місяця");
});
