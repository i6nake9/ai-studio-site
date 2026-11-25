"use client";

import { useEffect, useId, useRef } from "react";

import { uk } from "@/content/uk";
import { channels } from "@/lib/contacts";
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
      aria-describedby={channels.any ? textId : undefined}
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
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border border-border-strong bg-card p-0 text-foreground shadow-[0_32px_64px_-24px_rgb(15_26_21/0.5)] backdrop:bg-[rgb(13_21_18/0.6)] open:animate-rise"
    >
      {/* Rendered only once opened: keeps the form out of the initial HTML. */}
      {session > 0 ? (
        <div className="relative p-6 sm:p-8">
          <h2 id={titleId} className="pr-10 text-[1.375rem] leading-tight font-bold tracking-[-0.015em]">
            {t.dialogTitle}
          </h2>
          {/* "Three fields…" makes no sense while the form is replaced by a notice. */}
          {channels.any ? (
            <p id={textId} className="mt-2 text-[0.9375rem] text-muted-foreground">
              {t.dialogText}
            </p>
          ) : null}
          <div className="mt-6">
            <LeadForm key={session} roi={roi} onSent={onSent} />
          </div>
          {/* Last in the markup so the first field, not this button, gets
              the focus when the dialog opens. */}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label={t.dialogClose}
            className="absolute top-2 right-2 grid size-11 place-items-center rounded-lg text-2xl leading-none text-muted-foreground hover:text-foreground"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      ) : null}
    </dialog>
  );
}
