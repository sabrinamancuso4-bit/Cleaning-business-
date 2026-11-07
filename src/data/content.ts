import { images, type SiteImage } from "@/config/images";
import type { PropertyTypeId } from "@/config/pricing";

/* ---------------- Why choose us (proposed commitments) ---------------- */
export const commitments = [
  {
    icon: "CalendarClock",
    title: "Flexible cleaning schedules",
    body: "Early mornings, evenings or during the day — visits planned around your opening hours, not ours.",
  },
  {
    icon: "Layers",
    title: "Tailored cleaning plans",
    body: "A written scope for your premises, so everyone knows exactly what is cleaned and how often.",
  },
  {
    icon: "MessageSquare",
    title: "Clear communication",
    body: "One named point of contact and a simple way to raise requests or changes.",
  },
  {
    icon: "ClipboardCheck",
    title: "Consistent quality checks",
    body: "Planned spot checks against your agreed scope, with issues followed up promptly.",
  },
  {
    icon: "FileText",
    title: "Transparent quotations",
    body: "Itemised quotes based on the time your space needs. No hidden extras.",
  },
] as const;

/* ---------------- Process ---------------- */
export const processSteps = [
  {
    title: "Tell us about your premises",
    body: "Share the type and size of space, how it’s used and when you’d like cleaning to happen. It takes a couple of minutes.",
    detail: ["Property type and approximate size", "Preferred days and times", "Any specialist areas or access needs"],
  },
  {
    title: "Receive a tailored quotation",
    body: "We would visit or video-call to assess the space, then send a clear, itemised quotation.",
    detail: ["Premises walk-through", "Written scope of work", "Itemised monthly price"],
  },
  {
    title: "Agree your cleaning schedule",
    body: "Choose visit days and times, confirm access arrangements and agree how you’d like to stay in touch.",
    detail: ["Visit frequency and timings", "Keys, alarms and access", "Named point of contact"],
  },
  {
    title: "Enjoy a consistently maintained workspace",
    body: "Regular visits, planned quality checks and easy adjustments as your business changes.",
    detail: ["Routine visits to the agreed scope", "Periodic quality reviews", "Flexible changes with notice"],
  },
] as const;

/* ---------------- Industries ---------------- */
export type Industry = {
  id: string;
  title: string;
  image: SiteImage;
  quoteType: PropertyTypeId;
  challenge: string;
  approach: string[];
  timing: string;
  note?: string;
};

export const industries: Industry[] = [
  {
    id: "offices",
    title: "Offices & workspaces",
    image: images.meetingRoom,
    quoteType: "office",
    challenge: "Shared desks, busy kitchens and meeting rooms that need to be ready for the next client at short notice.",
    approach: [
      "Focus on touchpoints, kitchens and washrooms used by many people",
      "Meeting rooms reset to a consistent standard",
      "Clear-desk approach agreed to protect confidential material",
    ],
    timing: "Typically early morning or after 6pm",
  },
  {
    id: "salons",
    title: "Salons & barbershops",
    image: images.salon,
    quoteType: "salon",
    challenge: "Hair, product residue and constant footfall in a space where atmosphere is part of the service.",
    approach: [
      "Attention to floors, corners and skirting where hair gathers",
      "Mirrors, chrome and basins left streak-free",
      "Works alongside the hygiene routines your team already follows",
    ],
    timing: "Usually after closing",
  },
  {
    id: "retail",
    title: "Retail & boutiques",
    image: images.retail,
    quoteType: "retail",
    challenge: "First impressions at the door, fingerprints on glass and footfall that varies with the seasons.",
    approach: [
      "Entrances, glazing and displays prioritised",
      "Care taken around stock and merchandising",
      "Visit frequency adjustable for busy trading periods",
    ],
    timing: "Before opening or after close",
  },
  {
    id: "property",
    title: "Property managers",
    image: images.communal,
    quoteType: "communal",
    challenge: "Multiple buildings, residents with high expectations and a need for simple, reliable reporting.",
    approach: [
      "Consistent checklist for every visit",
      "Issues such as damaged fittings reported to you",
      "One contact point across a portfolio of buildings",
    ],
    timing: "Weekday daytime visits",
  },
  {
    id: "clinics",
    title: "Private clinics & dental practices",
    image: images.clinic,
    quoteType: "clinic",
    challenge: "Patients expect visibly immaculate spaces, and clinical areas carry strict infection-control requirements.",
    approach: [
      "Initial scope limited to receptions, waiting rooms, offices and washrooms",
      "Follows the practice’s own protocols and colour-coding",
      "Visit records on an agreed checklist",
    ],
    timing: "After the last appointment",
    note: "Cleaning of clinical treatment areas is a planned future capability. It would only be offered once suitable training, documented procedures and appropriate insurance are in place. This demo business is not currently qualified to provide clinical cleaning.",
  },
];

