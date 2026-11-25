import type { Currency } from "./calculator";

const NBSP = " ";

const integer = new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 });
const oneDecimal = new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 1 });

/** 8400 → "8 400" (grouped, no decimals). */
export function formatNumber(n: number): string {
  return integer.format(n);
}

/** 8400 → "$8 400", 352800 → "352 800 грн". */
export function formatMoney(n: number, currency: Currency): string {
  return currency === "USD"
    ? `$${formatNumber(n)}`
    : `${formatNumber(n)}${NBSP}грн`;
}

/** Shortest payback shown as a figure; anything faster is "up to" this. */
export const MIN_PAYBACK_MONTHS = 3;

/**
 * 4.26 → "4,3 міс."; anything under three months → "до 3 міс.": a rough
 * calculator must not promise a payback of a few weeks.
 */
export function formatMonths(n: number): string {
  if (n < MIN_PAYBACK_MONTHS) return `до${NBSP}${MIN_PAYBACK_MONTHS}${NBSP}міс.`;
  return `${oneDecimal.format(n)}${NBSP}міс.`;
}
