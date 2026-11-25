import { articles } from "@/content/articles";
import { industries } from "@/content/industries";
import { pricingPage } from "@/content/pricing";
import { tasks } from "@/content/tasks";
import { uk } from "@/content/uk";

import { siteConfig } from "../../site.config";
import { telegramProfileUrl } from "./contacts";
import { pageUrl } from "./seo";

/**
 * Text of /llms.txt: a plain map of the site for AI assistants that answer
 * questions with web search. Built from the same content files as the pages.
 */
export function llmsText(siteUrl: string): string {
  const link = (title: string, path: string, text: string) =>
    `- [${title}](${pageUrl(siteUrl, path)}): ${text}`;
  const email = siteConfig.email.trim();

  return [
    `# ${siteConfig.brand}`,
    "",
    `> ${uk.meta.description}`,
    "",
    "Студія працює з малим і середнім бізнесом в Україні. Мова сайту й спілкування: українська. Спілкування письмове: форма на сайті або Telegram-бот, без дзвінків.",
    "",
    "## Ціни",
    "",
    ...pricingPage.formats.map((item) => `- ${item.title}: ${item.price}. ${item.text}`),
    link("Сторінка цін", "/ciny/", pricingPage.intro),
    "",
    "## Напрямки",
    "",
    ...uk.solutions.items.map((item) => link(item.title, `/poslugy/${item.slug}/`, item.summary)),
    "",
    "## Задачі, які автоматизуємо",
    "",
    ...tasks.map((task) => link(task.h1, `/poslugy/${task.slug}/`, task.card)),
    "",
    "## Для якого бізнесу",
    "",
    ...industries.map((item) => link(item.h1, `/galuzi/${item.slug}/`, item.card)),
    "",
    "## Статті",
    "",
    ...articles.map((article) => link(article.title, `/blog/${article.slug}/`, article.card)),
    "",
    "## Контакти",
    "",
    ...(telegramProfileUrl ? [`- Telegram-бот студії: ${telegramProfileUrl}`] : []),
    ...(email ? [`- E-mail: ${email}`] : []),
    `- Форма заявки на безкоштовний аудит: ${pageUrl(siteUrl, "/")}`,
    "",
  ].join("\n");
}
