/**
 * Central brand + site configuration.
 *
 * FORM Commercial Cleaning is a TEMPORARY placeholder name. Change the values
 * below and the whole site updates (header, footer, metadata, copy that
 * references the brand, forms and the quote estimator).
 */
export const siteConfig = {
  /** Full trading name shown in metadata, footer and copy. */
  name: "FORM Commercial Cleaning",
  /** Short wordmark used in the logo. */
  shortName: "FORM",
  /** Small descriptor shown beside the wordmark. */
  descriptor: "Commercial Cleaning",
  tagline: "Exceptional Spaces. Effortlessly Maintained.",
  description:
    "Proposed recurring commercial cleaning for offices, salons, retail, communal areas and clinics across Manchester. Interactive demonstration website.",
  copyrightYear: 2026,
  city: "Manchester",
  region: "Greater Manchester",
  country: "United Kingdom",

  /** All contact details are placeholders. Replace before going live. */
  contact: {
    phone: "0161 000 0000",
    phoneHref: "tel:+441610000000",
    email: "hello@example.com",
    address: "Demo address, Manchester, UK",
    hours: "Mon–Fri, 8:00–18:00 (proposed)",
  },

  social: [
    { label: "LinkedIn", href: "#social-placeholder" },
    { label: "Instagram", href: "#social-placeholder" },
  ],

  /** Shown in the demo indicator and confirmation messages. */
  demoNotice:
    "This is a demonstration website. No business is trading under this name, and no enquiries are sent or stored.",
} as const;

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "Our Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const legalNav = [
  { label: "Privacy notice", href: "/privacy" },
  { label: "Terms of use", href: "/terms" },
] as const;
