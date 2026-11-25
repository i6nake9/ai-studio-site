import { cn } from "@/lib/utils";

interface SectionHeadProps {
  /** Two-digit number shown before the eyebrow, e.g. "02". */
  index: string;
  eyebrow: string;
  title: string;
  lead?: string;
  className?: string;
}

/** Numbered label, heading and optional lead that open every section. */
export function SectionHead({
  index,
  eyebrow,
  title,
  lead,
  className,
}: SectionHeadProps) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <p className="label-mono flex items-center gap-3 text-signal">
        <span aria-hidden="true">{index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-signal/50" />
        {eyebrow}
      </p>
      <h2 className="mt-5 font-display text-[1.6rem] leading-[1.15] font-medium sm:text-4xl">
        {title}
      </h2>
      {lead ? (
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">{lead}</p>
      ) : null}
    </div>
  );
}
