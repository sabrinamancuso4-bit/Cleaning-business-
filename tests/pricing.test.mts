// Run with: npm test  (uses Node's built-in test runner + type stripping)
import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateQuote, pricingConfig, resolveVisitsPerWeek } from "../src/config/pricing.ts";

const W = pricingConfig.weeksPerMonth;
const R = pricingConfig.hourlyRate;
const roundHalf = (v: number) => Math.round(v / 0.5) * 0.5;

test("office, 101–250 m², once a week, no extras", () => {
  const q = calculateQuote({ propertyType: "office", size: "m", frequency: "1", extras: [] });
  assert.equal(q.hoursPerVisit, 3.5);
  assert.equal(q.monthlyHours, roundHalf(3.5 * W)); // 15.17 -> 15
  assert.equal(q.monthlyEstimate, Math.round(15 * R));
  assert.ok(q.rangeLow < q.monthlyEstimate && q.rangeHigh > q.monthlyEstimate);
});

test("minimum hours per visit is enforced", () => {
  const q = calculateQuote({ propertyType: "communal", size: "xs", frequency: "1", extras: [] });
  assert.equal(q.hoursPerVisit, pricingConfig.minHoursPerVisit);
});

test("extras add per-visit hours, monthly deep clean, flat fees and rate uplift", () => {
  const q = calculateQuote({
    propertyType: "salon",
    size: "s",
    frequency: "2",
    extras: ["washroom", "kitchen", "deep", "consumables", "outOfHours"],
  });
  const routine = 2 * 1.15; // 2.3
  const perVisit = routine + 0.5 + 0.4; // 3.2
  const hours = roundHalf(perVisit * 2 * W + 1.5 * routine);
  assert.equal(q.monthlyHours, hours);
  assert.equal(q.effectiveHourlyRate, R * 1.15);
  assert.equal(q.monthlyFees, 35);
  assert.equal(q.monthlyEstimate, Math.round(hours * R * 1.15 + 35));
});

test("custom schedule is clamped to 1–7 visits", () => {
  assert.equal(resolveVisitsPerWeek({ frequency: "custom", customVisitsPerWeek: 12 }), 7);
  assert.equal(resolveVisitsPerWeek({ frequency: "custom", customVisitsPerWeek: 0 }), 1);
  assert.equal(resolveVisitsPerWeek({ frequency: "custom" }), 4);
});

test("more visits always cost more", () => {
  const base = { propertyType: "office", size: "l", extras: [] } as const;
  const a = calculateQuote({ ...base, frequency: "1" }).monthlyEstimate;
  const b = calculateQuote({ ...base, frequency: "3" }).monthlyEstimate;
  const c = calculateQuote({ ...base, frequency: "5" }).monthlyEstimate;
  assert.ok(a < b && b < c);
});
