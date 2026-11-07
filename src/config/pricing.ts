/**
 * ILLUSTRATIVE pricing configuration for the quote estimator.
 *
 * These are assumptions for demonstration only. They are not market rates
 * and do not represent a binding quotation. Edit any number below and the
 * estimator, frequency comparison and assumptions panel update automatically.
 *
 * This file has no imports so it can be unit-tested with plain Node.
 */

export const pricingConfig = {
  currency: "GBP",
  /** Example hourly rate (£) used for all estimates. */
  hourlyRate: 19.5,
  /** Average weeks per month (52 / 12). */
  weeksPerMonth: 52 / 12,
  /** Minimum billable time per visit, in hours. */
  minHoursPerVisit: 1.5,
  /** Estimates are shown as a range of ± this fraction. */
  rangeVariance: 0.12,
  /** Out-of-hours visits apply this uplift to the hourly rate. */
  outOfHoursUplift: 0.15,
  /** Hours are rounded to the nearest increment. */
  hoursRounding: 0.5,
} as const;

export type PropertyTypeId = "office" | "salon" | "retail" | "communal" | "clinic" | "other";
export type SizeId = "xs" | "s" | "m" | "l" | "xl";
export type FrequencyId = "1" | "2" | "3" | "5" | "custom";
export type ExtraId = "washroom" | "kitchen" | "glass" | "deep" | "consumables" | "outOfHours";

export const propertyTypes: {
  id: PropertyTypeId;
  label: string;
  description: string;
  /** Multiplier on base hours reflecting typical intensity of the space. */
  multiplier: number;
}[] = [
  { id: "office", label: "Office", description: "Workspaces, meeting rooms, receptions", multiplier: 1 },
  { id: "salon", label: "Salon", description: "Hair, beauty and barbering", multiplier: 1.15 },
  { id: "retail", label: "Retail", description: "Shops, boutiques and showrooms", multiplier: 0.95 },
  { id: "communal", label: "Communal area", description: "Entrances, stairwells and corridors", multiplier: 0.85 },
  { id: "clinic", label: "Clinic", description: "Private clinics and dental practices", multiplier: 1.3 },
  { id: "other", label: "Other", description: "Something different? Tell us more later", multiplier: 1 },
];

export const sizes: {
  id: SizeId;
  label: string;
  /** Assumed cleaning hours for one routine visit (before multipliers). */
  baseHoursPerVisit: number;
}[] = [
  { id: "xs", label: "Under 50 m²", baseHoursPerVisit: 1.25 },
  { id: "s", label: "50–100 m²", baseHoursPerVisit: 2 },
  { id: "m", label: "101–250 m²", baseHoursPerVisit: 3.5 },
  { id: "l", label: "251–500 m²", baseHoursPerVisit: 6 },
  { id: "xl", label: "Over 500 m²", baseHoursPerVisit: 9 },
];

export const frequencies: { id: FrequencyId; label: string; visitsPerWeek: number | null }[] = [
  { id: "1", label: "Once per week", visitsPerWeek: 1 },
  { id: "2", label: "Twice per week", visitsPerWeek: 2 },
  { id: "3", label: "Three times per week", visitsPerWeek: 3 },
  { id: "5", label: "Five times per week", visitsPerWeek: 5 },
  { id: "custom", label: "Custom schedule", visitsPerWeek: null },
];

export const customVisitsRange = { min: 1, max: 7, default: 4 } as const;

export const extras: {
  id: ExtraId;
  label: string;
  description: string;
  /** Additional hours added to every visit. */
  hoursPerVisit?: number;
  /** Additional hours per month, as a fraction of one routine visit's hours. */
  monthlyVisitFraction?: number;
  /** Flat monthly charge in £. */
  monthlyFee?: number;
  /** Multiplier applied to the hourly rate. */
  rateUplift?: number;
}[] = [
  { id: "washroom", label: "Washroom cleaning", description: "Toilets, basins, mirrors and floors", hoursPerVisit: 0.5 },
  { id: "kitchen", label: "Kitchen cleaning", description: "Tea points, worktops, sinks and appliances", hoursPerVisit: 0.4 },
  { id: "glass", label: "Internal glass cleaning", description: "Partitions, doors and internal glazing", hoursPerVisit: 0.25 },
  { id: "deep", label: "Deep cleaning", description: "One periodic deep clean each month", monthlyVisitFraction: 1.5 },
  { id: "consumables", label: "Consumable replenishment", description: "Restocking handled for you (supplies billed separately)", monthlyFee: 35 },
  { id: "outOfHours", label: "Out-of-hours cleaning", description: "Early morning, evening or weekend visits", rateUplift: pricingConfig.outOfHoursUplift },
];

