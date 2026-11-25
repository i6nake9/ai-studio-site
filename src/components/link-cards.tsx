import Link from "next/link";

import type { CardLink } from "@/lib/catalog";
import { cn } from "@/lib/utils";

interface LinkCardsProps {
  items: CardLink[];
  /** Background of a card: `page` on white bands, `card` on the page colour. */
  tone?: "page" | "card";
  className?: string;
}

/** Grid of cards, each a link to another page of the site. */
export function LinkCards({ items, tone = "page", className }: LinkCardsProps) {
  return (
    <ul className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={cn(
              "group flex h-full flex-col gap-2 rounded-xl border border-border p-5 hover:border-signal",
              tone === "page" ? "bg-background" : "bg-card",
            )}
          >
            <span className="text-lg leading-snug font-bold group-hover:text-signal">
              {item.title} <span aria-hidden="true">→</span>
            </span>
            <span className="text-[0.9375rem] leading-normal text-muted-foreground">{item.text}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
