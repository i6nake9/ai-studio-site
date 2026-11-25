"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import { rememberAd } from "@/lib/attribution";
import type { LeadRoi } from "@/lib/lead";
import { initialLeadDialog, leadDialogReducer } from "@/lib/lead-dialog-state";

import { LeadDialog } from "./lead-dialog";

interface LeadContextValue {
  /** Opens the lead dialog; `roi` attaches the calculator figures to the lead. */
  open: (roi?: LeadRoi) => void;
  close: () => void;
  roi: LeadRoi | undefined;
}

const LeadContext = createContext<LeadContextValue | null>(null);

export function LeadProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(leadDialogReducer, initialLeadDialog);

  // An advert link is seen only on the first page of a visit: keep its labels.
  useEffect(() => rememberAd(window.location.search), []);

  const open = useCallback(
    (roi?: LeadRoi) => dispatch({ type: "open", roi }),
    [],
  );
  const close = useCallback(() => dispatch({ type: "close" }), []);
  const sent = useCallback(() => dispatch({ type: "sent" }), []);

  const value = useMemo(
    () => ({ open, close, roi: state.roi }),
    [open, close, state.roi],
  );

  return (
    <LeadContext.Provider value={value}>
      {children}
      <LeadDialog
        open={state.isOpen}
        onOpenChange={(next) => (next ? open(state.roi) : close())}
        session={state.session}
        roi={state.roi}
        onSent={sent}
      />
    </LeadContext.Provider>
  );
}

export function useLead(): LeadContextValue {
  const value = useContext(LeadContext);
  if (!value) throw new Error("useLead must be used inside <LeadProvider>");
  return value;
}
