import Link from "next/link";

import { linkAccent } from "@/components/cta";
import { LinkCards } from "@/components/link-cards";
import { articles, blogText } from "@/content/articles";
import { articleCard } from "@/lib/catalog";

/** Home page: the first articles of the blog and a link to the rest. */
export function BlogTeaser() {
  const t = blogText.home;
  return (
    <section id="blog" className="band border-t border-border">
      <div className="shell">
        <div className="max-w-[47.5rem]">
          <p className="eyebrow">{t.eyebrow}</p>
          <h2 className="h2 mt-2.5">{t.title}</h2>
          <p className="mt-2.5 text-muted-foreground">{t.lead}</p>
        </div>
        <LinkCards
          items={articles.slice(0, 6).map((article) => articleCard(article.slug))}
          tone="card"
          className="mt-7"
        />
        <Link href="/blog/" className={`${linkAccent} mt-4`}>
          {blogText.all} →
        </Link>
      </div>
    </section>
  );
}
