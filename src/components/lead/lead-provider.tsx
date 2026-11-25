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
  /** Bumped on every opening so the form starts empty each time. */
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
        key={session}
        open={isOpen}
        onOpenChange={setIsOpen}
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
