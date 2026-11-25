import { describe, expect, test } from "vitest";

import { calculateRoi, convertCost, costLimits } from "./calculator";

const usd = (employees: number, monthlyCost: number, routinePercent: number) =>
  calculateRoi({
    employees,
    monthlyCost,
    routinePercent,
    currency: "USD",
    uahPerUsd: 42,
  });

test("starting values: 5 people, $700, 40% routine", () => {
  expect(usd(5, 700, 40)).toEqual({
    hoursFreedPerMonth: 160,
    monthlySaving: 700,
    yearlySaving: 8400,
    implementationCost: 1500,
    paybackMonths: 1500 / 700,
  });
});

test("payback longer than 12 months is not reported as a number", () => {
  expect(usd(1, 400, 20).paybackMonths).toBeNull(); // 1500 / 40 = 37.5
});

test("payback of exactly 12 months is reported", () => {
  expect(usd(1, 1250, 20).paybackMonths).toBe(12); // 1500 / 125
});

test("implementation cost steps up at 6 and at 21 people", () => {
  expect(usd(5, 1000, 50).implementationCost).toBe(1500);
  expect(usd(6, 1000, 50).implementationCost).toBe(4000);
  expect(usd(20, 1000, 50).implementationCost).toBe(4000);
  expect(usd(21, 1000, 50).implementationCost).toBe(6000);
});

test("hryvnia input with a fractional exchange rate", () => {
  const r = calculateRoi({
    employees: 5,
    monthlyCost: 30000,
    routinePercent: 40,
    currency: "UAH",
    uahPerUsd: 41.87,
  });
  expect(r.monthlySaving).toBe(30000);
  expect(r.implementationCost).toBeCloseTo(62805);
  expect(r.paybackMonths).toBeCloseTo(2.0935);
});

test("input outside the slider ranges is clamped to them", () => {
  expect(usd(0, 700, 40)).toEqual(usd(1, 700, 40));
  expect(usd(999, 700, 40)).toEqual(usd(50, 700, 40));
  expect(usd(5, 700, 5)).toEqual(usd(5, 700, 20));
  expect(usd(5, 700, 95)).toEqual(usd(5, 700, 70));
  expect(usd(5, 10, 40)).toEqual(usd(5, 300, 40));
  expect(usd(Number.NaN, Number.NaN, Number.NaN)).toEqual(usd(1, 300, 20));
});

test("cost slider limits follow the currency", () => {
  expect(costLimits("USD", 42)).toEqual({
    min: 300,
    max: 3000,
    step: 50,
    initial: 700,
  });
  expect(costLimits("UAH", 42)).toEqual({
    min: 12500,
    max: 126000,
    step: 500,
    initial: 29500,
  });
});

describe("convertCost", () => {
  test("USD to UAH uses the rate and rounds to the UAH step", () => {
    expect(convertCost(700, "USD", "UAH", 45)).toBe(31500);
    expect(convertCost(750, "USD", "UAH", 45.35)).toBe(34000);
  });

  test("UAH to USD rounds to the USD step", () => {
    expect(convertCost(31500, "UAH", "USD", 45)).toBe(700);
    expect(convertCost(33000, "UAH", "USD", 45)).toBe(750);
  });

  test("the result stays inside the slider range of the new currency", () => {
    expect(convertCost(135000, "UAH", "USD", 40)).toBe(3000);
    expect(convertCost(13500, "UAH", "USD", 50)).toBe(300);
  });

  test("same currency returns the value unchanged", () => {
    expect(convertCost(725, "USD", "USD", 45)).toBe(725);
  });
});
