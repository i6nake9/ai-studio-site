import type { LeadRoi } from "./lead";

export interface LeadDialogState {
  isOpen: boolean;
  /** Calculator figures of the button that opened the dialog, if any. */
  roi: LeadRoi | undefined;
  /** Identity of the form inside the dialog: a new number means an empty form. */
  session: number;
  /** A lead was sent, so the next opening must start with an empty form. */
  resetOnOpen: boolean;
}

export type LeadDialogAction =
  | { type: "open"; roi?: LeadRoi }
  | { type: "close" }
  | { type: "sent" };

export const initialLeadDialog: LeadDialogState = {
  isOpen: false,
  roi: undefined,
  session: 0,
  resetOnOpen: false,
};

/**
 * Closing the dialog (Esc, the backdrop, the close button) must not throw
 * away what the visitor typed: the form is kept until a lead is sent.
 */
export function leadDialogReducer(
  state: LeadDialogState,
  action: LeadDialogAction,
): LeadDialogState {
  switch (action.type) {
    case "open": {
      const fresh = state.session === 0 || state.resetOnOpen;
      return {
        isOpen: true,
        roi: action.roi,
        session: fresh ? state.session + 1 : state.session,
        resetOnOpen: false,
      };
    }
    case "close":
      return { ...state, isOpen: false };
    case "sent":
      return { ...state, resetOnOpen: true };
  }
}

/**
 * A click closes the dialog only when the mouse was both pressed and released
 * on the backdrop. Dragging a text selection out of the box is not a dismissal.
 */
export function isBackdropDismiss(
  pressTarget: unknown,
  clickTarget: unknown,
  dialog: unknown,
): boolean {
  return pressTarget === dialog && clickTarget === dialog;
}
