/**
 * Everything that is expected to change after launch lives here:
 * brand name, contacts, where leads go, prices and the exchange rate.
 */
export const siteConfig = {
  /** Working name. Change it here only; texts read it from this field. */
  brand: "Nerutyna",

  /**
   * Username of the studio's Telegram bot, without "@". Every Telegram button
   * opens it; the bot asks three questions and passes the chat to the owner.
   * While empty, no Telegram buttons are shown.
   */
  telegram: "Nerutyna_ai",

  /** Optional e-mail for people who do not use Telegram. */
  email: "",

  /**
   * The person a client talks to. While `name` is empty, the block shows no
   * name and no photo. `photo` is a file in `public/`, e.g. "founder.jpg".
   */
  founder: { name: "", photo: "" },

  /**
   * Address that accepts lead POSTs: "/api/lead" on the studio's own server
   * (set by deploy/deploy.sh). While empty, the form cannot deliver a lead
   * and shows its text for the visitor to send to the bot.
   */
  leadEndpoint: process.env.NEXT_PUBLIC_LEAD_ENDPOINT ?? "",

  /** Public address of the site, without a trailing slash. */
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://i6nake9.github.io/ai-studio-site",

  /** Hidden from search engines until the site moves to its own domain. */
  noindex: process.env.NEXT_PUBLIC_NOINDEX !== "false",

  /** UAH per 1 USD for the calculator (NBU rate on 2026-11-25, rounded). */
  uahPerUsd: 45,

  /** Price ranges in USD, shown in the price cards, the FAQ and the calculator notes. */
  prices: {
    audit: [0, 150],
    pilot: [500, 1500],
    full: [2000, 6000],
    support: [200, 800],
  },
} as const;

export type SiteConfig = typeof siteConfig;
