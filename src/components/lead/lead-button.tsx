"use client";

import type { ReactNode } from "react";

import type { LeadRoi } from "@/lib/lead";

import { useLead } from "./lead-provider";

interface LeadButtonProps {
  className?: string;
  children: ReactNode;
  /** Calculator figures to attach to the lead. */
  roi?: LeadRoi;
}

/**
 * Any button on the page that leads to the lead form. It is a link to the
 * form at the bottom of the page, so it still works before scripts load;
 * with scripts it opens the dialog instead.
 */
export function LeadButton({ className, children, roi }: LeadButtonProps) {
  const { open } = useLead();
  return (
    <a
      href="#lead"
      className={className}
      onClick={(event) => {
        // Let modified clicks (new tab, etc.) behave like a normal link.
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        open(roi);
      }}
    >
      {children}
    </a>
  );
}
