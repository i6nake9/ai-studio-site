import { ctaCompact, ctaPrimary, ctaSecondary } from "@/components/cta";
import { LeadButton } from "@/components/lead/lead-button";
import { uk } from "@/content/uk";
import { telegramUrl } from "@/lib/contacts";
import { cn } from "@/lib/utils";

/** The main action, always one thumb away on phones. Hidden on wide screens. */
export function MobileBar() {
  const t = uk.mobileBar;
  return (
    <div
      role="region"
      aria-label={t.label}
      className="fixed inset-x-0 bottom-0 z-30 flex gap-2.5 border-t border-border-strong bg-card px-4 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
    >
      {telegramUrl ? (
        <a
          href={telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(ctaSecondary, ctaCompact, "min-h-[3.125rem] flex-1")}
        >
          {t.telegram}
        </a>
      ) : null}
      <LeadButton className={cn(ctaPrimary, ctaCompact, "min-h-[3.125rem] flex-[1.4]")}>
        {t.audit}
      </LeadButton>
    </div>
  );
}
