"use client";

import { useEffect, useId, useRef } from "react";

import { uk } from "@/content/uk";
import type { LeadRoi } from "@/lib/lead";
import { isBackdropDismiss } from "@/lib/lead-dialog-state";

import { LeadForm } from "./lead-form";

interface LeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** A new number means a new, empty form; it changes only after a lead is sent. */
  session: number;
  roi?: LeadRoi;
  onSent: () => void;
}

/**
 * The lead form in a modal window. Built on the native <dialog>: the browser
 * traps focus, closes on Esc and returns focus to the button that opened it.
 */
export function LeadDialog({
  open,
  onOpenChange,
  session,
  roi,
  onSent,
}: LeadDialogProps) {
  const t = uk.lead;
  const ref = useRef<HTMLDialogElement>(null);
  /** Where the mouse button went down, to tell a backdrop click from a drag. */
  const pressTarget = useRef<EventTarget | null>(null);
  const titleId = useId();
  const textId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={textId}
      onClose={() => onOpenChange(false)}
      // The dialog box itself has no padding, so an event whose target is the
      // <dialog> element landed on the backdrop.
      onMouseDown={(event) => {
        pressTarget.current = event.target;
      }}
      onClick={(event) => {
        if (isBackdropDismiss(pressTarget.current, event.target, event.currentTarget)) {
          onOpenChange(false);
        }
        pressTarget.current = null;
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-[3px] border border-input bg-popover p-0 text-popover-foreground backdrop:bg-black/70 open:animate-rise"
    >
      {/* Rendered only once opened: keeps the form out of the initial HTML. */}
      {session > 0 ? (
        <div className="relative p-6 sm:p-8">
          <h2 id={titleId} className="pr-10 font-display text-xl leading-tight font-medium">
            {t.dialogTitle}
          </h2>
          <p id={textId} className="mt-2 text-sm text-muted-foreground">
            {t.dialogText}
          </p>
          <div className="mt-6">
            <LeadForm key={session} roi={roi} onSent={onSent} />
          </div>
          {/* Last in the markup so the first field, not this button, gets
              the focus when the dialog opens. */}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label={t.dialogClose}
            className="absolute top-2 right-2 grid size-11 place-items-center font-mono text-2xl leading-none text-muted-foreground hover:text-foreground"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      ) : null}
    </dialog>
  );
}
