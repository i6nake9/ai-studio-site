"use client";

import { type CSSProperties, useId, useState } from "react";

import { ctaPrimary } from "@/components/cta";
import { LeadButton } from "@/components/lead/lead-button";
import { uk } from "@/content/uk";
import {
  calculateRoi,
  convertCost,
  costLimits,
  type Currency,
  LIMITS,
  type RoiInput,
} from "@/lib/calculator";
import { formatMoney, formatMonths, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

import { siteConfig } from "../../../site.config";

const t = uk.calculator;
const { uahPerUsd } = siteConfig;

interface RangeFieldProps {
  label: string;
  hint?: string;
  /** Formatted current value, shown next to the label and read by screen readers. */
  display: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

function RangeField({
  label,
  hint,
  display,
  value,
  min,
  max,
  step,
  onChange,
}: RangeFieldProps) {
  const id = useId();
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-base leading-snug font-medium">
          {label}
        </label>
        <output
          htmlFor={id}
          aria-hidden="true"
          className="shrink-0 font-mono text-base text-signal tabular-nums"
        >
          {display}
        </output>
      </div>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1 text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      <input
        id={id}
        type="range"
        className="range"
        style={{ "--fill": `${fill}%` } as CSSProperties}
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={display}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

export function RoiCalculator() {
  const [employees, setEmployees] = useState<number>(LIMITS.employees.initial);
  const [routinePercent, setRoutinePercent] = useState<number>(
    LIMITS.routinePercent.initial,
  );
  const [currency, setCurrency] = useState<Currency>("USD");
  const [monthlyCost, setMonthlyCost] = useState<number>(LIMITS.costUsd.initial);

  const cost = costLimits(currency, uahPerUsd);
  const input: RoiInput = {
    employees,
    monthlyCost,
    routinePercent,
    currency,
    uahPerUsd,
  };
  const result = calculateRoi(input);

  function switchCurrency(next: Currency) {
    if (next === currency) return;
    setMonthlyCost(convertCost(monthlyCost, currency, next, uahPerUsd));
    setCurrency(next);
  }

  const currencies: { value: Currency; label: string }[] = [
    { value: "USD", label: t.currency.usd },
    { value: "UAH", label: t.currency.uah },
  ];

  const yearly = formatMoney(result.yearlySaving, currency);

  return (
    <section id="calculator" className="pb-14 sm:pb-[4.5rem]">
      <div className="shell">
        <div className="on-dark rounded-[1.125rem] px-5 py-7 sm:p-10 lg:p-[3.25rem]">
          <div className="max-w-[45rem]">
            <p className="eyebrow">{t.eyebrow}</p>
            <h2 className="h2 mt-2.5">{t.title}</h2>
            <p className="mt-2.5 text-muted-foreground">{t.lead}</p>
          </div>

          <div className="mt-9 grid gap-x-16 gap-y-8 lg:grid-cols-[1.1fr_0.9fr]">
            {/* inputs */}
            <div className="space-y-5">
              <RangeField
                label={t.employees.label}
                display={formatNumber(employees)}
                value={employees}
                {...LIMITS.employees}
                onChange={setEmployees}
              />

              <RangeField
                label={t.cost.label}
                hint={t.cost.hint}
                display={formatMoney(monthlyCost, currency)}
                value={monthlyCost}
                min={cost.min}
                max={cost.max}
                step={cost.step}
                onChange={setMonthlyCost}
              />

              <RangeField
                label={t.routine.label}
                hint={t.routine.hint}
                display={`${routinePercent}%`}
                value={routinePercent}
                {...LIMITS.routinePercent}
                onChange={setRoutinePercent}
              />

              <div className="flex items-center gap-3.5">
                <span id="calc-currency" className="text-[0.9375rem] text-muted-foreground">
                  {t.currency.label}
                </span>
                <div role="group" aria-labelledby="calc-currency" className="flex gap-1.5">
                  {currencies.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      aria-pressed={currency === item.value}
                      onClick={() => switchCurrency(item.value)}
                      className={cn(
                        "min-h-11 min-w-14 rounded-lg border px-3.5 text-[0.9375rem] font-semibold transition-colors",
                        currency === item.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border-strong hover:border-signal",
                      )}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* result */}
            <div className="flex flex-col gap-5 rounded-[0.875rem] border border-border bg-card p-5 sm:p-8">
              <dl aria-live="polite" className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
                <div className="border-b border-border pb-5 sm:col-span-2">
                  <dt className="label !text-muted-foreground">{t.results.yearly}</dt>
                  <dd
                    className={cn(
                      "mt-1.5 font-display leading-[1.05] font-semibold tracking-[-0.03em] text-signal tabular-nums",
                      // Long hryvnia figures get a smaller size so they fit a 320 px screen.
                      yearly.length > 10
                        ? "text-[clamp(1.375rem,6.2vw,2.75rem)]"
                        : "text-[clamp(2rem,9vw,3.375rem)]",
                    )}
                  >
                    {yearly}
                  </dd>
                </div>
                <div>
                  <dt className="label !text-muted-foreground">{t.results.hours}</dt>
                  <dd className="mt-1.5 font-display text-[1.625rem] leading-tight font-medium tabular-nums">
                    {formatNumber(result.hoursFreedPerMonth)}{" "}
                    <span className="font-sans text-base font-normal text-muted-foreground">
                      {t.results.hoursUnit}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="label !text-muted-foreground">{t.results.payback}</dt>
                  {result.paybackMonths === null ? (
                    <dd className="mt-1.5 text-[0.9375rem] leading-normal text-amber">
                      {t.longPayback}
                    </dd>
                  ) : (
                    <dd className="mt-1.5 font-display text-[1.625rem] leading-tight font-medium tabular-nums">
                      {formatMonths(result.paybackMonths)}
                    </dd>
                  )}
                </div>
              </dl>

              <LeadButton
                roi={{ input, result }}
                className={cn(ctaPrimary, "w-full px-5 text-base")}
              >
                {t.cta}
              </LeadButton>

              {/* assumptions */}
              <details className="text-[0.90625rem] leading-[1.55] text-muted-foreground">
                <summary className="inline-flex min-h-11 items-center font-medium text-foreground underline decoration-border-strong underline-offset-4 hover:text-signal">
                  {t.howTitle}
                </summary>
                <ul className="mt-1 list-disc space-y-1.5 pl-[1.125rem]">
                  {t.how.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </details>

              <p className="text-sm leading-normal text-muted-foreground">{t.estimateNote}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
