import { siteConfig } from "../../site.config";
import { leadChannels, normalizeTelegramNick, telegramLink } from "./lead";

/** Telegram username from the config, or null while it is empty or malformed. */
export const telegramNick = normalizeTelegramNick(siteConfig.telegram);

/** Link to the Telegram chat, or null: then no Telegram button may be rendered. */
export const telegramUrl = telegramLink(telegramNick);

/** Ways a lead can reach the studio; with none, the form shows a notice instead. */
export const channels = leadChannels(siteConfig);

// Printed by `next dev` and once during `next build`, never in the browser
// of a visitor.
if (
  !telegramNick &&
  (process.env.NODE_ENV === "development" || typeof window === "undefined")
) {
  console.warn(
    channels.any
      ? "[site.config] telegram is empty: Telegram buttons are hidden."
      : "[site.config] telegram, email and leadEndpoint are all empty: the lead form is replaced by a notice and no lead can arrive.",
  );
}
