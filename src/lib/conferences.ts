export type ConferenceSlug = "dcsg2026" | "defcon33";

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

  // Time (canonical, machine-readable)
  kickoff: string; // IsoUtcTimestamp;
  begin: string; // IsoUtcTimestamp;
  end: string; // IsoUtcTimestamp;

  // Data + nav
  dataRoot: string;
  siteMenu: SiteMenuKey[];
};

export const CONFERENCES: Record<ConferenceSlug, ConferenceManifest> = {
  dcsg2026: {
    slug: "dcsg2026",
    code: "DCSG2026",
    name: "DEF CON Singapore 2026",

    dateLabel: "April 28–30, 2026",
    tagline: null,
    timezone: "Asia/Singapore",
    logoFile: "dcsingapore.webp",
    kickoff: "2026-04-28T01:00:00Z",
    begin: "2026-04-25T16:00:00Z",
    end: "2026-04-30T15:59:59Z",

    dataRoot: "/ht/dcsg2026",
    siteMenu: [
      "announcements",
      "communities",
      "contests",
      "readme",
      "villages",
    ],
  },

  defcon33: {
    slug: "defcon33",
    code: "DEFCON33",
    name: "DEF CON 33",

    dateLabel: "August 8–10, 2025",
    tagline: "Welcome to DEF CON - the largest hacker conference in the world.",
    timezone: "America/Los_Angeles",
    logoFile: "dcsingapore.webp",

    kickoff: "2025-08-08T17:00:00Z",
    begin: "2025-08-07T07:00:00Z",
    end: "2025-08-11T06:59:59Z",

    dataRoot: "/ht/defcon33",
    siteMenu: [
      "announcements",
      "bookmarks",
      "communities",
      "content",
      "contests",
      "departments",
      "exhibitors",
      "locations",
      "maps",
      "merch",
      "people",
      "readme",
      "schedule",
      "search",
      "vendors",
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
