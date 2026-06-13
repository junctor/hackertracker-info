export type ConferenceSlug =
  | "dcme2026"
  | "dcsg2026"
  | "defcon33"
  | "defcon34"
  | "defconbahrain2025";

export type SiteMenuKey =
  | "announcements"
  | "bookmarks"
  | "communities"
  | "content"
  | "contests"
  | "departments"
  | "exhibitors"
  | "locations"
  | "maps"
  | "merch"
  | "people"
  | "readme"
  | "schedule"
  | "search"
  | "vendors"
  | "villages";

export type ConferenceManifest = {
  // Identity
  slug: ConferenceSlug;
  code: string;
  name: string;

  // Display
  dateLabel: string;
  tagline: string | null;
  timezone: string;
  logoFile: string;
  showOnHome: boolean;

  // Time (canonical, machine-readable)
  kickoff: string; // IsoUtcTimestamp;
  begin: string; // IsoUtcTimestamp;
  end: string; // IsoUtcTimestamp;

  // Data + nav
  dataRoot: string;
  siteMenu: SiteMenuKey[];
};

export const CONFERENCES: Record<ConferenceSlug, ConferenceManifest> = {
  dcme2026: {
    slug: "dcme2026",
    code: "DCME2026",
    name: "DEF CON Middle East 2026",

    dateLabel: "November 11–12, 2026",
    tagline: null,
    timezone: "Asia/Bahrain",
    logoFile: "logos/conferences/dcme-logo.webp",
    showOnHome: false,

    kickoff: "2026-11-11T06:00:00Z",
    begin: "2026-11-09T16:00:00Z",
    end: "2026-11-12T15:59:59Z",

    dataRoot: "/ht/dcme2026",
    siteMenu: ["announcements", "readme", "search"],
  },

  defcon34: {
    slug: "defcon34",
    code: "DEFCON34",
    name: "DEF CON 34",

    dateLabel: "August 6–9, 2026",
    tagline: "Welcome to DEF CON - the largest hacker conference in the world.",
    timezone: "America/Los_Angeles",
    logoFile: "logos/conferences/dc-34-logo.svg",
    showOnHome: true,

    kickoff: "2026-08-07T17:00:00Z",
    begin: "2026-08-06T07:00:00Z",
    end: "2026-08-10T06:59:59Z",

    dataRoot: "/ht/defcon34",
    siteMenu: ["communities", "content", "contests", "readme", "search", "villages"],
  },

  dcsg2026: {
    slug: "dcsg2026",
    code: "DCSG2026",
    name: "DEF CON Singapore 2026",

    dateLabel: "April 28–30, 2026",
    tagline: null,
    timezone: "Asia/Singapore",
    logoFile: "logos/conferences/dcsingapore.webp",
    showOnHome: false,

    kickoff: "2026-04-28T01:00:00Z",
    begin: "2026-04-25T16:00:00Z",
    end: "2026-04-30T15:59:59Z",

    dataRoot: "/ht/dcsg2026",
    siteMenu: [
      "announcements",
      "communities",
      "content",
      "contests",
      "people",
      "readme",
      "schedule",
      "search",
      "villages",
    ],
  },

  defconbahrain2025: {
    slug: "defconbahrain2025",
    code: "DEFCONBAHRAIN2025",
    name: "DEF CON Bahrain 2025",

    dateLabel: "November 5–6, 2025",
    tagline: null,
    timezone: "Asia/Bahrain",
    logoFile: "logos/conferences/dc-bahrain-logo.webp",
    showOnHome: false,

    kickoff: "2025-11-05T06:00:00Z",
    begin: "2025-11-03T16:00:00Z",
    end: "2025-11-06T15:59:59Z",

    dataRoot: "/ht/defconbahrain2025",
    siteMenu: [
      "announcements",
      "communities",
      "content",
      "contests",
      "people",
      "readme",
      "schedule",
      "search",
      "villages",
    ],
  },

  defcon33: {
    slug: "defcon33",
    code: "DEFCON33",
    name: "DEF CON 33",

    dateLabel: "August 7–10, 2025",
    tagline: "Welcome to DEF CON - the largest hacker conference in the world.",
    timezone: "America/Los_Angeles",
    logoFile: "logos/conferences/dc33-logo.webp",
    showOnHome: false,

    kickoff: "2025-08-07T17:00:00Z",
    begin: "2025-08-06T07:00:00Z",
    end: "2025-08-10T06:59:59Z",

    dataRoot: "/ht/defcon33",
    siteMenu: [
      "announcements",
      "communities",
      "content",
      "contests",
      "people",
      "readme",
      "schedule",
      "search",
      "villages",
    ],
  },
} as const;

export function isConferenceSlug(x: string): x is ConferenceSlug {
  return x in CONFERENCES;
}

export function getConference(input: string) {
  const key = input.trim().toLowerCase();
  return isConferenceSlug(key) ? CONFERENCES[key] : null;
}
