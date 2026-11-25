import Link from "next/link";

import { uk } from "@/content/uk";

export interface Crumb {
  label: string;
  /** Left out for the current page, which is the last crumb. */
  href?: string;
}

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label={uk.servicePage.breadcrumbLabel} className="text-[0.90625rem] text-subtle">
      <ol className="flex flex-wrap items-center gap-x-2">
        {crumbs.map((crumb, i) => (
          <li key={crumb.label} className="flex items-center gap-x-2">
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-foreground"
              >
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page" className="inline-flex min-h-11 items-center text-foreground">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
