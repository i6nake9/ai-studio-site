export type Currency = "USD" | "UAH";

export interface RoiInput {
  employees: number;
  /** Company cost of one employee per month, in `currency`. */
  monthlyCost: number;
  /** Share of routine work, in percent (20–70). */
  routinePercent: number;
  currency: Currency;
  uahPerUsd: number;
}

export interface RoiResult {
  hoursFreedPerMonth: number;
  /** In the input currency. */
  monthlySaving: number;
  /** In the input currency. */
  yearlySaving: number;
  /** Rough project price for a team of this size, in the input currency. */
  implementationCost: number;
  /** `null` when the project pays back in more than 12 months. */
  paybackMonths: number | null;
}

interface Range {
  min: number;
  max: number;
  step: number;
  initial: number;
}

export const LIMITS = {
  employees: { min: 1, max: 50, step: 1, initial: 5 },
  costUsd: { min: 300, max: 3000, step: 50, initial: 700 },
  routinePercent: { min: 20, max: 70, step: 5, initial: 40 },
} as const satisfies Record<string, Range>;

/** Working hours in a month. */
export const HOURS_PER_MONTH = 160;
/** Assumption shown to the visitor: automation removes about half of the routine. */
export const AUTOMATION_SHARE = 0.5;
/** Payback longer than this is not shown as a number. */
export const MAX_PAYBACK_MONTHS = 12;

const UAH_STEP = 500;

/** Rough project price in USD by team size, taken from the price list. */
function implementationCostUsd(employees: number): number {
  if (employees <= 5) return 1500;
  if (employees <= 20) return 4000;
  return 6000;
}

function clamp(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
}

const roundTo = (value: number, step: number) => Math.round(value / step) * step;

/** Limits of the "cost per employee" slider in the chosen currency. */
export function costLimits(currency: Currency, uahPerUsd: number): Range {
  if (currency === "USD") return { ...LIMITS.costUsd };
  const toUah = (usd: number) => roundTo(usd * uahPerUsd, UAH_STEP);
  return {
    min: toUah(LIMITS.costUsd.min),
    max: toUah(LIMITS.costUsd.max),
    step: UAH_STEP,
    initial: toUah(LIMITS.costUsd.initial),
  };
}

export function calculateRoi(input: RoiInput): RoiResult {
  const { currency, uahPerUsd } = input;
  const cost = costLimits(currency, uahPerUsd);

  const employees = Math.round(
    clamp(input.employees, LIMITS.employees.min, LIMITS.employees.max),
  );
  const monthlyCost = clamp(input.monthlyCost, cost.min, cost.max);
  const routineShare =
    clamp(
      input.routinePercent,
      LIMITS.routinePercent.min,
      LIMITS.routinePercent.max,
    ) / 100;

  const automated = routineShare * AUTOMATION_SHARE;
  const monthlySaving = employees * monthlyCost * automated;
  const implementationCost =
    implementationCostUsd(employees) * (currency === "UAH" ? uahPerUsd : 1);
  const payback = implementationCost / monthlySaving;

  return {
    hoursFreedPerMonth: employees * HOURS_PER_MONTH * automated,
    monthlySaving,
    yearlySaving: monthlySaving * 12,
    implementationCost,
    paybackMonths: payback <= MAX_PAYBACK_MONTHS ? payback : null,
  };
}