export type QuoteInput = {
  propertyType: PropertyTypeId;
  size: SizeId;
  frequency: FrequencyId;
  customVisitsPerWeek?: number;
  extras: readonly ExtraId[];
};

export type QuoteBreakdown = {
  visitsPerWeek: number;
  hoursPerVisit: number;
  visitsPerMonth: number;
  routineMonthlyHours: number;
  deepCleanMonthlyHours: number;
  monthlyHours: number;
  effectiveHourlyRate: number;
  labourCost: number;
  monthlyFees: number;
  monthlyEstimate: number;
  rangeLow: number;
  rangeHigh: number;
};

const roundTo = (value: number, step: number) => Math.round(value / step) * step;

export function resolveVisitsPerWeek(input: Pick<QuoteInput, "frequency" | "customVisitsPerWeek">): number {
  const freq = frequencies.find((f) => f.id === input.frequency);
  if (!freq) throw new Error(`Unknown frequency: ${input.frequency}`);
  if (freq.visitsPerWeek !== null) return freq.visitsPerWeek;
  const custom = input.customVisitsPerWeek ?? customVisitsRange.default;
  return Math.min(customVisitsRange.max, Math.max(customVisitsRange.min, Math.round(custom)));
}

/** Calculates an illustrative monthly estimate from the configuration above. */
export function calculateQuote(input: QuoteInput, config = pricingConfig): QuoteBreakdown {
  const type = propertyTypes.find((t) => t.id === input.propertyType);
  const size = sizes.find((s) => s.id === input.size);
  if (!type) throw new Error(`Unknown property type: ${input.propertyType}`);
  if (!size) throw new Error(`Unknown size: ${input.size}`);

  const selected = extras.filter((e) => input.extras.includes(e.id));
  const visitsPerWeek = resolveVisitsPerWeek(input);

  const routineHours = size.baseHoursPerVisit * type.multiplier;
  const extraHours = selected.reduce((sum, e) => sum + (e.hoursPerVisit ?? 0), 0);
  const hoursPerVisit = Math.max(config.minHoursPerVisit, routineHours + extraHours);

  const visitsPerMonth = visitsPerWeek * config.weeksPerMonth;
  const routineMonthlyHours = hoursPerVisit * visitsPerMonth;
  const deepCleanMonthlyHours = selected.reduce(
    (sum, e) => sum + (e.monthlyVisitFraction ?? 0) * routineHours,
    0,
  );
  const monthlyHours = roundTo(routineMonthlyHours + deepCleanMonthlyHours, config.hoursRounding);

  const uplift = selected.reduce((m, e) => m * (1 + (e.rateUplift ?? 0)), 1);
  const effectiveHourlyRate = config.hourlyRate * uplift;
  const labourCost = monthlyHours * effectiveHourlyRate;
  const monthlyFees = selected.reduce((sum, e) => sum + (e.monthlyFee ?? 0), 0);
  const monthlyEstimate = Math.round(labourCost + monthlyFees);

  return {
    visitsPerWeek,
    hoursPerVisit,
    visitsPerMonth,
    routineMonthlyHours,
    deepCleanMonthlyHours,
    monthlyHours,
    effectiveHourlyRate,
    labourCost,
    monthlyFees,
    monthlyEstimate,
    rangeLow: roundTo(monthlyEstimate * (1 - config.rangeVariance), 5),
    rangeHigh: roundTo(monthlyEstimate * (1 + config.rangeVariance), 5),
  };
}

export const formatGBP = (value: number, decimals = 0) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
