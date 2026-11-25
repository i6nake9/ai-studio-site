import { cn } from "@/lib/utils";

const base =
  "inline-flex min-h-14 items-center justify-center gap-2.5 rounded-[0.625rem] px-7 py-3 text-center text-[1.0625rem] leading-tight font-semibold transition-colors duration-150 select-none disabled:pointer-events-none disabled:opacity-60";

/** Filled bright-green button: the one main action on a screen. */
export const ctaPrimary = cn(
  base,
  "bg-primary text-primary-foreground hover:bg-primary-hover active:translate-y-px",
);

/** Outlined button for the second action. */
export const ctaSecondary = cn(
  base,
  "border-[1.5px] border-foreground text-foreground hover:border-signal hover:text-signal active:translate-y-px",
);

/** Compact variant for the header and tight places. */
export const ctaCompact = "min-h-11 rounded-lg px-[1.125rem] py-2 text-[0.9375rem]";

/** Underlined text link used next to a main button. */
export const linkAccent =
  "inline-flex min-h-11 items-center font-semibold underline decoration-primary decoration-2 underline-offset-[5px] hover:text-signal";
