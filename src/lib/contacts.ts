import { siteConfig } from "../../site.config";
import { normalizeTelegramNick, telegramLink } from "./lead";

/** Telegram username from the config, or null while it is empty or malformed. */
export const telegramNick = normalizeTelegramNick(siteConfig.telegram);

/** Link to the Telegram chat, or null: then no Telegram button may be rendered. */
export const telegramUrl = telegramLink(telegramNick);

// Printed by `next dev` and once during `next build`, never in the browser
// of a visitor.
if (
  !telegramNick &&
  (process.env.NODE_ENV === "development" || typeof window === "undefined")
) {
  console.warn(
    "[site.config] telegram is empty: Telegram buttons are hidden and leads can only be copied.",
  );
}
