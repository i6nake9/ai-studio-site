import type { ReactNode } from "react";

/** Header button that leads to the lead form. */
export function HeaderCta({
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
