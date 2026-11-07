"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  AppWindow,
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  DoorOpen,
  Info,
  LayoutGrid,
  MoonStar,
  PackageCheck,
  Pencil,
  RotateCcw,
  Scissors,
  ShowerHead,
  Sparkles,
  Stethoscope,
  Store,
  Utensils,
  X,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import {
  calculateQuote,
  customVisitsRange,
  extras,
  formatGBP,
  frequencies,
  pricingConfig,
  propertyTypes,
  sizes,
  type ExtraId,
  type FrequencyId,
  type PropertyTypeId,
  type SizeId,
} from "@/config/pricing";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import type { QuotePreset } from "./quote-context";

const typeIcons: Record<PropertyTypeId, React.ElementType> = {
  office: Building2,
  salon: Scissors,
  retail: Store,
  communal: DoorOpen,
  clinic: Stethoscope,
  other: LayoutGrid,
};

const extraIcons: Record<ExtraId, React.ElementType> = {
  washroom: ShowerHead,
  kitchen: Utensils,
  glass: AppWindow,
  deep: Sparkles,
  consumables: PackageCheck,
  outOfHours: MoonStar,
};

const STEPS = ["Property type", "Property size", "Frequency", "Requirements", "Your estimate"] as const;
const ENQUIRY = 5;

type State = {
  step: number;
  propertyType?: PropertyTypeId;
  size?: SizeId;
  frequency?: FrequencyId;
  customVisits: number;
  extras: ExtraId[];
};

const initialState = (preset: QuotePreset = {}): State => {
  // Start at the first step the preset hasn't already answered.
  const step = !preset.propertyType ? 0 : !preset.size ? 1 : !preset.frequency ? 2 : 3;
  return { step, ...preset, customVisits: customVisitsRange.default, extras: [] };
};

