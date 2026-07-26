export type ConferenceSlug =
  | "dcme2026"
  | "dcsg2026"
  | "dctsg202610"
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
  displayTitle?: string;
  shortTitle?: string;

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
  schedulePath?: string;
  externalTrackerUrl?: string;
};

export const CONFERENCES: Record<ConferenceSlug, ConferenceManifest> = {
  dctsg202610: {
    slug: "dctsg202610",
    code: "DCTSG202610",
    name: "DEF CON Training Singapore October 2026",
    shortTitle: "DC Training Singapore",

    dateLabel: "September 30–October 2, 2026",
    tagline: null,
    timezone: "Asia/Singapore",
    logoFile: "logos/conferences/defcon-training.WEBP",
    showOnHome: true,

    kickoff: "2026-10-01T00:00:00Z",
    begin: "2026-09-30T16:00:00Z",
    end: "2026-10-02T15:59:00Z",

    dataRoot: "/ht/dctsg202610",
    siteMenu: ["announcements", "readme", "search"],
    externalTrackerUrl: "/apps",
  },

  dcme2026: {
    slug: "dcme2026",
    code: "DCME2026",
    name: "DEF CON Middle East 2026",
    shortTitle: "DC Middle East",

    dateLabel: "November 11–12, 2026",
    tagline: null,
    timezone: "Asia/Bahrain",
    logoFile: "logos/conferences/dc-middle-east-2026.jpg",
    showOnHome: true,

    kickoff: "2026-11-11T07:00:00Z",
    begin: "2026-11-10T21:00:00Z",
    end: "2026-11-12T20:59:00Z",

    dataRoot: "/ht/dcme2026",
    siteMenu: ["announcements", "readme", "search"],
    externalTrackerUrl: "/apps",
  },

  defcon34: {
    slug: "defcon34",
    code: "DEFCON34",
    name: "DEF CON 34",
    shortTitle: "DEF CON 34",

    dateLabel: "August 6–9, 2026",
    tagline: "Welcome to DEF CON - the largest hacker conference in the world.",
    timezone: "America/Los_Angeles",
    logoFile: "logos/conferences/dc-34-logo.svg",
    showOnHome: true,

    kickoff: "2026-08-07T17:00:00Z",
    begin: "2026-08-06T07:00:00Z",
    end: "2026-08-10T06:59:59Z",

    dataRoot: "/ht/defcon34",
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
    schedulePath: "/defcon34/schedule/",
    externalTrackerUrl: "/apps",
  },

  dcsg2026: {
    slug: "dcsg2026",
    code: "DCSG2026",
    name: "DEF CON Singapore 2026",
    shortTitle: "DC Singapore",

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
      "maps",
      "people",
      "readme",
      "schedule",
      "search",
      "villages",
    ],
    schedulePath: "/dcsg2026/schedule/",
    externalTrackerUrl: "/apps",
  },

  defconbahrain2025: {
    slug: "defconbahrain2025",
    code: "DEFCONBAHRAIN2025",
    name: "DEF CON Bahrain 2025",
    shortTitle: "DC Bahrain",

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
    schedulePath: "/defconbahrain2025/schedule/",
    externalTrackerUrl: "/apps",
  },

  defcon33: {
    slug: "defcon33",
    code: "DEFCON33",
    name: "DEF CON 33",
    shortTitle: "DEF CON 33",

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
      "maps",
      "people",
      "readme",
      "schedule",
      "search",
      "villages",
    ],
    schedulePath: "/defcon33/schedule/",
    externalTrackerUrl: "/apps",
  },
} as const;

export function isConferenceSlug(x: string): x is ConferenceSlug {
  return x in CONFERENCES;
}

export function getConference(input: string) {
  const key = input.trim().toLowerCase();
  return isConferenceSlug(key) ? CONFERENCES[key] : null;
}
