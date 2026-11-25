import type { RoiInput, RoiResult } from "./calculator";
import { formatMoney, formatNumber } from "./format";

export interface LeadFields {
  name: string;
  /** Site address or the kind of business. */
  business: string;
  /** Where the audit summary is sent. */
  email: string;
  /** Telegram username. Optional: the talk can also go on in the studio bot or by e-mail. */
  telegram: string;
}

export interface LeadRoi {
  input: RoiInput;
  result: RoiResult;
}

export const FIELD_LIMITS = { name: 100, business: 200, email: 120, telegram: 100 } as const;

export type FieldErrors = Partial<Record<keyof LeadFields, "required" | "invalid">>;

const REQUIRED = ["name", "business", "email"] as const;

/** Something@domain.zone without spaces: enough to catch typos, not to prove the mailbox exists. */
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

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
    email: clean(fields.email, FIELD_LIMITS.email),
    telegram: clean(fields.telegram, FIELD_LIMITS.telegram),
  };
}

export function validateLead(fields: LeadFields): FieldErrors {
  const normalized = normalizeLead(fields);
  const errors: FieldErrors = {};
  for (const field of REQUIRED) {
    if (!normalized[field]) errors[field] = "required";
  }
  if (normalized.email && !EMAIL.test(normalized.email)) errors.email = "invalid";
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

/** The calculator figures as one line of text. */
export function roiNote(roi: LeadRoi): string {
  const { input, result } = roi;
  const money = (n: number) => formatMoney(n, input.currency);
  return (
    `Розрахунок: ${input.employees} ${employeesWord(input.employees)}, ` +
    `${money(input.monthlyCost)} на місяць, ${input.routinePercent}% рутини. ` +
    `Вивільняється ${formatNumber(result.hoursFreedPerMonth)} год на місяць, ` +
    `вартість вивільненого часу ${money(result.yearlySaving)} на рік.`
  );
}

/** Plain-text lead: what the visitor copies if the form could not deliver it. */
export function buildLeadMessage(
  fields: LeadFields,
  brand: string,
  roi?: LeadRoi,
  newsletter = false,
): string {
  const lead = normalizeLead(fields);
  const lines = [
    `Заявка на аудит з сайту ${brand}`,
    `Ім'я: ${lead.name}`,
    `Сайт або ніша: ${lead.business}`,
    `E-mail: ${lead.email}`,
  ];
  if (lead.telegram) lines.push(`Telegram: ${lead.telegram}`);
  if (roi) lines.push(roiNote(roi));
  if (newsletter) lines.push("Розсилка: так");
  return lines.join("\n");
}

export interface LeadExtras {
  /** The visitor ticked the newsletter box. */
  newsletter: boolean;
  /** The exact wording next to that box: kept with the lead as proof of what was agreed to. */
  consentText: string;
  /** Path of the page the form was sent from. */
  page: string;
  roi?: LeadRoi;
}

/** The lead as the server receives it. */
export function leadPayload(fields: LeadFields, extras: LeadExtras) {
  return {
    ...normalizeLead(fields),
    newsletter: extras.newsletter,
    consentText: extras.newsletter ? extras.consentText : "",
    page: extras.page,
    roi: extras.roi ? roiNote(extras.roi) : "",
  };
}

export type PreparedLead =
  | { status: "invalid"; errors: FieldErrors }
  | {
      status: "ready";
      lead: LeadFields;
      message: string;
      /**
       * The hidden bot-trap field was filled. Such a lead is never posted to
       * the endpoint, and its sender is never told "sent": if autofill filled
       * the trap for a real person, they still get the Telegram path.
       */
      trapped: boolean;
    };

/** Decides what a form submission is before anything is sent anywhere. */
export function prepareLead(
  fields: LeadFields,
  trap: string,
  brand: string,
  roi?: LeadRoi,
  newsletter = false,
): PreparedLead {
  const errors = validateLead(fields);
  if (Object.keys(errors).length > 0) return { status: "invalid", errors };
  return {
    status: "ready",
    lead: normalizeLead(fields),
    message: buildLeadMessage(fields, brand, roi, newsletter),
    trapped: trap.trim() !== "",
  };
}

export interface LeadChannels {
  telegram: boolean;
  email: boolean;
  endpoint: boolean;
  /** False when a filled form would have nowhere to go. */
  any: boolean;
}

/** Which ways a lead can reach the studio with the current settings. */
export function leadChannels(config: {
  telegram: string;
  email: string;
  leadEndpoint: string;
}): LeadChannels {
  const telegram = normalizeTelegramNick(config.telegram) !== null;
  const email = config.email.trim() !== "";
  const endpoint = config.leadEndpoint.trim() !== "";
  return { telegram, email, endpoint, any: telegram || email || endpoint };
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

/**
 * Link that opens the studio bot. `label` says where the person came from and
 * reaches the bot with the Start button; an unusable label is dropped.
 */
export function botLink(nick: string | null, label?: string): string | null {
  if (!nick) return null;
  const base = `https://t.me/${nick}`;
  return label && /^[A-Za-z0-9_-]{1,64}$/.test(label) ? `${base}?start=${label}` : base;
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

export type SubmitOutcome =
  /** Delivered. `telegram` opens the studio bot with this lead already attached. */
  | { status: "sent"; telegram: string | null }
  | { status: "fallback" };

/** Only a t.me link with a start label is ever put under a button. */
const CONTINUE_LINK = /^https:\/\/t\.me\/[A-Za-z0-9_]{4,32}\?start=[A-Za-z0-9_-]{1,64}$/;

/**
 * Posts the lead to `endpoint`. Never throws: anything other than a 2xx
 * answer within the timeout means the caller must offer another way,
 * so a visitor is never told "sent" when nothing arrived.
 */
export async function submitLead(
  endpoint: string,
  payload: unknown,
  fetchImpl: typeof fetch = fetch,
  timeoutMs = 8000,
): Promise<SubmitOutcome> {
  if (!endpoint.trim()) return { status: "fallback" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!response.ok) return { status: "fallback" };
    let telegram: string | null = null;
    try {
      const answer: unknown = await response.json();
      const link = (answer as { telegram?: unknown } | null)?.telegram;
      if (typeof link === "string" && CONTINUE_LINK.test(link)) telegram = link;
    } catch {
      // Delivered all the same; there is just no link to continue with.
    }
    return { status: "sent", telegram };
  } catch {
    return { status: "fallback" };
  } finally {
    clearTimeout(timer);
  }
}
