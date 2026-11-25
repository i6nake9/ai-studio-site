"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import type { LeadRoi } from "@/lib/lead";

import { LeadDialog } from "./lead-dialog";

interface LeadContextValue {
  /** Opens the lead dialog; `roi` attaches the calculator figures to the lead. */
  open: (roi?: LeadRoi) => void;
  close: () => void;
  roi: LeadRoi | undefined;
}

const LeadContext = createContext<LeadContextValue | null>(null);

export function LeadProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [roi, setRoi] = useState<LeadRoi | undefined>(undefined);
  /** Counts openings: the dialog uses it to start with an empty form each time. */
  const [session, setSession] = useState(0);

  const open = useCallback((nextRoi?: LeadRoi) => {
    setRoi(nextRoi);
    setSession((n) => n + 1);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open, close, roi }), [open, close, roi]);

  return (
    <LeadContext.Provider value={value}>
      {children}
      <LeadDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        session={session}
        roi={roi}
      />
    </LeadContext.Provider>
  );
}

export function useLead(): LeadContextValue {
  const value = useContext(LeadContext);
  if (!value) throw new Error("useLead must be used inside <LeadProvider>");
  return value;
}
