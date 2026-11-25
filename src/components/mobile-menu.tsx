"use client";

import Link from "next/link";
import { useRef } from "react";

import { MenuIcon } from "@/components/icons";

interface MobileMenuProps {
  label: string;
  navLabel: string;
  /** "#section" links scroll within the page; the rest lead to other pages. */
  links: { href: string; label: string }[];
}

const itemClass =
  "flex min-h-12 items-center rounded-lg px-3 font-medium hover:bg-signal-soft";

/** Section menu for narrow screens: a native disclosure that closes after a choice. */
export function MobileMenu({ label, navLabel, links }: MobileMenuProps) {
  const details = useRef<HTMLDetailsElement>(null);
  const close = () => {
    if (details.current) details.current.open = false;
  };

  return (
    <details ref={details} className="lg:hidden">
      <summary
        aria-label={label}
        className="grid size-11 place-items-center rounded-lg border border-border-strong"
      >
        <MenuIcon className="size-[1.125rem]" />
      </summary>
      <nav
        aria-label={navLabel}
        className="absolute inset-x-4 top-full z-40 mt-2 rounded-xl border border-border-strong bg-card p-2 shadow-[0_24px_48px_-24px_rgb(15_26_21/0.45)] sm:inset-x-6"
      >
        <ul>
          {links.map((item) => (
            <li key={item.href}>
              {item.href.startsWith("#") ? (
                <a href={item.href} onClick={close} className={itemClass}>
                  {item.label}
                </a>
              ) : (
                <Link href={item.href} onClick={close} className={itemClass}>
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </details>
  );
}
