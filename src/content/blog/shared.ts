import { siteConfig } from "../../../site.config";
import { formatMoney } from "../../lib/format";

export const { brand, prices } = siteConfig;

export const usd = (n: number) => formatMoney(n, "USD");
export const range = ([from, to]: readonly [number, number]) => `${usd(from)}–${usd(to).slice(1)}`;
/** Price of a pilot, e.g. "$500–1 500". */
export const pilot = range(prices.pilot);
/** Monthly support, e.g. "$100–300". */
export const support = range(prices.support);
/** Lowest price of a full project, e.g. "$2 000". */
export const full = usd(prices.full[0]);
