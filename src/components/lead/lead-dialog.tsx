"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { uk } from "@/content/uk";
import type { LeadRoi } from "@/lib/lead";

import { LeadForm } from "./lead-form";

interface LeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roi?: LeadRoi;
}

export function LeadDialog({ open, onOpenChange, roi }: LeadDialogProps) {
  const t = uk.lead;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        closeLabel={t.dialogClose}
        className="max-h-[calc(100dvh-2rem)] gap-6 overflow-y-auto rounded-[3px] border border-input p-6 text-base ring-0 sm:max-w-lg sm:p-8"
      >
        <DialogHeader className="pr-8">
          <DialogTitle className="font-display text-xl leading-tight font-medium">
            {t.dialogTitle}
          </DialogTitle>
          <DialogDescription>{t.dialogText}</DialogDescription>
        </DialogHeader>
        <LeadForm roi={roi} />
      </DialogContent>
    </Dialog>
  );
}