export function QuoteDialog({
  open,
  onOpenChange,
  preset,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preset: QuotePreset;
}) {
  const reduce = useReducedMotion();
  const [state, setState] = React.useState<State>(() => initialState(preset));
  const [direction, setDirection] = React.useState(1);
  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const mainRef = React.useRef<HTMLDivElement>(null);

  const complete = {
    0: !!state.propertyType,
    1: !!state.size,
    2: !!state.frequency,
    3: true,
  } as Record<number, boolean>;
  const canEstimate = complete[0] && complete[1] && complete[2];

  const quote = React.useMemo(
    () =>
      canEstimate
        ? calculateQuote({
            propertyType: state.propertyType!,
            size: state.size!,
            frequency: state.frequency!,
            customVisitsPerWeek: state.customVisits,
            extras: state.extras,
          })
        : null,
    [canEstimate, state.propertyType, state.size, state.frequency, state.customVisits, state.extras],
  );

  const goTo = (step: number) => {
    setDirection(step > state.step ? 1 : -1);
    setState((s) => ({ ...s, step }));
    mainRef.current?.scrollTo({ top: 0 });
    // Move focus to the new step heading for screen-reader and keyboard users.
    requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
  };

  const maxReachable = (() => {
    let i = 0;
    while (i < 4 && complete[i]) i++;
    return i;
  })();

  const select = <K extends "propertyType" | "size" | "frequency">(key: K, value: State[K], advance = true) => {
    setState((s) => ({ ...s, [key]: value }));
    if (advance) setTimeout(() => goTo(state.step + 1), reduce ? 0 : 220);
  };

  const toggleExtra = (id: ExtraId) =>
    setState((s) => ({ ...s, extras: s.extras.includes(id) ? s.extras.filter((e) => e !== id) : [...s.extras, id] }));

  const restart = () => {
    setDirection(-1);
    setState(initialState());
  };

  const typeLabel = propertyTypes.find((t) => t.id === state.propertyType)?.label;
  const sizeLabel = sizes.find((s) => s.id === state.size)?.label;
  const freqLabel =
    state.frequency === "custom"
      ? `Custom: ${state.customVisits} visit${state.customVisits > 1 ? "s" : ""} per week`
      : frequencies.find((f) => f.id === state.frequency)?.label;
  const extraLabels = extras.filter((e) => state.extras.includes(e.id)).map((e) => e.label);

  const summaryText = quote
    ? [
        `Quote estimator selections:`,
        `• Premises: ${typeLabel}, ${sizeLabel}`,
        `• Frequency: ${freqLabel}`,
        `• Additional requirements: ${extraLabels.length ? extraLabels.join(", ") : "None"}`,
        `• Illustrative estimate: ${formatGBP(quote.monthlyEstimate)}/month (approx. ${quote.monthlyHours} hours)`,
      ].join("\n")
    : "";

  const isEnquiry = state.step === ENQUIRY;
  const stepTitle = isEnquiry ? "Request a formal quote" : STEPS[state.step];

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-navy-900/60 backdrop-blur-sm data-[state=open]:animate-[fade-in_200ms_ease-out]" />
        <Dialog.Content
          aria-describedby="quote-desc"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            headingRef.current?.focus();
          }}
          className="fixed inset-0 z-[61] flex flex-col overflow-hidden bg-paper outline-none data-[state=open]:animate-[dialog-in_320ms_cubic-bezier(0.22,1,0.36,1)] sm:inset-auto sm:left-1/2 sm:top-1/2 sm:h-[min(800px,92dvh)] sm:w-[min(1080px,94vw)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-[1.75rem] sm:shadow-2xl lg:grid lg:grid-cols-[300px_1fr]"
        >
          {/* -------- Sidebar (desktop) -------- */}
          <aside className="relative hidden flex-col overflow-hidden bg-navy p-8 text-paper lg:flex">
            <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-teal/25 blur-3xl" />
            <p className="eyebrow text-teal-100">Quote estimator</p>
            <p className="mt-3 font-display text-2xl font-semibold leading-tight text-paper">
              An illustrative estimate in under two minutes
            </p>
            <nav aria-label="Estimator steps" className="mt-10">
              <ol className="flex flex-col gap-1">
                {STEPS.map((label, i) => {
                  const active = state.step === i || (isEnquiry && i === 4);
                  const done = i < 4 ? complete[i] && state.step !== i : false;
                  const reachable = i <= maxReachable || (i === 4 && canEstimate);
                  return (
                    <li key={label}>
                      <button
                        type="button"
                        disabled={!reachable}
                        onClick={() => goTo(i)}
                        aria-current={active ? "step" : undefined}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                          active ? "bg-white/10 text-paper" : "text-paper/60 hover:bg-white/5 hover:text-paper",
                          !reachable && "cursor-not-allowed opacity-40 hover:bg-transparent",
                        )}
                      >
                        <span
                          className={cn(
                            "grid size-7 shrink-0 place-items-center rounded-full border text-xs font-semibold transition-colors",
                            active ? "border-teal bg-teal text-white" : done ? "border-teal/60 text-teal-100" : "border-white/25",
                          )}
                        >
                          {done && !active ? <Check className="size-3.5" aria-hidden /> : i + 1}
                        </span>
                        {label}
                        {done && !active && <span className="sr-only">(completed, select to edit)</span>}
                      </button>
                    </li>
                  );
                })}
              </ol>
            </nav>

            <div className="mt-auto">
              <AnimatePresence>
                {quote && state.step < 4 && (
                  <motion.div
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-4"
                    aria-live="polite"
                  >
                    <p className="text-xs uppercase tracking-[0.14em] text-paper/60">Running estimate</p>
                    <p className="mt-1 font-display text-2xl font-semibold text-paper">
                      {formatGBP(quote.monthlyEstimate)}
                      <span className="text-sm font-normal text-paper/60"> /month</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              <p className="text-xs leading-relaxed text-paper/55">
                Estimates use example assumptions and are not binding quotations. No payment details are ever requested.
              </p>
            </div>
          </aside>

          {/* -------- Main panel -------- */}
          <div className="flex min-h-0 flex-1 flex-col">
            <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-8">
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted">
                  {isEnquiry ? "Final step" : `Step ${state.step + 1} of ${STEPS.length}`}
                  <span className="lg:hidden"> · Quote estimator</span>
                </p>
                <div className="mt-2 h-1 w-40 overflow-hidden rounded-full bg-mist sm:w-56" aria-hidden>
                  <motion.div
                    className="h-full rounded-full bg-teal"
                    animate={{ width: `${((Math.min(state.step, 4) + 1) / STEPS.length) * 100}%` }}
                    transition={{ duration: reduce ? 0 : 0.4 }}
                  />
                </div>
              </div>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon" aria-label="Close quote estimator">
                  <X className="!size-5" aria-hidden />
                </Button>
              </Dialog.Close>
            </header>
            <p id="quote-desc" className="sr-only">
              A five-step estimator that calculates an illustrative monthly cleaning cost. {siteConfig.demoNotice}
            </p>
            <Dialog.Title className="sr-only">Quote estimator</Dialog.Title>

            <div ref={mainRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-8">
              <h2
                ref={headingRef}
                tabIndex={-1}
                className="font-display text-2xl font-semibold text-navy outline-none sm:text-3xl"
              >
                {stepHeadings[state.step] ?? stepTitle}
              </h2>
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={state.step}
                  custom={direction}
                  initial={reduce ? false : { opacity: 0, x: direction * 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: direction * -24 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="mt-6"
                >
                  {state.step === 0 && (
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {propertyTypes.map((t) => (
                        <OptionCard
                          key={t.id}
                          selected={state.propertyType === t.id}
                          onClick={() => select("propertyType", t.id)}
                          icon={typeIcons[t.id]}
                          label={t.label}
                          description={t.description}
                        />
                      ))}
                    </div>
                  )}

                  {state.step === 1 && (
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {sizes.map((s, i) => (
                        <OptionCard
                          key={s.id}
                          selected={state.size === s.id}
                          onClick={() => select("size", s.id)}
                          visual={<SizeVisual level={i} />}
                          label={s.label}
                          description={`Approx. ${s.baseHoursPerVisit} hrs per routine visit (assumed)`}
                        />
                      ))}
                    </div>
                  )}

                  {state.step === 2 && (
                    <div className="flex flex-col gap-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {frequencies.map((f) => (
                          <OptionCard
                            key={f.id}
                            selected={state.frequency === f.id}
                            onClick={() => select("frequency", f.id, f.id !== "custom")}
                            visual={<WeekVisual visits={f.visitsPerWeek ?? state.customVisits} custom={f.visitsPerWeek === null} />}
                            label={f.label}
                            description={f.visitsPerWeek ? `${f.visitsPerWeek} visit${f.visitsPerWeek > 1 ? "s" : ""} each week` : "Choose your own number of weekly visits"}
                          />
                        ))}
                      </div>
                      <AnimatePresence initial={false}>
                        {state.frequency === "custom" && (
                          <motion.div
                            initial={reduce ? false : { opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p id="custom-visits-label" className="font-medium text-navy">Visits per week</p>
                                <p className="text-sm text-muted">Between {customVisitsRange.min} and {customVisitsRange.max} visits.</p>
                              </div>
                              <div className="flex items-center gap-3" role="group" aria-labelledby="custom-visits-label">
                                <Button variant="outline" size="icon" aria-label="Fewer visits" disabled={state.customVisits <= customVisitsRange.min} onClick={() => setState((s) => ({ ...s, customVisits: s.customVisits - 1 }))}>
                                  <Minus aria-hidden />
                                </Button>
                                <output aria-live="polite" className="w-10 text-center font-display text-2xl font-semibold text-navy">
                                  {state.customVisits}
                                </output>
                                <Button variant="outline" size="icon" aria-label="More visits" disabled={state.customVisits >= customVisitsRange.max} onClick={() => setState((s) => ({ ...s, customVisits: s.customVisits + 1 }))}>
                                  <Plus aria-hidden />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {state.step === 3 && (
                    <fieldset>
                      <legend className="mb-4 text-muted">Select any that apply — or continue without extras.</legend>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {extras.map((e) => {
                          const Icon = extraIcons[e.id];
                          const checked = state.extras.includes(e.id);
                          return (
                            <label
                              key={e.id}
                              className={cn(
                                "group relative flex min-h-20 cursor-pointer items-start gap-4 rounded-2xl border bg-white p-4 transition-all hover:border-navy/30 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-teal/30",
                                checked ? "border-teal bg-teal-100/40" : "border-line",
                              )}
                            >
                              <input type="checkbox" className="peer sr-only" checked={checked} onChange={() => toggleExtra(e.id)} />
                              <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl transition-colors", checked ? "bg-teal text-white" : "bg-mist text-navy")}>
                                <Icon className="size-5" aria-hidden />
                              </span>
                              <span className="flex-1">
                                <span className="block font-medium text-navy">{e.label}</span>
                                <span className="mt-0.5 block text-sm text-muted">{e.description}</span>
                              </span>
                              <span aria-hidden className={cn("mt-1 grid size-5 shrink-0 place-items-center rounded-md border transition-colors", checked ? "border-teal bg-teal text-white" : "border-navy/25")}>
                                {checked && <Check className="size-3.5" />}
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>
                  )}

                  {state.step === 4 && quote && (
                    <EstimateView
                      quote={quote}
                      rows={[
                        { label: "Property type", value: typeLabel!, step: 0 },
                        { label: "Property size", value: sizeLabel!, step: 1 },
                        { label: "Frequency", value: freqLabel!, step: 2 },
                        { label: "Additional requirements", value: extraLabels.length ? extraLabels.join(", ") : "None selected", step: 3 },
                      ]}
                      state={state}
                      onEdit={goTo}
                    />
                  )}

                  {isEnquiry && quote && (
                    <div className="max-w-2xl">
                      <EnquiryForm
                        compact
                        defaultValues={{ premisesType: typeLabel, message: summaryText + "\n\n" }}
                        context={
                          <div className="rounded-2xl border border-line bg-white p-4 text-sm">
                            <p className="font-medium text-navy">Your estimator selections (prefilled below)</p>
                            <p className="mt-1 text-muted">
                              {typeLabel} · {sizeLabel} · {freqLabel} · est. {formatGBP(quote.monthlyEstimate)}/month
                            </p>
                            <button type="button" onClick={() => goTo(4)} className="mt-2 inline-flex items-center gap-1 font-medium text-teal hover:underline">
                              <Pencil className="size-3.5" aria-hidden /> Edit selections
                            </button>
                          </div>
                        }
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* -------- Footer navigation -------- */}
            {!isEnquiry && (
              <footer className="flex items-center justify-between gap-3 border-t border-line bg-paper px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8">
                {state.step > 0 ? (
                  <Button variant="ghost" onClick={() => goTo(state.step - 1)}>
                    <ArrowLeft aria-hidden /> Back
                  </Button>
                ) : (
                  <span />
                )}
                {state.step < 3 && (
                  <Button onClick={() => goTo(state.step + 1)} disabled={!complete[state.step]}>
                    Continue <ArrowRight aria-hidden />
                  </Button>
                )}
                {state.step === 3 && (
                  <Button variant="accent" onClick={() => goTo(4)} disabled={!canEstimate}>
                    See my estimate <ArrowRight aria-hidden />
                  </Button>
                )}
                {state.step === 4 && (
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={restart} className="hidden sm:inline-flex">
                      <RotateCcw aria-hidden /> Start again
                    </Button>
                    <Button variant="accent" onClick={() => goTo(ENQUIRY)}>
                      Request a Formal Quote <ArrowRight aria-hidden />
                    </Button>
                  </div>
                )}
              </footer>
            )}
            {isEnquiry && (
              <footer className="border-t border-line px-5 py-3 sm:px-8">
                <Button variant="ghost" size="sm" onClick={() => goTo(4)}>
                  <ArrowLeft aria-hidden /> Back to estimate
                </Button>
              </footer>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const stepHeadings: Record<number, string> = {
  0: "What type of premises needs cleaning?",
  1: "Roughly how large is the space?",
  2: "How often would you like cleaning?",
  3: "Any additional requirements?",
  4: "Your illustrative estimate",
  5: "Request a formal quote",
};

/* ---------------- Sub-components ---------------- */

function OptionCard({
  selected,
  onClick,
  icon: Icon,
  visual,
  label,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon?: React.ElementType;
  visual?: React.ReactNode;
  label: string;
  description: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "group relative flex min-h-24 items-start gap-4 rounded-2xl border bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-soft",
        selected ? "border-teal ring-1 ring-teal" : "border-line",
      )}
    >
      {Icon && (
        <span className={cn("grid size-11 shrink-0 place-items-center rounded-xl transition-colors", selected ? "bg-teal text-white" : "bg-mist text-navy group-hover:bg-navy group-hover:text-paper")}>
          <Icon className="size-5" aria-hidden />
        </span>
      )}
      {visual}
      <span className="flex-1 pr-6">
        <span className="block font-display font-semibold text-navy">{label}</span>
        <span className="mt-1 block text-sm leading-snug text-muted">{description}</span>
      </span>
      <span
        aria-hidden
        className={cn(
          "absolute right-4 top-4 grid size-5 place-items-center rounded-full border transition-all",
          selected ? "scale-100 border-teal bg-teal text-white" : "border-navy/20",
        )}
      >
        {selected && <Check className="size-3" />}
      </span>
    </button>
  );
}

function SizeVisual({ level }: { level: number }) {
  return (
    <span aria-hidden className="grid size-11 shrink-0 place-items-end rounded-xl bg-mist p-2">
      <span className="block rounded-[3px] bg-navy" style={{ width: `${30 + level * 17.5}%`, height: `${30 + level * 17.5}%` }} />
    </span>
  );
}

function WeekVisual({ visits, custom }: { visits: number; custom?: boolean }) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const patterns: Record<number, number[]> = {
    1: [0], 2: [0, 3], 3: [0, 2, 4], 4: [0, 1, 3, 4], 5: [0, 1, 2, 3, 4], 6: [0, 1, 2, 3, 4, 5], 7: [0, 1, 2, 3, 4, 5, 6],
  };
  const on = patterns[visits] ?? [];
  return (
    <span aria-hidden className="flex shrink-0 gap-0.5 self-center">
      {days.map((d, i) => (
        <span
          key={i}
          className={cn(
            "grid h-7 w-4 place-items-center rounded-[4px] text-[0.55rem] font-semibold",
            on.includes(i) ? (custom ? "bg-teal text-white" : "bg-navy text-paper") : "bg-mist text-muted",
          )}
        >
          {d}
        </span>
      ))}
    </span>
  );
}

function EstimateView({
  quote,
  rows,
  state,
  onEdit,
}: {
  quote: ReturnType<typeof calculateQuote>;
  rows: { label: string; value: string; step: number }[];
  state: State;
  onEdit: (step: number) => void;
}) {
  const type = propertyTypes.find((t) => t.id === state.propertyType)!;
  const size = sizes.find((s) => s.id === state.size)!;
  const selectedExtras = extras.filter((e) => state.extras.includes(e.id));
  const fmtH = (h: number) => `${Number(h.toFixed(2))} hrs`;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
      <div className="flex flex-col gap-6">
        <div className="relative overflow-hidden rounded-3xl bg-navy p-6 text-paper sm:p-8" aria-live="polite">
          <div aria-hidden className="pointer-events-none absolute -bottom-20 -right-16 size-60 rounded-full bg-teal/30 blur-3xl" />
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-paper/85">
            <Info className="size-3.5" aria-hidden /> Illustrative estimate — not a quotation
          </p>
          <p className="mt-5 text-sm text-paper/70">Estimated monthly price</p>
          <p className="font-display text-5xl font-semibold tracking-tight text-paper sm:text-6xl">
            {formatGBP(quote.monthlyEstimate)}
            <span className="ml-1 text-lg font-normal text-paper/60">/month</span>
          </p>
          <p className="mt-2 text-sm text-paper/70">
            Likely range {formatGBP(quote.rangeLow)} – {formatGBP(quote.rangeHigh)} · excl. VAT
          </p>
          <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-sm">
            <div>
              <dt className="text-paper/60">Monthly hours</dt>
              <dd className="mt-1 font-display text-xl font-semibold">{quote.monthlyHours}</dd>
            </div>
            <div>
              <dt className="text-paper/60">Visits / month</dt>
              <dd className="mt-1 font-display text-xl font-semibold">≈{Math.round(quote.visitsPerMonth)}</dd>
            </div>
            <div>
              <dt className="text-paper/60">Hours / visit</dt>
              <dd className="mt-1 font-display text-xl font-semibold">{Number(quote.hoursPerVisit.toFixed(2))}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border border-line bg-white">
          <h3 className="border-b border-line px-5 py-3 text-sm font-semibold">Summary of your selections</h3>
          <dl className="divide-y divide-line">
            {rows.map((r) => (
              <div key={r.label} className="flex items-start justify-between gap-4 px-5 py-3">
                <div>
                  <dt className="text-xs text-muted">{r.label}</dt>
                  <dd className="mt-0.5 text-sm font-medium text-navy">{r.value}</dd>
                </div>
                <button
                  type="button"
                  onClick={() => onEdit(r.step)}
                  className="inline-flex min-h-10 items-center gap-1 rounded-lg px-2 text-sm font-medium text-teal hover:bg-teal-100/60"
                  aria-label={`Edit ${r.label.toLowerCase()}`}
                >
                  <Pencil className="size-3.5" aria-hidden /> Edit
                </button>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-line bg-white p-5">
          <h3 className="text-sm font-semibold">How this estimate was calculated</h3>
          <p className="mt-1 text-xs text-muted">Example assumptions from the editable pricing configuration.</p>
          <dl className="mt-4 space-y-2.5 text-sm">
            <AssumptionRow label={`Base time for ${size.label}`} value={fmtH(size.baseHoursPerVisit)} />
            <AssumptionRow label={`${type.label} intensity factor`} value={`× ${type.multiplier}`} />
            {selectedExtras.filter((e) => e.hoursPerVisit).map((e) => (
              <AssumptionRow key={e.id} label={`+ ${e.label}`} value={`+${e.hoursPerVisit} hrs/visit`} />
            ))}
            <AssumptionRow label="Minimum visit length" value={fmtH(pricingConfig.minHoursPerVisit)} />
            <AssumptionRow label="Visits per week × weeks per month" value={`${quote.visitsPerWeek} × ${pricingConfig.weeksPerMonth.toFixed(2)}`} />
            {quote.deepCleanMonthlyHours > 0 && <AssumptionRow label="+ Monthly deep clean" value={`+${fmtH(quote.deepCleanMonthlyHours)}`} />}
            <AssumptionRow label="Example hourly rate" value={formatGBP(pricingConfig.hourlyRate, 2)} />
            {quote.effectiveHourlyRate !== pricingConfig.hourlyRate && (
              <AssumptionRow label={`Out-of-hours uplift (+${pricingConfig.outOfHoursUplift * 100}%)`} value={formatGBP(quote.effectiveHourlyRate, 2)} />
            )}
            {quote.monthlyFees > 0 && <AssumptionRow label="Consumables management fee" value={`${formatGBP(quote.monthlyFees)}/month`} />}
            <div className="flex justify-between gap-4 border-t border-line pt-3 font-medium text-navy">
              <dt>
                {quote.monthlyHours} hrs × {formatGBP(quote.effectiveHourlyRate, 2)}
                {quote.monthlyFees > 0 && ` + ${formatGBP(quote.monthlyFees)}`}
              </dt>
              <dd>{formatGBP(quote.monthlyEstimate)}</dd>
            </div>
          </dl>
        </div>
        <p className="rounded-2xl bg-mist p-5 text-sm leading-relaxed text-charcoal">
          <strong className="font-semibold text-navy">Please note:</strong> this figure is for illustration only, based on
          assumed cleaning times and an example hourly rate. It is not a market quotation or a binding price. A final
          price would require a premises assessment. Consumable supplies would be billed separately.
        </p>
      </div>
    </div>
  );
}

function AssumptionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="shrink-0 text-right font-medium text-charcoal">{value}</dd>
    </div>
  );
}
