/**
 * Image registry.
 *
 * Every image on the site is referenced from here. The current files are
 * generated architectural placeholders (see scripts/generate-placeholders.mjs).
 * To use real photography, drop files into /public/images and change `src`
 * (e.g. "/images/hero-office.jpg"). Keep the alt text accurate.
 */
export type SiteImage = { src: string; alt: string };

const ph = (name: string) => `/images/placeholders/${name}.svg`;

export const images = {
  hero: {
    src: ph("hero-modern-office"),
    alt: "Placeholder: bright open-plan office with rows of tidy desks, floor-to-ceiling windows and a city view",
  },
  office: {
    src: ph("service-office"),
    alt: "Placeholder: modern office workspace with clear desks and timber flooring",
  },
  meetingRoom: {
    src: ph("meeting-room"),
    alt: "Placeholder: pristine meeting room with a long table, glazed wall and timber feature panel",
  },
  retail: {
    src: ph("service-retail"),
    alt: "Placeholder: clean boutique retail interior with shelving, clothing rails and pendant lighting",
  },
  salon: {
    src: ph("service-salon"),
    alt: "Placeholder: calm beauty salon interior with round mirrors and styling chairs",
  },
  communal: {
    src: ph("service-communal"),
    alt: "Placeholder: apartment building entrance lobby with letterboxes, staircase and glazed door",
  },
  clinic: {
    src: ph("service-clinic"),
    alt: "Placeholder: bright clinic reception with a white desk and waiting area seating",
  },
  deepClean: {
    src: ph("service-deep-cleaning"),
    alt: "Placeholder: commercial corridor with a cleaning trolley and floor-care machine",
  },
  outOfHours: {
    src: ph("out-of-hours-cleaning"),
    alt: "Placeholder: office at dusk with a cleaning trolley between desks, representing out-of-hours cleaning",
  },
  about: {
    src: ph("about-workspace"),
    alt: "Placeholder: calm, light-filled breakout space with tall windows and plants",
  },
} satisfies Record<string, SiteImage>;