/* ---------------- FAQs ---------------- */
export const faqs = [
  {
    q: "How much does commercial cleaning cost?",
    a: "Pricing would depend mainly on the size of your premises, how often you need cleaning and any extras such as washrooms or out-of-hours visits. Our quote estimator gives an illustrative monthly figure using example assumptions. A formal quotation would always follow a premises assessment.",
  },
  {
    q: "Do you offer cleaning outside office hours?",
    a: "The proposed service is designed to include early-morning, evening and weekend visits so cleaning doesn’t disrupt your team or customers. Out-of-hours visits may carry a small uplift, which the estimator shows clearly.",
  },
  {
    q: "Can I arrange a regular contract?",
    a: "Yes — recurring weekly and monthly contracts are the core of the proposed service. Frequency, scope and notice periods would be agreed in writing before any cleaning starts.",
  },
  {
    q: "Do you provide cleaning supplies?",
    a: "The intention is to supply professional cleaning products and equipment as standard. Consumables such as hand towels, soap and toilet rolls could be replenished for you, with supplies billed separately or provided by you.",
  },
  {
    q: "Can I change my cleaning schedule?",
    a: "Schedules are intended to be flexible. You would be able to add, reduce or move visits with reasonable notice, for example during holiday periods or busy seasons.",
  },
  {
    q: "How do I request a quotation?",
    a: "Use the Get a Quote button to build an illustrative estimate in under two minutes, then request a formal quote with your selections prefilled. You can also use the contact form. On this demo website, no enquiry is actually sent.",
  },
] as const;

/* ---------------- Service area (illustrative) ---------------- */
export const serviceAreas = [
  { id: "manchester", name: "Manchester city centre", x: 50, y: 52, primary: true, note: "Proposed primary focus: city-centre offices, retail and residential buildings." },
  { id: "salford", name: "Salford", x: 38, y: 49, note: "Including MediaCityUK and surrounding business districts (to be confirmed)." },
  { id: "trafford", name: "Trafford", x: 36, y: 64, note: "Business parks and retail locations under consideration." },
  { id: "stockport", name: "Stockport", x: 63, y: 74, note: "Town centre and surrounding commercial areas under consideration." },
  { id: "tameside", name: "Tameside", x: 72, y: 52, note: "Possible future expansion area." },
  { id: "oldham", name: "Oldham", x: 70, y: 32, note: "Possible future expansion area." },
  { id: "rochdale", name: "Rochdale", x: 62, y: 16, note: "Possible future expansion area." },
  { id: "bury", name: "Bury", x: 46, y: 22, note: "Possible future expansion area." },
  { id: "bolton", name: "Bolton", x: 27, y: 26, note: "Possible future expansion area." },
  { id: "wigan", name: "Wigan", x: 12, y: 38, note: "Possible future expansion area." },
] as const;

/* ---------------- About ---------------- */
export const values = [
  { title: "Care in the details", body: "The difference between clean and exceptionally clean is in corners, edges and touchpoints. That’s where we’d focus." },
  { title: "Reliability by design", body: "Clear scopes, planned schedules and simple checklists — systems that make consistency the default." },
  { title: "Honest communication", body: "Realistic promises, transparent pricing and a quick response when something needs attention." },
  { title: "Respect for your space", body: "Working discreetly around your people, customers and property, as a trusted extension of your team." },
] as const;
