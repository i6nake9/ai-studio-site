/**
 * Which advert a visitor came from. An ad link carries labels such as
 * `?utm_source=facebook&utm_campaign=ttn`; they are remembered for the visit
 * and sent with the lead, so the owner can see which advert brings leads.
 * Click identifiers (fbclid, gclid) are never kept.
 */

const LABELS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
const VALUE_LIMIT = 40;
/** The lead receiver stores at most this many characters of the page address. */
const PAGE_LIMIT = 200;
const STORAGE_KEY = "nerutyna:ad";

/** "?utm_campaign=x&fbclid=1&utm_source=fb" → "utm_source=fb&utm_campaign=x". */
export function adLabel(search: string): string {
  const params = new URLSearchParams(search);
  return LABELS.flatMap((name) => {
    const value = (params.get(name) ?? "").replace(/[^A-Za-z0-9._-]/g, "").slice(0, VALUE_LIMIT);
    return value ? [`${name}=${value}`] : [];
  }).join("&");
}

/** Path of the page a lead was sent from, with the advert labels when there are any. */
export function leadPage(pathname: string, label: string): string {
  if (!label) return pathname.slice(0, PAGE_LIMIT);
  const path = pathname.slice(0, PAGE_LIMIT - label.length - 1);
  return `${path}?${label}`;
}

/** Remembers the labels of the link the visit started with. Call once per page load. */
export function rememberAd(search: string): void {
  const label = adLabel(search);
  if (!label) return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, label);
  } catch {
    // Storage can be blocked; the lead then simply has no advert label.
  }
}

/** The labels remembered for this visit, or the ones in the current address. */
export function currentAd(search: string): string {
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (stored) return adLabel(`?${stored}`);
  } catch {
    // Fall through to the current address.
  }
  return adLabel(search);
}
