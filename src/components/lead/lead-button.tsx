import type { ReactNode } from "react";

import type { LeadRoi } from "@/lib/lead";

interface LeadButtonProps {
  className?: string;
  children: ReactNode;
  /** Calculator figures to attach to the lead. */
  roi?: LeadRoi;
}

/** Any button on the page that leads to the lead form. */
export function LeadButton({ className, children }: LeadButtonProps) {
  return (
    <a href="#lead" className={className}>
      {children}
    </a>
  );
}
