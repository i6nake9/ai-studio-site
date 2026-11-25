import { expect, test } from "vitest";

import { calculateRoi } from "./calculator";
import {
  initialLeadDialog,
  isBackdropDismiss,
  leadDialogReducer,
} from "./lead-dialog-state";

const input = {
  employees: 5,
  monthlyCost: 700,
  routinePercent: 40,
  currency: "USD" as const,
  uahPerUsd: 45,
};
const roi = { input, result: calculateRoi(input) };

test("closing and reopening the dialog keeps the same form, so typed text is not lost", () => {
  const opened = leadDialogReducer(initialLeadDialog, { type: "open" });
  expect(opened).toMatchObject({ isOpen: true, session: 1 });
  const closed = leadDialogReducer(opened, { type: "close" });
  expect(closed).toMatchObject({ isOpen: false, session: 1 });
  expect(leadDialogReducer(closed, { type: "open" })).toMatchObject({
    isOpen: true,
    session: 1,
  });
});

test("after a lead is sent the next opening starts with an empty form", () => {
  let state = leadDialogReducer(initialLeadDialog, { type: "open" });
  state = leadDialogReducer(state, { type: "sent" });
  expect(state.session).toBe(1);
  state = leadDialogReducer(state, { type: "close" });
  state = leadDialogReducer(state, { type: "open" });
  expect(state.session).toBe(2);
  state = leadDialogReducer(leadDialogReducer(state, { type: "close" }), { type: "open" });
  expect(state.session).toBe(2);
});

test("each opening carries the calculator figures of the button that opened it", () => {
  const fromCalculator = leadDialogReducer(initialLeadDialog, { type: "open", roi });
  expect(fromCalculator.roi).toBe(roi);
  const fromHeader = leadDialogReducer(
    leadDialogReducer(fromCalculator, { type: "close" }),
    { type: "open" },
  );
  expect(fromHeader.roi).toBeUndefined();
});

test("only a click that starts and ends on the backdrop closes the dialog", () => {
  const dialog = {};
  const text = {};
  expect(isBackdropDismiss(dialog, dialog, dialog)).toBe(true);
  // Selecting the lead text and releasing the mouse outside the box.
  expect(isBackdropDismiss(text, dialog, dialog)).toBe(false);
  expect(isBackdropDismiss(dialog, text, dialog)).toBe(false);
  expect(isBackdropDismiss(null, dialog, dialog)).toBe(false);
});
