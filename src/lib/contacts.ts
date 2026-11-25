import { siteConfig } from "../../site.config";
import { normalizeTelegramNick, telegramLink } from "./lead";

/** Telegram username from the config, or null while it is empty or malformed. */
export const telegramNick = normalizeTelegramNick(siteConfig.telegram);

/** Link to the Telegram chat, or null: then no Telegram button may be rendered. */
export const telegramUrl = telegramLink(telegramNick);

if (process.env.NODE_ENV === "development" && !telegramNick) {
  console.warn(
    "[site.config] telegram is empty: Telegram buttons are hidden and leads can only be copied.",
  );
}
