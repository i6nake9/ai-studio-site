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

/** 2.14 → "2,1 міс."; anything under one month → "менше місяця". */
export function formatMonths(n: number): string {
  if (n < 1) return "менше місяця";
  return `${oneDecimal.format(n)}${NBSP}міс.`;
}
