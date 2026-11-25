"use client";

import { type FormEvent, useEffect, useId, useRef, useState } from "react";

import { ctaPrimary, ctaSecondary } from "@/components/cta";
import { uk } from "@/content/uk";
import { channels, telegramNick } from "@/lib/contacts";
import {
  FIELD_LIMITS,
  type FieldErrors,
  type LeadFields,
  type LeadRoi,
  mailtoLink,
  prepareLead,
  submitLead,
  telegramLink,
} from "@/lib/lead";
import { cn } from "@/lib/utils";

import { siteConfig } from "../../../site.config";

const t = uk.lead;
const FIELDS = ["name", "business", "contact"] as const;
const AUTOCOMPLETE = { name: "name", business: "organization", contact: "off" } as const;
const EMPTY: LeadFields = { name: "", business: "", contact: "" };

type Screen =
  | { kind: "form" }
  | { kind: "submitting" }
  | { kind: "sent" }
  | { kind: "fallback"; message: string };

type CopyState = "idle" | "copied" | "failed";

interface LeadFormProps {
  /** Calculator figures to attach to the lead. */
  roi?: LeadRoi;
  /** Called once the lead has really been delivered. */
  onSent?: () => void;
}

/** The lead form. Used both in the dialog and in the last section of the page. */
export function LeadForm({ roi, onSent }: LeadFormProps) {
  const id = useId();
  const [fields, setFields] = useState<LeadFields>(EMPTY);
  const [trap, setTrap] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [screen, setScreen] = useState<Screen>({ kind: "form" });
  const [copy, setCopy] = useState<CopyState>("idle");
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Move focus to the new screen's heading so it is announced and visible.
  // Deferred by a frame so it runs after the browser has dealt with the
  // submit button, which had the focus, disappearing.
  useEffect(() => {
    if (screen.kind !== "sent" && screen.kind !== "fallback") return;
    const frame = requestAnimationFrame(() => resultHeading.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [screen.kind]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (screen.kind === "submitting") return;

    const prepared = prepareLead(fields, trap, siteConfig.brand, roi);
    if (prepared.status === "invalid") {
      setErrors(prepared.errors);
      const first = FIELDS.find((field) => prepared.errors[field]);
      if (first) {
        formRef.current
          ?.querySelector<HTMLInputElement>(`[name="${first}"]`)
          ?.focus();
      }
      return;
    }

    setErrors({});
    setCopy("idle");
    // A tripped bot trap is never posted and never answered with "sent".
    if (prepared.trapped) {
      setScreen({ kind: "fallback", message: prepared.message });
      return;
    }
    setScreen({ kind: "submitting" });
    const outcome = await submitLead(siteConfig.leadEndpoint, {
      ...prepared.lead,
      message: prepared.message,
      roi: roi ?? null,
    });
    if (outcome === "sent") {
      setScreen({ kind: "sent" });
      onSent?.();
    } else {
      setScreen({ kind: "fallback", message: prepared.message });
    }
  }

  async function copyMessage(message: string) {
    try {
      await navigator.clipboard.writeText(message);
      setCopy("copied");
    } catch {
      // No clipboard permission or an insecure context: the text stays
      // on screen, so the visitor can select it by hand.
      setCopy("failed");
    }
  }

  // No Telegram, no e-mail, no endpoint: a filled form would go nowhere, so
  // the visitor is told that instead of being asked to fill it.
  if (!channels.any) {
    return (
      <div role="status">
        <h3 className="font-display text-xl leading-tight font-medium">
          {t.notReady.title}
        </h3>
        <p className="mt-3 text-muted-foreground">{t.notReady.text}</p>
      </div>
    );
  }

  if (screen.kind === "sent") {
    return (
      <div role="status">
        <h3
          ref={resultHeading}
          tabIndex={-1}
          className="font-display text-xl leading-tight font-medium text-signal outline-none"
        >
          {t.sent.title}
        </h3>
        <p className="mt-3 text-muted-foreground">{t.sent.text}</p>
      </div>
    );
  }

  if (screen.kind === "fallback") {
    const { message } = screen;
    const telegram = telegramLink(telegramNick, message);
    const mail = mailtoLink(siteConfig.email, t.fallback.emailSubject, message);
    return (
      <div>
        <h3
          ref={resultHeading}
          tabIndex={-1}
          className="font-display text-xl leading-tight font-medium outline-none"
        >
          {t.fallback.title}
        </h3>
        <p className="mt-3 text-muted-foreground">
          {telegram ? t.fallback.text : t.fallback.textNoTelegram}
        </p>

        <p id={`${id}-message-label`} className="label-mono mt-6 text-muted-foreground">
          {t.fallback.messageLabel}
        </p>
        <pre
          aria-labelledby={`${id}-message-label`}
          tabIndex={0}
          className="mt-3 max-h-56 overflow-y-auto border border-input bg-background/60 p-4 font-mono text-sm break-words whitespace-pre-wrap select-all"
        >
          {message}
        </pre>

        <div className="mt-5 flex flex-col gap-3">
          {telegram ? (
            <a
              href={telegram}
              target="_blank"
              rel="noopener noreferrer"
              className={ctaPrimary}
            >
              {t.fallback.openTelegram}
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => copyMessage(message)}
            className={telegram ? ctaSecondary : ctaPrimary}
          >
            {copy === "copied" ? t.fallback.copied : t.fallback.copy}
          </button>
          {mail ? (
            <a href={mail} className={ctaSecondary}>
              {t.fallback.email}
            </a>
          ) : null}
        </div>

        <p aria-live="polite" className="mt-3 min-h-5 text-sm text-amber">
          {copy === "failed" ? t.fallback.copyFailed : ""}
        </p>

        <button
          type="button"
          onClick={() => setScreen({ kind: "form" })}
          className="mt-2 inline-flex min-h-11 items-center text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          {t.fallback.back}
        </button>
      </div>
    );
  }

  const submitting = screen.kind === "submitting";
  return (
    <form
      ref={formRef}
      method="post"
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5"
    >
      {FIELDS.map((field) => {
        const inputId = `${id}-${field}`;
        const error = errors[field];
        return (
          <div key={field}>
            <label htmlFor={inputId} className="block text-[0.95rem] leading-snug font-medium">
              {t.fields[field].label}
            </label>
            <input
              id={inputId}
              name={field}
              type="text"
              autoComplete={AUTOCOMPLETE[field]}
              maxLength={FIELD_LIMITS[field]}
              placeholder={t.fields[field].placeholder}
              value={fields[field]}
              required
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${inputId}-error` : undefined}
              onChange={(event) => {
                setFields((prev) => ({ ...prev, [field]: event.target.value }));
                if (error) setErrors((prev) => ({ ...prev, [field]: undefined }));
              }}
              className={cn(
                "mt-2 h-12 w-full min-w-0 rounded-[3px] border border-input bg-background/60 px-3.5 text-base outline-none placeholder:text-muted-foreground/60 focus-visible:border-signal",
                error && "border-destructive",
              )}
            />
            {error ? (
              <p id={`${inputId}-error`} className="mt-1.5 text-sm text-destructive">
                {t.required}
              </p>
            ) : null}
          </div>
        );
      })}

      {/* Bot trap: invisible to people, tempting to form-filling scripts. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          Не заповнюйте це поле
          <input
            type="text"
            name="lead_check_7q"
            tabIndex={-1}
            autoComplete="off"
            value={trap}
            onChange={(event) => setTrap(event.target.value)}
          />
        </label>
      </div>

      {roi ? <p className="text-sm text-signal">{t.roiAttached}</p> : null}

      <button type="submit" disabled={submitting} className={cn(ctaPrimary, "w-full")}>
        {submitting ? t.submitting : t.submit}
      </button>
    </form>
  );
}
