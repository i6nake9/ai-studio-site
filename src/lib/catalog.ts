import { articles } from "@/content/articles";
import { industries } from "@/content/industries";
import { tasks } from "@/content/tasks";
import { uk } from "@/content/uk";

export interface CardLink {
  href: string;
  title: string;
  text: string;
}

/** A card that leads to a task page or, failing that, to a direction page. */
export function serviceCard(slug: string, text?: string): CardLink {
  const task = tasks.find((item) => item.slug === slug);
  if (task) {
    return { href: `/poslugy/${task.slug}/`, title: task.short, text: text ?? task.card };
  }
  const direction = uk.solutions.items.find((item) => item.slug === slug);
  if (!direction) throw new Error(`No service page with the address "${slug}"`);
  return {
    href: `/poslugy/${direction.slug}/`,
    title: direction.short,
    text: text ?? direction.summary,
  };
}

export function industryCard(slug: string): CardLink {
  const item = industries.find((entry) => entry.slug === slug);
  if (!item) throw new Error(`No industry page with the address "${slug}"`);
  return { href: `/galuzi/${item.slug}/`, title: item.short, text: item.card };
}

/** Industry pages that list the given task or direction. */
export function industriesWith(serviceSlug: string): CardLink[] {
  return industries
    .filter((item) => item.services.some((link) => link.slug === serviceSlug))
    .map((item) => industryCard(item.slug));
}

export function articleCard(slug: string): CardLink {
  const article = articles.find((entry) => entry.slug === slug);
  if (!article) throw new Error(`No article with the address "${slug}"`);
  return { href: `/blog/${article.slug}/`, title: article.title, text: article.card };
}
