import a0 from "./blog/shcho-take-shi-agent";
import a1 from "./blog/skilky-koshtuye-chat-bot-telegram";
import a2 from "./blog/yak-avtomatyzuvaty-internet-mahazyn";
import a3 from "./blog/avtomatyzaciya-biznesu-za-dopomohoyu-shi";
import a4 from "./blog/avtomatychne-stvorennya-ttn-nova-poshta";
import a5 from "./blog/avtomatyzaciya-maloho-biznesu";
import a6 from "./blog/chatgpt-dlya-biznesu";
import a7 from "./blog/parsyng-cin-konkurentiv";
import { brand } from "./blog/shared";
import type { Article } from "./types";

/** Headings and labels of the blog pages. */
export const blogText = {
  metaTitle: `Блог про автоматизацію бізнесу та ШІ | ${brand}`,
  metaDescription:
    "Прості відповіді на питання про автоматизацію: що таке ШІ-агент, скільки коштує чат-бот, як створювати ТТН автоматично, з чого почати малому бізнесу.",
  eyebrow: "Блог",
  crumb: "Блог",
  h1: "Блог: автоматизація бізнесу простими словами",
  intro:
    "Відповіді на питання, які постають перед автоматизацією: що це, скільки коштує, з чого почати і що можна зробити самостійно. Без реклами чудес: де автоматизація не потрібна, так і пишемо.",
  summaryLabel: "Коротко",
  publishedLabel: "Опубліковано",
  updatedLabel: "оновлено",
  tocLabel: "Зміст",
  faqTitle: "Питання",
  relatedTitle: "Послуги за темою",
  moreTitle: "Інші статті",
  all: "Усі статті",
  home: {
    eyebrow: "Блог",
    title: "Відповіді на питання про автоматизацію",
    lead: "Що таке ШІ-агент, скільки коштує бот, що можна налаштувати самостійно й безкоштовно.",
  },
  taskTitle: "Корисно прочитати",
  start: {
    title: "З чого почати читати",
    items: [
      { slug: "avtomatyzaciya-maloho-biznesu", why: "якщо ще не знаєте, що автоматизувати першим" },
      { slug: "shcho-take-shi-agent", why: "якщо хочете зрозуміти, що вміє ШІ і де він помиляється" },
      { slug: "skilky-koshtuye-chat-bot-telegram", why: "якщо рахуєте бюджет на бота чи інтеграцію" },
    ],
  },
  aside: {
    title: "Не впевнені, з чого почати?",
    text: "Напишіть, як у вас влаштований процес. Розберемо його безкоштовно, у переписці, і скажемо, чи варто його автоматизувати.",
    button: "Безкоштовний аудит",
  },
};

/**
 * Blog articles. Each answers one question from search and gets the address
 * /blog/<slug>/, a card on the blog index and links from the service pages
 * named in `related`.
 *
 * Rules: the answer comes first (`summary`), no invented statistics, no
 * client results, no promises. Where automation is not needed, say so.
 */
/** Blog articles, newest topics first. Each lives in its own file in ./blog/. */
export const articles: Article[] = [a0, a1, a2, a3, a4, a5, a6, a7];

export function findArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

/** Articles that name the given service page as related. */
export function articlesAbout(serviceSlug: string) {
  return articles.filter((article) => article.related.includes(serviceSlug));
}

/** Other articles for the bottom of an article: those about the same services first. */
export function relatedArticles(slug: string, count: number): Article[] {
  const current = findArticle(slug);
  const topics = current?.related ?? [];
  const shared = (article: Article) => article.related.filter((s) => topics.includes(s)).length;
  return articles
    .filter((article) => article.slug !== slug)
    .map((article, index) => ({ article, index, score: shared(article) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, count)
    .map(({ article }) => article);
}

/**
 * Articles to read under a service, direction or industry page. `pages` are the
 * addresses the page is about, the page itself first: an article about it ranks
 * above articles that only share one of the others.
 */
export function readingFor(pages: string[], count: number): Article[] {
  const score = (article: Article) =>
    pages.reduce((sum, page, i) => sum + (article.related.includes(page) ? (i === 0 ? 10 : 1) : 0), 0);
  return articles
    .map((article, index) => ({ article, index, score: score(article) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, count)
    .map(({ article }) => article);
}
