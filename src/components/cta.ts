import { cn } from "@/lib/utils";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[3px] px-6 py-3 text-center text-[0.95rem] leading-tight font-semibold transition-colors duration-150 outline-none select-none disabled:pointer-events-none disabled:opacity-60";

/** Filled signal-green button: the one main action on a screen. */
export const ctaPrimary = cn(
  base,
  "bg-primary text-primary-foreground hover:bg-[oklch(0.9_0.17_155)] active:translate-y-px",
);

/** Outlined button for the second action. */
export const ctaSecondary = cn(
  base,
  "border border-input text-foreground hover:border-signal hover:text-signal active:translate-y-px",
);

/** Compact variant for the header. */
export const ctaCompact = "min-h-10 px-4 py-2 text-sm";
