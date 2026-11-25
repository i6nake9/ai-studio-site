"use client";

import { type CSSProperties, useId, useState } from "react";

import { ctaPrimary } from "@/components/cta";
import { LeadButton } from "@/components/lead/lead-button";
import { SectionHead } from "@/components/section-head";
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
        <label htmlFor={id} className="text-[0.95rem] font-medium">
          {label}
        </label>
        <output
          htmlFor={id}
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
        className="range mt-1"
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

  return (
    <section id="calculator" className="border-t border-border py-20 sm:py-28">
      <div className="shell">
        <SectionHead index="03" eyebrow={t.eyebrow} title={t.title} lead={t.lead} />

        <div className="mt-12 grid border border-border lg:grid-cols-[1.05fr_0.95fr]">
          {/* inputs */}
          <div className="space-y-8 p-6 sm:p-9">
            <RangeField
              label={t.employees.label}
              display={formatNumber(employees)}
              value={employees}
              {...LIMITS.employees}
              onChange={setEmployees}
            />

            <div>
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
              <div
                role="group"
                aria-label={t.currency.label}
                className="mt-2 inline-flex border border-input"
              >
                {currencies.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    aria-pressed={currency === item.value}
                    onClick={() => switchCurrency(item.value)}
                    className={cn(
                      "min-h-11 min-w-14 px-4 font-mono text-sm transition-colors",
                      currency === item.value
                        ? "bg-signal text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <RangeField
              label={t.routine.label}
              hint={t.routine.hint}
              display={`${routinePercent}%`}
              value={routinePercent}
              {...LIMITS.routinePercent}
              onChange={setRoutinePercent}
            />
          </div>

          {/* result */}
          <div className="flex flex-col border-t border-border bg-card/60 p-6 sm:p-9 lg:border-t-0 lg:border-l">
            <dl aria-live="polite" className="grid gap-7 sm:grid-cols-2">
              <div className="border-b border-border pb-7 sm:col-span-2">
                <dt className="label-mono text-muted-foreground">{t.results.yearly}</dt>
                <dd className="mt-3 font-display text-[2rem] leading-none font-medium text-signal tabular-nums sm:text-5xl">
                  {formatMoney(result.yearlySaving, currency)}
                </dd>
              </div>
              <div>
                <dt className="label-mono text-muted-foreground">{t.results.hours}</dt>
                <dd className="mt-3 font-display text-2xl leading-none font-medium tabular-nums">
                  {formatNumber(result.hoursFreedPerMonth)}{" "}
                  <span className="font-sans text-base font-normal text-muted-foreground">
                    {t.results.hoursUnit}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="label-mono text-muted-foreground">{t.results.payback}</dt>
                {result.paybackMonths === null ? (
                  <dd className="mt-3 text-[0.95rem] text-amber">{t.longPayback}</dd>
                ) : (
                  <dd className="mt-3 font-display text-2xl leading-none font-medium tabular-nums">
                    {formatMonths(result.paybackMonths)}
                  </dd>
                )}
              </div>
            </dl>

            <p className="mt-7 text-sm text-muted-foreground">{t.estimateNote}</p>

            <div className="mt-auto pt-8">
              <LeadButton roi={{ input, result }} className={cn(ctaPrimary, "w-full")}>
                {t.cta}
              </LeadButton>
            </div>
          </div>

          {/* assumptions */}
          <details className="group border-t border-border lg:col-span-2">
            <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 px-6 text-[0.95rem] font-medium hover:text-signal sm:px-9 [&::-webkit-details-marker]:hidden">
              {t.howTitle}
              <span
                aria-hidden="true"
                className="font-mono text-xl leading-none font-normal text-signal transition-transform duration-200 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <ul className="space-y-2 px-6 pb-7 text-[0.95rem] text-muted-foreground sm:px-9">
              {t.how.map((line) => (
                <li key={line} className="flex gap-3">
                  <span aria-hidden="true" className="mt-[0.6rem] size-1.5 shrink-0 bg-signal" />
                  {line}
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </section>
  );
}
