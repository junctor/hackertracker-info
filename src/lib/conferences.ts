export type ConferenceSlug = "dcsg2026" | "defcon33";

export type SiteMenuKey =
  | "readme"
  | "announcements"
  | "schedule"
  | "bookmarks"
  | "content"
  | "people"
  | "maps"
  | "locations"
  | "merch"
  | "search"
  | "villages"
  | "communities"
  | "contests"
  | "exhibitors"
  | "vendors";

export type ConferenceManifest = {
  slug: ConferenceSlug;
  code: string;
  name: string;
  timezone: string;
  dataRoot: string;
  siteMenu: SiteMenuKey[];
};

export const CONFERENCES: Record<ConferenceSlug, ConferenceManifest> = {
  dcsg2026: {
    slug: "dcsg2026",
    code: "DCSG2026",
    name: "DEF CON Singapore 2026",
    timezone: "Asia/Singapore",
    dataRoot: "/ht/dcsg2026",
    siteMenu: [
      "readme",
      "announcements",
      "villages",
      "communities",
      "contests",
    ],
  },
  defcon33: {
    slug: "defcon33",
    code: "DEFCON33",
    name: "DEF CON 33",
    timezone: "America/Los_Angeles",
    dataRoot: "/ht/defcon33",
    siteMenu: [
      "readme",
      "announcements",
      "bookmarks",
      "content",
      "schedule",
      "people",
      "maps",
      "locations",
      "merch",
      "search",
    ],
  },
} as const;

export function getConference(input: string) {
  const key = input.trim().toLowerCase() as ConferenceSlug;
  return CONFERENCES[key] ?? null;
}
