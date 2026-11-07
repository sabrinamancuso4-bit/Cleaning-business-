import { images, type SiteImage } from "@/config/images";
import type { PropertyTypeId } from "@/config/pricing";

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  intro: string;
  image: SiteImage;
  /** Property type preselected when a quote is started from this service. */
  quoteType: PropertyTypeId;
  included: string[];
  suitableFor: string[];
  frequencies: string[];
  exampleTasks: string[];
};

export const services: Service[] = [
  {
    slug: "office-cleaning",
    title: "Office Cleaning",
    shortTitle: "Offices",
    summary: "Workspaces, meeting rooms and receptions kept consistently presentable for teams and visitors.",
    intro:
      "A routine clean designed around how your office is used — from busy hot-desking floors to quiet private suites — scheduled so it never gets in the way of the working day.",
    image: images.office,
    quoteType: "office",
    included: [
      "Desks, worktops and touchpoints wiped and sanitised",
      "Floors vacuumed and hard floors mopped",
      "Kitchens and tea points cleaned and tidied",
      "Washrooms cleaned and checked",
      "Bins emptied and liners replaced",
    ],
    suitableFor: ["Corporate offices", "Co-working spaces", "Agencies and studios", "Professional services firms"],
    frequencies: ["Once per week", "Two to three times per week", "Daily (Monday–Friday)", "Custom schedule"],
    exampleTasks: [
      "Dust and wipe monitors, phones and desk surfaces (clear desks only)",
      "Clean meeting room tables and reset chairs",
      "Polish reception glass and entrance doors",
      "Spot-clean marks on walls and door frames",
    ],
  },
  {
    slug: "retail-cleaning",
    title: "Retail Cleaning",
    shortTitle: "Retail",
    summary: "Shop floors, fitting rooms and displays prepared to make the right first impression.",
    intro:
      "Customers notice the details. Retail cleaning focuses on high-visibility areas — entrances, glazing, displays and floors — with visits timed before opening or after close.",
    image: images.retail,
    quoteType: "retail",
    included: [
      "Shop floor vacuuming and mopping",
      "Entrance mats, doors and shopfront glazing (internal)",
      "Fitting rooms, mirrors and counters",
      "Stock room and staff area tidy",
      "Customer and staff washrooms",
    ],
    suitableFor: ["Independent boutiques", "Showrooms", "Concept stores", "Small retail chains"],
    frequencies: ["Daily before opening", "Three times per week", "Weekly with periodic deep cleans"],
    exampleTasks: [
      "Dust shelving and display units (without moving stock)",
      "Clean till points and card terminals",
      "Remove fingerprints from glass cabinets",
      "Spot-clean high-traffic floor areas",
    ],
  },
  {
    slug: "salon-beauty-cleaning",
    title: "Salon & Beauty Cleaning",
    shortTitle: "Salons",
    summary: "Calm, polished treatment spaces for hair, beauty and barbering businesses.",
    intro:
      "Salons depend on a calm, spotless atmosphere. This service supports the hygiene routines your team already follows, focusing on floors, stations, basins and client areas.",
    image: images.salon,
    quoteType: "salon",
    included: [
      "Styling stations, mirrors and chairs",
      "Backwash basins and surrounding surfaces",
      "Reception and waiting area",
      "Hair and product residue removal from floors",
      "Washrooms and staff areas",
    ],
    suitableFor: ["Hair salons", "Barbershops", "Beauty and nail studios", "Aesthetics studios (non-clinical areas)"],
    frequencies: ["Daily after close", "Two to three times per week", "Weekly deep reset"],
    exampleTasks: [
      "Degrease mirrors and polish chrome fittings",
      "Clean product shelving and retail displays",
      "Wipe and sanitise chair arms and headrests",
      "Clean skirting and corners where hair collects",
    ],
  },
  {
    slug: "communal-area-cleaning",
    title: "Communal Area Cleaning",
    shortTitle: "Communal areas",
    summary: "Entrances, stairwells and corridors maintained for residents and property managers.",
    intro:
      "Shared spaces set the tone for the whole building. A predictable schedule, clear visit records and simple issue reporting are designed to make life easier for property managers.",
    image: images.communal,
    quoteType: "communal",
    included: [
      "Entrance lobbies, doors and letterbox areas",
      "Stairwells, landings and handrails",
      "Corridors and lift interiors",
      "Internal glass and light switches",
      "Bin store tidy (where agreed)",
    ],
    suitableFor: ["Apartment buildings", "Property management companies", "Residents' associations", "Mixed-use buildings"],
    frequencies: ["Weekly", "Fortnightly", "Twice per week for larger blocks"],
    exampleTasks: [
      "Vacuum and mop stairs and landings",
      "Wipe handrails, door handles and lift buttons",
      "Remove cobwebs from ceilings and corners",
      "Report maintenance issues spotted during visits",
    ],
  },
  {
    slug: "clinic-cleaning",
    title: "Clinic Cleaning",
    shortTitle: "Clinics",
    summary: "Reception, waiting and administrative areas for private clinics and dental practices.",
    intro:
      "Clinical environments have strict requirements. Initially, this proposed service would cover non-clinical areas only. Cleaning of clinical areas is a future capability that would require suitable training, documented procedures and agreement with each practice.",
    image: images.clinic,
    quoteType: "clinic",
    included: [
      "Reception desks and waiting areas",
      "Administrative offices",
      "Staff rooms and kitchens",
      "Patient and staff washrooms",
      "Floors in non-clinical areas",
    ],
    suitableFor: ["Private clinics (non-clinical areas)", "Dental practices (non-clinical areas)", "Physiotherapy studios", "Wellbeing centres"],
    frequencies: ["Daily after close", "Three times per week", "Custom schedule agreed with the practice"],
    exampleTasks: [
      "Sanitise high-touch points in waiting areas",
      "Clean reception screens and counters",
      "Follow the practice’s own cleaning protocols and colour-coding",
      "Record visits on an agreed checklist",
    ],
  },
  {
    slug: "deep-cleaning",
    title: "Deep Cleaning",
    shortTitle: "Deep cleaning",
    summary: "Periodic, detailed cleans that reach the areas routine visits do not.",
    intro:
      "Deep cleans complement a regular contract — scheduled monthly, quarterly or ahead of a move-in, inspection or reopening — to reset a space thoroughly.",
    image: images.deepClean,
    quoteType: "other",
    included: [
      "High and low-level dusting",
      "Detailed washroom and kitchen descaling",
      "Skirting boards, doors and frames",
      "Inside appliances and cupboards (where agreed)",
      "Intensive floor care",
    ],
    suitableFor: ["Any premises on a regular contract", "Pre-opening or post-refurbishment", "Seasonal resets", "End of tenancy (commercial)"],
    frequencies: ["Monthly", "Quarterly", "One-off alongside a regular contract"],
    exampleTasks: [
      "Clean vents, light fittings and high ledges",
      "Descale taps, basins and glass partitions",
      "Move and clean behind light furniture",
      "Machine-scrub hard floors",
    ],
  },
];
