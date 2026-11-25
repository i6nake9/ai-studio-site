import type { ReactNode } from "react";

/** Any button on the page that leads to the lead form. */
export function LeadButton({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href="#lead" className={className}>
      {children}
    </a>
  );
}
