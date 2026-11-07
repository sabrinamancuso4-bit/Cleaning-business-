# FORM Commercial Cleaning — interactive demo website

A working prototype for a **proposed** B2B commercial cleaning business in Manchester, UK.
"FORM Commercial Cleaning" is a placeholder name. Nothing on this site trades, sends, or stores data.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn-style components on Radix UI,
Motion, Lucide icons, react-hook-form, and Zod. No API keys, database, or paid services are needed. Fonts are
self-hosted from npm, so the site also runs offline.

## Run it locally

Requires Node.js 20.9 or newer (22.18+ to run `npm test`, which uses built-in TypeScript type stripping).

```bash
npm install
npm run dev          # http://localhost:3000 (development)

# or build and serve a production build
npm run build
npm start            # http://localhost:3000
```

Other scripts:

| Command             | What it does                                       |
| ------------------- | -------------------------------------------------- |
| `npm run lint`      | ESLint                                             |
| `npm run typecheck` | TypeScript, no emit                                |
| `npm test`          | Unit tests for the pricing calculator (Node test runner) |
| `npm run images`    | Regenerates the placeholder images                 |

## What's included

- **Pages:** Home, Our Services, Industries, How It Works, About Us, Contact, Privacy, Terms, and a 404 page.
- **Quote estimator** (`src/components/quote/`). It's a five-step dialog that every "Get a Quote" button opens.
  Choose a property type, size, frequency (including a custom number of visits) and extras. It then shows an
  illustrative monthly estimate, the assumptions behind it, and Edit links for each step. "Request a Formal Quote"
  opens a demo enquiry form with your selections prefilled. Service and industry buttons preselect the property
  type. Frequency-plan buttons also preselect the size and frequency.
- **Interactive sections:** a frequency comparison that recalculates by office size, the process steps (keyboard
  accessible tabs), an industry explorer, an FAQ accordion, a diagram of the service area, a sticky quote bar on
  mobile, and a visible "Demo website" bar.
- **Forms:** validation runs in the browser, with error, loading and confirmation states. **Nothing is transmitted
  or stored.**
- **Accessibility:** semantic landmarks, a skip link, focus management in dialogs, visible focus rings, support for
  reduced motion, and touch targets of 40px or more.

## Customising

### Business name and contact details
Edit **`src/config/site.ts`**. The name, logo wordmark, tagline, placeholder phone/email/address, social links,
navigation and demo notice all come from this file. For a different logo mark, edit the inline SVG in
`src/components/layout/logo.tsx`, and edit `src/app/icon.svg` for the favicon.

### Colours and fonts
Edit the `@theme` block at the top of **`src/app/globals.css`**:

```css
--color-navy: #142638;   /* deep navy */
--color-paper: #fafaf7;  /* warm white */
--color-mist: #edf0f1;   /* soft grey */
--color-teal: #3f817d;   /* muted teal */
--color-charcoal: #20272b;
```

Every utility (`bg-navy`, `text-teal`, …) updates automatically. Fonts are imported in `src/app/layout.tsx`
(`@fontsource-variable/manrope` and `inter`) and mapped to `--font-display` and `--font-sans`.

### Images
Every image is listed in **`src/config/images.ts`** with its alt text. The current files in
`public/images/placeholders/` are generated architectural renders. They stand in for photography and are not
real premises. To use real photos:

1. Add files, for example `public/images/hero-office.jpg`.
2. Change the `src` (and `alt`) in `src/config/images.ts`.

JPG/PNG/WebP files are optimised by `next/image` automatically. SVGs are served as they are.

### Pricing assumptions
Edit **`src/config/pricing.ts`**. It holds:

- `pricingConfig`: the example hourly rate (£19.50), weeks per month, minimum hours per visit, the out-of-hours
  uplift, the ± range shown, and rounding.
- `propertyTypes`: an intensity multiplier for each premises type.
- `sizes`: the assumed hours per routine visit for each size band.
- `frequencies`, `customVisitsRange`: visits per week.
- `extras`: extra hours per visit, monthly deep-clean hours, flat monthly fees or rate uplifts.

The formula is `monthly hours = max(min, base × multiplier + extra hours) × visits/week × 52/12 + deep-clean hours`,
then `price = hours × hourly rate × uplift + monthly fees`. The estimator, frequency comparison and assumptions
panel all read from this file. Run `npm test` after any change.

### Copy
Services, industries, FAQs, process steps, values and service areas are structured data in
`src/data/services.ts` and `src/data/content.ts`.

## Honesty guardrails

The content deliberately avoids testimonials, ratings, client logos, accreditations, team members, and claims
about trading history. Clinical cleaning is described as a future capability only. Estimates are labelled
illustrative throughout, and the site sets `noindex`. Keep these guardrails until the claims genuinely become true.
