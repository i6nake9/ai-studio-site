import type { RoiInput, RoiResult } from "./calculator";
import { formatMoney, formatNumber } from "./format";

export interface LeadFields {
  name: string;
  /** Site address or the kind of business. */
  business: string;
  /** Telegram username or phone number. */
  contact: string;
}

export interface LeadRoi {
  input: RoiInput;
  result: RoiResult;
}

export const FIELD_LIMITS = { name: 100, business: 200, contact: 100 } as const;

export type FieldErrors = Partial<Record<keyof LeadFields, "required">>;

const FIELDS = ["name", "business", "contact"] as const;

/** Collapse whitespace (including line breaks) and cut to `limit` characters. */
function clean(value: string, limit: number): string {
  const flat = value.replace(/\s+/g, " ").trim();
  // Array.from splits by code point, so an emoji is never cut in half.
  return Array.from(flat).slice(0, limit).join("").trim();
}

export function normalizeLead(fields: LeadFields): LeadFields {
  return {
    name: clean(fields.name, FIELD_LIMITS.name),
    business: clean(fields.business, FIELD_LIMITS.business),
    contact: clean(fields.contact, FIELD_LIMITS.contact),
  };
}

export function validateLead(fields: LeadFields): FieldErrors {
  const normalized = normalizeLead(fields);
  const errors: FieldErrors = {};
  for (const field of FIELDS) {
    if (!normalized[field]) errors[field] = "required";
  }
  return errors;
}

const pluralRules = new Intl.PluralRules("uk");

function employeesWord(count: number): string {
  switch (pluralRules.select(count)) {
    case "one":
      return "співробітник";
    case "few":
      return "співробітники";
    default:
      return "співробітників";
  }
}

/** Plain-text lead as it arrives in Telegram or e-mail. */
export function buildLeadMessage(
  fields: LeadFields,
  brand: string,
  roi?: LeadRoi,
): string {
  const lead = normalizeLead(fields);
  const lines = [
    `Заявка на аудит з сайту ${brand}`,
    `Ім'я: ${lead.name}`,
    `Сайт або ніша: ${lead.business}`,
    `Контакт: ${lead.contact}`,
  ];
  if (roi) {
    const { input, result } = roi;
    const money = (n: number) => formatMoney(n, input.currency);
    lines.push(
      `Розрахунок: ${input.employees} ${employeesWord(input.employees)}, ` +
        `${money(input.monthlyCost)} на місяць, ${input.routinePercent}% рутини. ` +
        `Вивільняється ${formatNumber(result.hoursFreedPerMonth)} год на місяць, ` +
        `економія ${money(result.yearlySaving)} на рік.`,
    );
  }
  return lines.join("\n");
}

export type PreparedLead =
  | { status: "invalid"; errors: FieldErrors }
  /** The hidden bot-trap field was filled: drop the lead without telling the sender. */
  | { status: "spam" }
  | { status: "ready"; lead: LeadFields; message: string };

/** Decides what a form submission is before anything is sent anywhere. */
export function prepareLead(
  fields: LeadFields,
  trap: string,
  brand: string,
  roi?: LeadRoi,
): PreparedLead {
  if (trap.trim()) return { status: "spam" };
  const errors = validateLead(fields);
  if (Object.keys(errors).length > 0) return { status: "invalid", errors };
  return {
    status: "ready",
    lead: normalizeLead(fields),
    message: buildLeadMessage(fields, brand, roi),
  };
}

/**
 * Accepts "@nick", "nick", "t.me/nick" or "https://t.me/nick".
 * Returns the bare username, or null when it cannot be a Telegram username.
 */
export function normalizeTelegramNick(raw: string): string | null {
  const nick = raw
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^(t|telegram)\.me\//i, "")
    .replace(/^@/, "")
    .replace(/\/$/, "");
  return /^[A-Za-z0-9_]{4,32}$/.test(nick) ? nick : null;
}

/** Link that opens a chat with `nick`; with `text`, the message is pre-filled. */
export function telegramLink(nick: string | null, text?: string): string | null {
  if (!nick) return null;
  const base = `https://t.me/${nick}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function mailtoLink(
  email: string,
  subject: string,
  body: string,
): string | null {
  const address = email.trim();
  if (!address) return null;
  return `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export type SubmitOutcome = "sent" | "fallback";

/**
 * Posts the lead to `endpoint`. Never throws: anything other than a 2xx
 * answer within the timeout means the caller must offer the Telegram path,
 * so a visitor is never told "sent" when nothing arrived.
 */
export async function submitLead(
  endpoint: string,
  payload: unknown,
  fetchImpl: typeof fetch = fetch,
  timeoutMs = 8000,
): Promise<SubmitOutcome> {
  if (!endpoint.trim()) return "fallback";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    return response.ok ? "sent" : "fallback";
  } catch {
    return "fallback";
  } finally {
    clearTimeout(timer);
  }
}
